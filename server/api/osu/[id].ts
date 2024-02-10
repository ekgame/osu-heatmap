export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing ID.',
        });
    }

    const response = await fetch(`https://osu.ppy.sh/osu/${id}`);
    const text = await response.text();

    if (text.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid beatmap ID.',
        });
    }

    return text;
});