import { api } from "~/src/OsuApi";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    if (!query.url || typeof query.url !== 'string') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing URL.',
        });
    }

    const regex = /https:\/\/osu.ppy.sh\/beatmapsets\/(\d+)(#osu\/(\d+))?/;
    const match = regex.exec(query.url);
    if (!match) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid URL.',
        });
    }

    const beatmapSetId = match[1];
    const beatmapId = match[3] || null;

    const result = await api.getBeatmapSet(beatmapSetId);
    if (typeof result.error !== 'undefined') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid beatmap set ID.',
        });
    }

    const beatmaps = result.beatmaps
        .filter((beatmap: any) => beatmap.mode === 'osu')
        .map((beatmap: any) => ({
            beatmapId: `${beatmap.id}`,
            version: beatmap.version,
        }));
    
    if (beatmaps.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No osu! standard beatmaps found.',
        });
    }

    const defaultBeatmap = `${beatmapId || beatmaps[0].beatmapId}`;

    return {
        beatmapSetId,
        artist: result.artist,
        title: result.title,
        creator: result.creator,
        defaultVersion: defaultBeatmap,
        versions: beatmaps,
    };
});