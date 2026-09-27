import { useState } from "react";
import { LuFolderOpen } from "react-icons/lu";
import { Link, useLocation } from "react-router";
import type { ViewerVersion } from "~/components/BeatmapPanel";
import { useFileLoader } from "~/components/FileLoader";
import { HeatmapViewer } from "~/components/HeatmapViewer";
import { getLoadedBeatmapSet } from "~/lib/localBeatmaps";

export const handle = { fullWidth: true };

export function meta() {
    return [
        { title: 'Beatmap from a file · osu! beatmap heatmap' },
        { name: 'robots', content: 'noindex' },
    ];
}

function LocalBeatmap({ loaded }: { loaded: NonNullable<ReturnType<typeof getLoadedBeatmapSet>> }) {
    const [selectedIndex, setSelectedIndex] = useState(loaded.selectedIndex);

    const versions: ViewerVersion[] = loaded.set.versions.map((version, index) => ({
        id: `${index}`,
        name: version.version,
    }));

    function select(version: ViewerVersion) {
        loaded.selectedIndex = Number(version.id);
        setSelectedIndex(loaded.selectedIndex);
    }

    return (
        <HeatmapViewer
            beatmap={loaded.set.beatmap}
            versions={versions}
            selected={versions[selectedIndex]}
            onSelect={select}
            raw={loaded.set.versions[selectedIndex].raw ?? null}
        />
    );
}

export default function LocalBeatmapPage() {
    const location = useLocation();
    const { selectFile } = useFileLoader();
    const loaded = getLoadedBeatmapSet(location.state?.id);

    if (!loaded) {
        return (
            <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                <h1 className="text-2xl font-bold">The beatmap is no longer loaded</h1>
                <p className="text-ink-300">
                    Beatmaps loaded from a file never leave your device and are not kept around,
                    so the file has to be loaded again.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    <button type="button" className="btn btn-primary" onClick={selectFile}>
                        <LuFolderOpen size={16} />
                        Load the file again
                    </button>
                    <Link to="/" className="btn btn-secondary">Choose another beatmap</Link>
                </div>
            </div>
        );
    }

    return <LocalBeatmap key={loaded.id} loaded={loaded} />;
}
