import FileSaver from "file-saver";
import { useEffect, useRef, useState } from "react";
import { LuDownload, LuMaximize, LuMinus, LuPlus } from "react-icons/lu";
import {
    TransformComponent,
    TransformWrapper,
    useControls,
} from "react-zoom-pan-pinch";
import clsx from "clsx";
import {
    HEATMAP_HEIGHT,
    HEATMAP_RESOLUTION,
    HEATMAP_WIDTH,
    type RenderingProgress,
} from "~/lib/HeatmapRenderer";

const MIN_SCALE = 0.25;
const MAX_SCALE = 16;

function clampScale(scale: number): number {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

function WheelZoom({ stage }: { stage: React.RefObject<HTMLDivElement|null> }) {
    const { instance, zoomToPoint } = useControls();

    useEffect(() => {
        const element = stage.current;
        if (!element) {
            return;
        }

        const onWheel = (event: WheelEvent) => {
            if (!instance.wrapperComponent?.contains(event.target as Node)) {
                return;
            }
            event.preventDefault();

            let delta = event.deltaY;
            if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
                delta *= 33;
            } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
                delta *= 300;
            }
            
            const speed = event.ctrlKey ? 0.01 : 0.002;
            const change = Math.max(-0.5, Math.min(0.5, -delta * speed));

            zoomToPoint(clampScale(instance.state.scale * Math.exp(change)), event.clientX, event.clientY, 0);
        };

        element.addEventListener('wheel', onWheel, { passive: false });
        return () => element.removeEventListener('wheel', onWheel);
    }, [stage, instance, zoomToPoint]);

    return null;
}

export type StageStatus =
    | { type: 'loading' }
    | { type: 'rendering', progress: RenderingProgress }
    | { type: 'cancelled' }
    | { type: 'error', message: string }
    | { type: 'done' };

function ToolbarButton({ label, onClick, disabled, children }: {
    label: string,
    onClick: () => void,
    disabled?: boolean,
    children: React.ReactNode,
}) {
    return (
        <button
            type="button"
            className="flex size-9 cursor-pointer items-center justify-center rounded-xs text-ink-300 transition-colors hover:bg-ink-700 hover:text-ink-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={label}
            title={label}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

function Toolbar({ scale, canDownload, onDownload }: {
    scale: number,
    canDownload: boolean,
    onDownload: () => void,
}) {
    const { instance, zoomToPoint, fitToView } = useControls();

    function zoomBy(factor: number) {
        const wrapper = instance.wrapperComponent?.getBoundingClientRect();
        if (wrapper) {
            zoomToPoint(
                clampScale(instance.state.scale * factor),
                wrapper.left + wrapper.width / 2,
                wrapper.top + wrapper.height / 2,
                200,
            );
        }
    }

    return (
        <div className="flex shrink-0 items-center justify-center gap-0.5 border-t border-ink-700 bg-ink-900 p-1">
            <ToolbarButton label="Zoom out" onClick={() => zoomBy(1 / 1.5)}>
                <LuMinus size={18} />
            </ToolbarButton>
            <div className="w-14 text-center text-sm tabular-nums text-ink-300">{Math.round(scale * 100)}%</div>
            <ToolbarButton label="Zoom in" onClick={() => zoomBy(1.5)}>
                <LuPlus size={18} />
            </ToolbarButton>
            <ToolbarButton label="Fit to screen" onClick={() => fitToView()}>
                <LuMaximize size={18} />
            </ToolbarButton>
            <div className="mx-1 h-6 w-px bg-ink-700" />
            <ToolbarButton label="Download as image" disabled={!canDownload} onClick={onDownload}>
                <LuDownload size={18} />
            </ToolbarButton>
        </div>
    );
}

function StatusCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="pointer-events-none absolute inset-0 bottom-11 flex items-center justify-center p-4">
            <div className="pointer-events-auto flex w-80 max-w-full flex-col gap-3 rounded-xs border border-ink-700 bg-ink-900 p-4">
                {children}
            </div>
        </div>
    );
}

function ProgressBar({ value, max }: { value?: number, max?: number }) {
    const isIndeterminate = value === undefined || !max;
    return (
        <div
            className="h-1 overflow-hidden bg-ink-700"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={value}
        >
            <div
                className={clsx('h-full bg-accent', isIndeterminate && 'animate-indeterminate w-2/5')}
                style={isIndeterminate ? undefined : { width: `${(value / max) * 100}%` }}
            />
        </div>
    );
}

export function HeatmapStage({ canvasRef, status, downloadName, onCancel, onRetry }: {
    canvasRef: React.Ref<HTMLCanvasElement>,
    status: StageStatus,
    downloadName: string,
    onCancel: () => void,
    onRetry: () => void,
}) {
    const stage = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    function download() {
        stage.current?.querySelector('canvas')?.toBlob((blob) => {
            if (blob) {
                FileSaver.saveAs(blob, `${downloadName}.png`);
            }
        });
    }

    return (
        <div ref={stage} className="relative flex h-full w-full flex-col overflow-hidden bg-black">
            <TransformWrapper
                fitOnInit
                centerOnInit
                minScale={MIN_SCALE}
                maxScale={MAX_SCALE}
                wheel={{ disabled: true }}
                doubleClick={{ mode: 'toggle', step: 1 }}
                keyboard={{ disabled: false }}
                onInit={(ref) => setScale(ref.state.scale)}
                onTransform={(_, state) => setScale(state.scale)}
            >
                <TransformComponent
                    wrapperStyle={{ width: '100%', flex: 1, minHeight: 0, cursor: 'grab' }}
                    wrapperProps={{ 'aria-label': 'Heatmap, drag to pan and scroll to zoom' }}
                >
                    <canvas
                        ref={canvasRef}
                        width={HEATMAP_WIDTH * HEATMAP_RESOLUTION}
                        height={HEATMAP_HEIGHT * HEATMAP_RESOLUTION}
                        style={{ width: HEATMAP_WIDTH, height: HEATMAP_HEIGHT }}
                        className={clsx('block transition-opacity', status.type !== 'done' && 'opacity-25')}
                    />
                </TransformComponent>
                <WheelZoom stage={stage} />
                <Toolbar scale={scale} canDownload={status.type === 'done'} onDownload={download} />
            </TransformWrapper>

            {status.type === 'loading' && (
                <StatusCard>
                    <div>Loading beatmap...</div>
                    <ProgressBar />
                </StatusCard>
            )}

            {status.type === 'rendering' && (
                <StatusCard>
                    <div className="flex justify-between gap-4">
                        <span>Rendering heatmap...</span>
                        <span className="tabular-nums text-ink-300">
                            {status.progress.current}/{status.progress.max}
                        </span>
                    </div>
                    <ProgressBar value={status.progress.current} max={status.progress.max} />
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                </StatusCard>
            )}

            {status.type === 'cancelled' && (
                <StatusCard>
                    <div>Rendering was cancelled.</div>
                    <button type="button" className="btn btn-primary" onClick={onRetry}>Render again</button>
                </StatusCard>
            )}

            {status.type === 'error' && (
                <StatusCard>
                    <div className="font-semibold">Uh oh</div>
                    <div className="text-sm text-ink-300">{status.message}</div>
                    <button type="button" className="btn btn-primary" onClick={onRetry}>Try again</button>
                </StatusCard>
            )}
        </div>
    );
}
