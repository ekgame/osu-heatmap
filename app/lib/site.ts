export const SITE_URL = 'https://osu-heatmap.ekga.me';
export const SITE_TITLE = 'osu! beatmap heatmap viewer';
export const SITE_DESCRIPTION = 'A heatmap generator for osu! beatmaps. Lighter colors show where there are more objects, darker colors where there are less. See where the play area is underused if you\'re an aspiring mapper or the hidden beauty some mappers hide in their maps.';

export function pageMeta(title: string, description: string, image: string) {
    return [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
    ];
}
