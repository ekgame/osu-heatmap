import { useState } from "react";
import { LuFolderOpen } from "react-icons/lu";
import { Link, useNavigate } from "react-router";
import { coverStyle } from "~/components/BeatmapPanel";
import { useFileLoader } from "~/components/FileLoader";
import { examples, type ExampleBeatmap } from "~/lib/examples";
import { osuUrlToPath } from "~/lib/osuUrl";

function BeatmapUrlForm() {
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);

    function submit(event: React.FormEvent) {
        event.preventDefault();
        const path = osuUrlToPath(url);
        if (!path) {
            setIsInvalid(true);
            return;
        }
        navigate(path);
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-2">
            <label htmlFor="beatmap-url" className="text-sm font-semibold">Load from a link</label>
            <div className="flex">
                <input
                    id="beatmap-url"
                    type="text"
                    inputMode="url"
                    autoComplete="off"
                    placeholder="https://osu.ppy.sh/beatmapsets/..."
                    className="min-w-0 flex-1 rounded-l-xs border border-r-0 border-ink-600 bg-ink-950 px-3 py-2 text-sm placeholder:text-ink-400 aria-invalid:border-danger"
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? 'beatmap-url-error' : 'beatmap-url-hint'}
                    value={url}
                    onChange={(event) => {
                        setUrl(event.target.value);
                        setIsInvalid(false);
                    }}
                />
                <button type="submit" className="btn btn-primary rounded-l-none!">Load</button>
            </div>
            {isInvalid ? (
                <p id="beatmap-url-error" className="text-sm text-danger">
                    This doesn't look like a link to a beatmap on the osu! website.
                </p>
            ) : (
                <p id="beatmap-url-hint" className="text-sm text-ink-400">
                    Paste a link to a beatmap or a beatmap set on the osu! website.
                </p>
            )}
        </form>
    );
}

function FileDropArea() {
    const { selectFile, isLoading } = useFileLoader();

    return (
        <button
            type="button"
            className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xs border border-dashed border-ink-600 bg-ink-950 p-5 text-center transition-colors hover:border-accent hover:bg-ink-800 disabled:cursor-progress"
            disabled={isLoading}
            onClick={selectFile}
        >
            <LuFolderOpen size={24} className="text-accent" />
            <span className="text-sm font-semibold">
                {isLoading ? 'Loading...' : 'Load a file from your device'}
            </span>
            <span className="text-sm text-ink-400">
                <span className="hidden sm:inline">or drag and drop it anywhere into this window. </span>
                Supports .osu and .osz files for the standard gamemode.
            </span>
        </button>
    );
}

function Divider() {
    return (
        <div className="flex items-center gap-3 text-sm text-ink-400 md:flex-col">
            <div className="h-px flex-1 bg-ink-700 md:h-auto md:w-px" />
            or
            <div className="h-px flex-1 bg-ink-700 md:h-auto md:w-px" />
        </div>
    );
}

function ExampleCard({ example }: { example: ExampleBeatmap }) {
    return (
        <Link
            to={`/beatmapsets/${example.beatmapSetId}/${example.beatmapId}`}
            prefetch="intent"
            className="flex flex-col overflow-hidden rounded-xs border border-ink-700 bg-ink-900 transition-colors hover:border-accent hover:bg-ink-800"
        >
            <div className="aspect-[400/140] bg-cover bg-center" style={coverStyle(example.beatmapSetId)} />
            <div className="flex flex-col px-3 py-2.5">
                <div className="line-clamp-1 text-sm font-semibold">{example.title}</div>
                <div className="line-clamp-1 text-sm text-ink-300">{example.artist}</div>
                <div className="line-clamp-1 text-xs text-ink-400">mapset by {example.creator}</div>
            </div>
        </Link>
    );
}

export default function Home() {
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
            <section className="flex flex-col gap-3">
                <h1 className="section-label">Load a beatmap</h1>
                <div className="grid grid-cols-1 gap-5 rounded-xs border border-ink-700 bg-ink-900 p-5 md:grid-cols-[1fr_auto_1fr]">
                    <div className="flex flex-col justify-center">
                        <BeatmapUrlForm />
                    </div>
                    <Divider />
                    <div className="flex flex-col">
                        <FileDropArea />
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="section-label">Examples</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {examples.map((example) => (
                        <ExampleCard key={example.beatmapSetId} example={example} />
                    ))}
                </div>
            </section>
        </div>
    );
}
