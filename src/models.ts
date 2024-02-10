export interface BeatmapDefinition {
    beatmapSetId: string|null;
    title: string;
    artist: string;
    creator: string;
}

export interface BeatmapVersion {
    beatmapId: string|null;
    version: string;
}