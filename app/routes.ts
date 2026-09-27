import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("beatmapsets/:beatmapSetId/:beatmapId?", "routes/beatmapset.tsx"),
    route("beatmaps/:beatmapId", "routes/beatmap.ts"),
    route("local", "routes/local.tsx"),
    route("api/osu/:id", "routes/api.osu.ts"),
] satisfies RouteConfig;
