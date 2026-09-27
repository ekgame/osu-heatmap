import { BeatmapDecoder } from "osu-parsers";
import { StandardRuleset } from "osu-standard-stable";
import { useEffect, useRef, useState } from "react";
import { render, type AbortRenderingSignal } from "~/lib/HeatmapRenderer";
import type { BeatmapDefinition } from "~/lib/models";
import { BeatmapPanel, type ViewerVersion } from "./BeatmapPanel";
import { HeatmapStage, type StageStatus } from "./HeatmapStage";

export function HeatmapViewer({ beatmap, versions, selected, onSelect, raw, error, onRetry }: {
    beatmap: BeatmapDefinition,
    versions: ViewerVersion[],
    selected: ViewerVersion|null,
    onSelect?: (version: ViewerVersion) => void,
    raw: string|null,
    error?: string|null,
    onRetry?: () => void,
}) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const rendering = useRef<AbortRenderingSignal|null>(null);
    const [status, setStatus] = useState<StageStatus>({ type: 'loading' });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (error) {
            setStatus({ type: 'error', message: error });
            return;
        }

        if (raw === null || !canvas.current) {
            setStatus({ type: 'loading' });
            return;
        }

        try {
            const beatmap = new BeatmapDecoder().decodeFromString(raw);
            const standardWithNoMod = new StandardRuleset().applyToBeatmap(beatmap);
            rendering.current = render(standardWithNoMod, canvas.current, (progress) => {
                setStatus(progress.finished ? { type: 'done' } : { type: 'rendering', progress });
            });
        } catch (e) {
            console.error(e);
            setStatus({ type: 'error', message: 'Failed to load the beatmap.' });
        }

        return () => {
            rendering.current?.abort();
            rendering.current = null;
        };
    }, [raw, error, attempt]);

    function cancel() {
        rendering.current?.abort();
        rendering.current = null;
        setStatus({ type: 'cancelled' });
    }

    function retry() {
        onRetry?.();
        setAttempt((attempt) => attempt + 1);
    }

    const downloadName = [`${beatmap.artist} - ${beatmap.title}`, selected && `[${selected.name}]`]
        .filter(Boolean)
        .join(' ')
        .replace(/[\\/:*?"<>|]/g, '_');

    return (
        <div className="flex h-[calc(100dvh-3rem)] flex-col md:flex-row">
            <BeatmapPanel beatmap={beatmap} versions={versions} selected={selected} onSelect={onSelect} />
            <div className="min-h-0 min-w-0 flex-1">
                <HeatmapStage
                    canvasRef={canvas}
                    status={status}
                    downloadName={downloadName}
                    onCancel={cancel}
                    onRetry={retry}
                />
            </div>
        </div>
    );
}
