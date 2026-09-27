import { LRUCache } from "lru-cache";
import { data } from "react-router";
import type { BeatmapDefinition, BeatmapVersion } from "~/lib/models";
import { api } from "./OsuApi";

export interface BeatmapSet {
    beatmap: BeatmapDefinition;
    versions: BeatmapVersion[];
}

const cache = new LRUCache<string, BeatmapSet>({
    max: 500,
    ttl: 10 * 60 * 1000,
});

export async function getBeatmapSet(beatmapSetId: string): Promise<BeatmapSet> {
    const cached = cache.get(beatmapSetId);
    if (cached) {
        return cached;
    }

    const result = await api().getBeatmapSet(beatmapSetId);
    if (typeof result.error !== 'undefined') {
        throw data('This beatmap set does not exist.', { status: 404 });
    }

    const versions: BeatmapVersion[] = result.beatmaps
        .filter((beatmap: any) => beatmap.mode === 'osu')
        .sort((a: any, b: any) => a.difficulty_rating - b.difficulty_rating)
        .map((beatmap: any) => ({
            beatmapId: `${beatmap.id}`,
            version: beatmap.version,
            source: 'api',
            stars: beatmap.difficulty_rating,
        }));

    if (versions.length === 0) {
        throw data('This beatmap set has no osu! standard difficulties.', { status: 404 });
    }

    const set: BeatmapSet = {
        beatmap: {
            beatmapSetId: `${result.id}`,
            artist: result.artist,
            title: result.title,
            creator: result.creator,
        },
        versions,
    };

    cache.set(beatmapSetId, set);

    return set;
}

export async function getBeatmapSetIdOfBeatmap(beatmapId: string): Promise<string> {
    const result = await api().getBeatmap(beatmapId);
    if (typeof result.error !== 'undefined' || !result.beatmapset_id) {
        throw data('This beatmap does not exist.', { status: 404 });
    }
    return `${result.beatmapset_id}`;
}
