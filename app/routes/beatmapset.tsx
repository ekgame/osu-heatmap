import { useQuery } from "@tanstack/react-query";
import { data, redirect, type ShouldRevalidateFunctionArgs } from "react-router";
import { getBeatmapSet } from "~/.server/beatmapsets";
import type { ViewerVersion } from "~/components/BeatmapPanel";
import { HeatmapViewer } from "~/components/HeatmapViewer";
import { pageMeta, SITE_DESCRIPTION } from "~/lib/site";
import type { Route } from "./+types/beatmapset";

export async function loader({ params }: Route.LoaderArgs) {
    if (!/^\d+$/.test(params.beatmapSetId)) {
        throw data('This beatmap set does not exist.', { status: 404 });
    }

    const set = await getBeatmapSet(params.beatmapSetId);

    if (!params.beatmapId) {
        const hardest = set.versions[set.versions.length - 1];
        throw redirect(`/beatmapsets/${params.beatmapSetId}/${hardest.beatmapId}`);
    }

    if (!set.versions.some((version) => version.beatmapId === params.beatmapId)) {
        throw data('This difficulty does not exist in the beatmap set, or it\'s not for osu! standard.', { status: 404 });
    }

    return set;
}

export function shouldRevalidate({ currentParams, nextParams }: ShouldRevalidateFunctionArgs) {
    return currentParams.beatmapSetId !== nextParams.beatmapSetId;
}

export const handle = { fullWidth: true };

export function meta({ loaderData, params }: Route.MetaArgs) {
    if (!loaderData) {
        return [];
    }
    const { beatmap, versions } = loaderData;
    const version = versions.find((version) => version.beatmapId === params.beatmapId);
    return pageMeta(
        `${beatmap.artist} - ${beatmap.title} [${version?.version}] · osu! beatmap heatmap`,
        `Heatmap of ${beatmap.title} by ${beatmap.artist}, mapped by ${beatmap.creator}. ${SITE_DESCRIPTION}`,
        `https://assets.ppy.sh/beatmaps/${beatmap.beatmapSetId}/covers/card.jpg`,
    );
}

async function fetchBeatmapFile(beatmapId: string): Promise<string> {
    const response = await fetch(`/api/osu/${beatmapId}`);
    if (!response.ok) {
        throw new Error('Could not load beatmap');
    }
    return await response.text();
}

export default function BeatmapSetPage({ loaderData, params }: Route.ComponentProps) {
    const { beatmap, versions } = loaderData;

    const viewerVersions: ViewerVersion[] = versions.map((version) => ({
        id: version.beatmapId!,
        to: `/beatmapsets/${params.beatmapSetId}/${version.beatmapId}`,
        name: version.version,
        stars: version.stars,
    }));
    const selectedIndex = versions.findIndex((version) => version.beatmapId === params.beatmapId);

    const file = useQuery({
        queryKey: ['osu', params.beatmapId],
        queryFn: () => fetchBeatmapFile(params.beatmapId!),
        enabled: selectedIndex !== -1,
        staleTime: Infinity,
        retry: false,
    });

    let error = null;
    if (selectedIndex === -1) {
        error = 'This difficulty does not exist in the beatmap set.';
    } else if (file.isError) {
        error = 'Could not load the beatmap.';
    }

    return (
        <HeatmapViewer
            beatmap={beatmap}
            versions={viewerVersions}
            selected={viewerVersions[selectedIndex] ?? null}
            raw={file.data ?? null}
            error={error}
            onRetry={() => file.isError && file.refetch()}
        />
    );
}
