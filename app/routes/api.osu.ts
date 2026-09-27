import { data } from "react-router";
import type { Route } from "./+types/api.osu";

export async function loader({ params }: Route.LoaderArgs) {
    if (!/^\d+$/.test(params.id)) {
        throw data('Invalid beatmap ID.', { status: 400 });
    }

    const response = await fetch(`https://osu.ppy.sh/osu/${params.id}`);
    const text = await response.text();

    if (!response.ok || text.length === 0) {
        throw data('Invalid beatmap ID.', { status: 400 });
    }

    return new Response(text, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
