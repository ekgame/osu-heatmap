import { data, redirect } from "react-router";
import { getBeatmapSetIdOfBeatmap } from "~/.server/beatmapsets";
import type { Route } from "./+types/beatmap";

export async function loader({ params }: Route.LoaderArgs) {
    if (!/^\d+$/.test(params.beatmapId)) {
        throw data('This beatmap does not exist.', { status: 404 });
    }

    const beatmapSetId = await getBeatmapSetIdOfBeatmap(params.beatmapId);
    return redirect(`/beatmapsets/${beatmapSetId}/${params.beatmapId}`);
}
