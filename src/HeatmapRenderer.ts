import { Circle, Slider, StandardBeatmap } from "osu-standard-stable";
import tinygradient from "tinygradient";

class BeatmapHeatmapRenderer {
    private bufferCanvas: HTMLCanvasElement;
    private bufferCanvasContext: CanvasRenderingContext2D;
    private buffer: Int32Array;
    private passes: number = 0;
    
    private offsetX: number;
    private offsetY: number;

    constructor(private width: number, private height: number, private circleRadius: number) {
        this.offsetX = (this.width - 512) / 2;
        this.offsetY = (this.height - 384) / 2;
        this.bufferCanvas = document.createElement('canvas');
        this.bufferCanvas.width = this.width;
        this.bufferCanvas.height = this.height;
        this.bufferCanvasContext = this.bufferCanvas.getContext('2d')!!;
        this.buffer = new Int32Array(this.width * this.height);
        this.clearBufferCanvas();
    }

    private clearBufferCanvas() {
        this.bufferCanvasContext.fillStyle = 'black';
        this.bufferCanvasContext.fillRect(0, 0, this.width, this.height);
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
        this.buffer.forEach((_, index) => {
            this.buffer[index] += data[index * 4];
        });
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
        
        const max = this.buffer.reduce((a, b) => Math.max(a, b));
        const colors = gradient.rgb(max + 1);

        this.buffer.forEach((value, index) => {
            const color = colors[value].toRgb();
            imageData.data[index * 4] = color.r;
            imageData.data[index * 4 + 1] = color.g;
            imageData.data[index * 4 + 2] = color.b;
            imageData.data[index * 4 + 3] = 255;
        });

        context.putImageData(imageData, 0, 0);

        // render playfield border
        context.strokeStyle = 'white';
        context.lineWidth = 1;
        context.strokeRect(this.offsetX, this.offsetY, 512, 384);
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
            const gradient = tinygradient([
                {color: 'black', pos: 0},
                {color: '#e93e3a', pos: 0.2},
                {pos: 0.4},
                {color: '#FFF33B', pos: 1}
            ]);
        
            heatmapRenderer.renderToCanvas(canvas, gradient);

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