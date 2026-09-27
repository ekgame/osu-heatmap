import clsx from "clsx";
import { LuArrowLeft, LuExternalLink, LuStar } from "react-icons/lu";
import { Link, useNavigate } from "react-router";
import type { BeatmapDefinition } from "~/lib/models";

export interface ViewerVersion {
    id: string;
    to?: string;
    name: string;
    stars?: number;
}

export function coverStyle(beatmapSetId: string|null): React.CSSProperties {
    const images = ['url(/assets/default-bg.png)'];
    if (beatmapSetId) {
        images.unshift(`url(https://assets.ppy.sh/beatmaps/${beatmapSetId}/covers/card.jpg)`);
    }
    return { backgroundImage: images.join(', ') };
}

function Stars({ stars }: { stars?: number }) {
    if (stars === undefined) {
        return null;
    }
    return (
        <span className="flex shrink-0 items-center gap-1 text-xs font-normal tabular-nums text-ink-300">
            <LuStar size={12} />
            {stars.toFixed(2)}
        </span>
    );
}

function BeatmapInfo({ beatmap }: { beatmap: BeatmapDefinition }) {
    const osuLink = beatmap.beatmapSetId
        ? `https://osu.ppy.sh/beatmapsets/${beatmap.beatmapSetId}`
        : null;

    return (
        <div className="flex overflow-hidden rounded-xs border border-ink-700 bg-ink-800 md:flex-col">
            <div
                className="w-24 shrink-0 bg-cover bg-center md:aspect-[400/140] md:w-auto"
                style={coverStyle(beatmap.beatmapSetId)}
            />
            <div className="flex min-w-0 flex-1 flex-col px-3 py-2.5">
                <div className="line-clamp-2 leading-tight font-semibold">{beatmap.title || 'N/A'}</div>
                <div className="line-clamp-1 text-sm text-ink-300">{beatmap.artist || 'N/A'}</div>
                <div className="mt-1 flex items-center justify-between gap-2 text-xs text-ink-400">
                    <span className="line-clamp-1">mapset by {beatmap.creator || 'N/A'}</span>
                    {osuLink && (
                        <a
                            className="flex shrink-0 items-center gap-1 hover:text-ink-100"
                            target="_blank"
                            rel="noreferrer"
                            href={osuLink}
                        >
                            osu! page <LuExternalLink size={12} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export function BeatmapPanel({ beatmap, versions, selected, onSelect }: {
    beatmap: BeatmapDefinition,
    versions: ViewerVersion[],
    selected: ViewerVersion|null,
    onSelect?: (version: ViewerVersion) => void,
}) {
    const navigate = useNavigate();

    function select(version: ViewerVersion) {
        if (version.to) {
            navigate(version.to);
        } else {
            onSelect?.(version);
        }
    }

    return (
        <aside className="flex shrink-0 flex-col gap-3 border-b border-ink-700 bg-ink-900 p-3 md:min-h-0 md:w-80 md:border-r md:border-b-0 md:p-4">
            <Link to="/" className="flex items-center gap-2 text-sm text-ink-300 hover:text-ink-100">
                <LuArrowLeft size={16} />
                Choose another beatmap
            </Link>

            <BeatmapInfo beatmap={beatmap} />

            {/* Small screens don't have space for the list */}
            <label className="flex flex-col gap-1 md:hidden">
                <span className="section-label">Difficulty</span>
                <select
                    className="rounded-xs border border-ink-600 bg-ink-800 px-3 py-2 text-sm"
                    value={selected?.id ?? ''}
                    onChange={(event) => select(versions.find((version) => version.id === event.target.value)!)}
                >
                    {!selected && <option value="" disabled>Select a difficulty</option>}
                    {versions.map((version) => (
                        <option key={version.id} value={version.id}>
                            {version.name || 'N/A'}
                            {version.stars !== undefined && ` (★ ${version.stars.toFixed(2)})`}
                        </option>
                    ))}
                </select>
            </label>

            <div className="hidden min-h-0 flex-1 flex-col gap-1 md:flex">
                <div className="section-label">
                    Difficulties ({versions.length})
                </div>
                <nav className="-mx-3 flex min-h-0 flex-col overflow-y-auto md:-mx-4">
                    {versions.map((version) => {
                        const isSelected = version === selected;
                        const className = clsx(
                            'flex cursor-pointer items-center justify-between gap-3 border-l-2 px-4 py-2 text-left text-sm transition-colors',
                            isSelected
                                ? 'border-accent bg-ink-800 font-semibold'
                                : 'border-transparent text-ink-100/80 hover:bg-ink-800',
                        );
                        const content = (
                            <>
                                <span className="line-clamp-1">{version.name || 'N/A'}</span>
                                <Stars stars={version.stars} />
                            </>
                        );

                        return version.to ? (
                            <Link
                                key={version.id}
                                to={version.to}
                                aria-current={isSelected ? 'page' : undefined}
                                className={className}
                            >
                                {content}
                            </Link>
                        ) : (
                            <button
                                key={version.id}
                                type="button"
                                aria-current={isSelected ? 'true' : undefined}
                                className={className}
                                onClick={() => select(version)}
                            >
                                {content}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
