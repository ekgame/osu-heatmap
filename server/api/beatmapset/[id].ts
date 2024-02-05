import { api } from "~/src/OsuApi";

export default defineEventHandler((event) => {
    const id = getRouterParam(event, 'id');
    if (!id || !id.match(/^\d+$/)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid beatmap set ID.',
        });
    }
  
    return api.getBeatmapSet(id);
});