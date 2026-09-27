import { BeatmapDecoder } from "osu-parsers";
import JsZip from "jszip";
import type { BeatmapDefinition, BeatmapVersion } from "./models";

export interface LocalBeatmapSet {
    beatmap: BeatmapDefinition;
    versions: BeatmapVersion[];
}

interface LocalBeatmap {
    id: string;
    set: LocalBeatmapSet;
    selectedIndex: number;
}

export class BeatmapFileError extends Error {}

let lastLoaded: LocalBeatmap|null = null;

export function getLoadedBeatmapSet(id: string|undefined) {
    return lastLoaded && lastLoaded.id === id ? lastLoaded : null;
}

function getFileExtension(filename: string): string|null {
    const re = /(?:\.([^.]+))?$/;
    return re.exec(filename)![1]?.toLowerCase() ?? null;
}

function toLocalBeatmapSet(files: string[]): LocalBeatmapSet {
    const decoder = new BeatmapDecoder();
    const beatmaps = files
        .map((raw) => ({ beatmap: decoder.decodeFromString(raw), raw }))
        .filter(({ beatmap }) => beatmap.mode === 0);

    if (beatmaps.length === 0) {
        throw new BeatmapFileError(files.length > 1
            ? 'No osu! standard mode beatmaps found in the .osz file.'
            : 'This file is not an osu! standard mode beatmap.');
    }

    const reference = beatmaps[0].beatmap.metadata;
    return {
        beatmap: {
            beatmapSetId: reference.beatmapSetId ? `${reference.beatmapSetId}` : null,
            title: reference.title,
            artist: reference.artist,
            creator: reference.creator,
        },
        versions: beatmaps.map(({ beatmap, raw }) => ({
            beatmapId: beatmap.metadata.beatmapId ? `${beatmap.metadata.beatmapId}` : null,
            version: beatmap.metadata.version,
            source: 'local',
            raw,
        })),
    };
}

export async function loadLocalFile(file: File): Promise<string> {
    const extension = getFileExtension(file.name);
    if (extension !== 'osu' && extension !== 'osz') {
        throw new BeatmapFileError('Unsupported file type. Only .osu and .osz files are supported.');
    }

    let set: LocalBeatmapSet;
    try {
        if (extension === 'osz') {
            const zip = await JsZip.loadAsync(file);
            const entries = Object.values(zip.files)
                .filter((entry) => entry.name.toLowerCase().endsWith('.osu'));
            set = toLocalBeatmapSet(await Promise.all(entries.map((entry) => entry.async('string'))));
        }
        else {
            set = toLocalBeatmapSet([await file.text()]);
        }
    } catch (e) {
        if (e instanceof BeatmapFileError) {
            throw e;
        }
        console.error(e);
        throw new BeatmapFileError('Failed to load the file.');
    }

    lastLoaded = {
        id: crypto.randomUUID(),
        set,
        selectedIndex: 0
    };
    
    return lastLoaded.id;
}
