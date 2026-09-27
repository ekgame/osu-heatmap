import { Circle, Slider, StandardBeatmap } from "osu-standard-stable";
import type tinygradient from "tinygradient";

export const PLAYFIELD_WIDTH = 512;
export const PLAYFIELD_HEIGHT = 384;
export const PLAYFIELD_MARGIN = 55;

export const HEATMAP_WIDTH = PLAYFIELD_WIDTH + PLAYFIELD_MARGIN * 2;
export const HEATMAP_HEIGHT = PLAYFIELD_HEIGHT + PLAYFIELD_MARGIN * 2;

export const HEATMAP_RESOLUTION = 2;

/** A heatmap that finished rendering, it can be painted with any gradient. */
export interface RenderedHeatmap {
    renderToCanvas(canvas: HTMLCanvasElement, gradient: tinygradient.Instance): void;
}

class BeatmapHeatmapRenderer implements RenderedHeatmap {
    private bufferCanvas: HTMLCanvasElement;
    private bufferCanvasContext: CanvasRenderingContext2D;
    private buffer: Int32Array;
    private passes: number = 0;

    private scale: number;
    private offsetX: number;
    private offsetY: number;

    constructor(private width: number, private height: number, private circleRadius: number) {
        this.scale = this.width / HEATMAP_WIDTH;
        this.offsetX = PLAYFIELD_MARGIN;
        this.offsetY = PLAYFIELD_MARGIN;
        this.bufferCanvas = document.createElement('canvas');
        this.bufferCanvas.width = this.width;
        this.bufferCanvas.height = this.height;
        this.bufferCanvasContext = this.bufferCanvas.getContext('2d', { willReadFrequently: true })!!;
        this.bufferCanvasContext.scale(this.scale, this.scale);
        this.buffer = new Int32Array(this.width * this.height);
        this.clearBufferCanvas();
    }

    private clearBufferCanvas() {
        this.bufferCanvasContext.fillStyle = 'black';
        this.bufferCanvasContext.fillRect(0, 0, HEATMAP_WIDTH, HEATMAP_HEIGHT);
    }

    private autoFlush() {
        this.passes++;
        if (this.passes >= 20) {
            this.flush();
        }
    }

    public flush() {
        this.passes = 0;
        const imageData = this.bufferCanvasContext.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;
        const buffer = this.buffer;
        for (let index = 0; index < buffer.length; index++) {
            buffer[index] += data[index * 4];
        }
        this.clearBufferCanvas();
    }

    public renderCircle(circle: Circle) {
        this.bufferCanvasContext.beginPath();
        this.bufferCanvasContext.arc(
            this.offsetX + circle.startX, 
            this.offsetY + circle.startY,
            this.circleRadius,
            0,
            2 * Math.PI
        );
        this.bufferCanvasContext.fillStyle = 'rgba(255, 255, 255, 0.05)';
        this.bufferCanvasContext.fill();
        this.autoFlush();
    }

    public renderSlider(slider: Slider) {
        this.bufferCanvasContext.beginPath();
        this.bufferCanvasContext.moveTo(
            this.offsetX + slider.startX,
            this.offsetY + slider.startY,
        );
        slider.path.calculatedPath.forEach((point) => {
            this.bufferCanvasContext.lineTo(
                this.offsetX + slider.startX + point.x,
                this.offsetY + slider.startY + point.y,
            );
        });
        this.bufferCanvasContext.lineWidth = this.circleRadius * 2;
        this.bufferCanvasContext.lineCap = 'round';
        this.bufferCanvasContext.lineJoin = 'round';
        this.bufferCanvasContext.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.bufferCanvasContext.stroke();
        this.autoFlush();
    }

    public renderToCanvas(canvas: HTMLCanvasElement, gradient: tinygradient.Instance) {
        if (this.passes > 0) {
            this.flush();
        }

        if (canvas.width !== this.width || canvas.height !== this.height) {
            throw new Error('Canvas dimensions do not match renderer dimensions');
        }

        const context = canvas.getContext('2d')!!;
        const imageData = context.createImageData(this.width, this.height);
        const data = imageData.data;
        const buffer = this.buffer;

        let max = 0;
        for (let index = 0; index < buffer.length; index++) {
            if (buffer[index] > max) {
                max = buffer[index];
            }
        }

        const colors = gradient.rgb(Math.max(max + 1, 4)).map((color) => color.toRgb());

        for (let index = 0; index < buffer.length; index++) {
            const color = colors[buffer[index]];
            data[index * 4] = color.r;
            data[index * 4 + 1] = color.g;
            data[index * 4 + 2] = color.b;
            data[index * 4 + 3] = 255;
        }

        context.putImageData(imageData, 0, 0);

        context.strokeStyle = 'white';
        context.lineWidth = this.scale;
        context.strokeRect(
            this.offsetX * this.scale,
            this.offsetY * this.scale,
            PLAYFIELD_WIDTH * this.scale,
            PLAYFIELD_HEIGHT * this.scale,
        );
    }
}

function* chunks<T>(arr: T[], n: number): Generator<T[], void> {
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
}

export interface RenderingProgress {
    finished: boolean;
    max: number;
    current: number;
}

export interface AbortRenderingSignal {
    abort: () => void;
}

export function render(
    beatmap: StandardBeatmap,
    canvas: HTMLCanvasElement,
    progressUpdate: (progress: RenderingProgress) => void,
    onFinished: (heatmap: RenderedHeatmap) => void,
): AbortRenderingSignal {
    const context = canvas.getContext('2d')!!;
    if (!context) {
        throw new Error('Could not get 2d context');
    }

    const circleSize = beatmap.difficulty.circleSize;
    const circleRadius = 54.4 - 4.48 * circleSize;
    const heatmapRenderer = new BeatmapHeatmapRenderer(canvas.width, canvas.height, circleRadius);
    const totalObjects = beatmap.hitObjects.length;
    let totalProcessed = 0;
    const objectChunks = [...chunks(beatmap.hitObjects, 10)];

    let isAborted = false;

    progressUpdate({
        finished: false,
        max: totalObjects,
        current: totalProcessed,
    });

    function doChunk() {
        if (isAborted) {
            return;
        }

        if (objectChunks.length === 0) {
            heatmapRenderer.flush();
            onFinished(heatmapRenderer);

            progressUpdate({
                finished: true,
                max: totalObjects,
                current: totalProcessed,
            });
            return;
        }

        const chunk = objectChunks.shift()!!;

        chunk.forEach((hitObject) => {
            if (isAborted) {
                return;
            }
            if (hitObject instanceof Circle) {
                heatmapRenderer.renderCircle(hitObject);
            }
            else if (hitObject instanceof Slider) {
                heatmapRenderer.renderSlider(hitObject);
            }
            totalProcessed++;
        });

        if (!isAborted) {
            progressUpdate({
                finished: false,
                max: totalObjects,
                current: totalProcessed,
            });

            setTimeout(doChunk, 0);
        }
    }

    setTimeout(doChunk, 0);

    return {
        abort() {
            isAborted = true;
        }
    };
}
