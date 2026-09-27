export function osuUrlToPath(input: string): string|null {
    const url = input.trim();

    // https://osu.ppy.sh/beatmapsets/380143#osu/831868
    const beatmapSet = /osu\.ppy\.sh\/(?:beatmapsets|s)\/(\d+)(?:\/?#osu\/(\d+))?/.exec(url);
    if (beatmapSet) {
        const [, beatmapSetId, beatmapId] = beatmapSet;
        return beatmapId
            ? `/beatmapsets/${beatmapSetId}/${beatmapId}`
            : `/beatmapsets/${beatmapSetId}`;
    }

    // https://osu.ppy.sh/beatmaps/831868 or https://osu.ppy.sh/b/831868
    const beatmap = /osu\.ppy\.sh\/(?:beatmaps|b)\/(\d+)/.exec(url);
    if (beatmap) {
        return `/beatmaps/${beatmap[1]}`;
    }

    return null;
}
