import tinygradient from "tinygradient";

export interface HeatmapGradient {
    id: string;
    name: string;
    /** Colors from the least to the most objects. */
    stops: tinygradient.StopInput[]|string[];
}

export const gradients = [
    {
        id: 'inferno',
        name: 'Inferno',
        stops: ['#000004', '#420a68', '#932667', '#dd513a', '#fca50a', '#fcffa4'],
    },
    {
        id: 'viridis',
        name: 'Viridis',
        stops: ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'],
    },
    {
        id: 'grayscale',
        name: 'Grayscale',
        stops: ['#000000', '#ffffff'],
    },
    {
        id: 'heat',
        name: 'Heat',
        stops: [
            {color: 'black', pos: 0},
            {color: '#e93e3a', pos: 0.2},
            {pos: 0.4},
            {color: '#FFF33B', pos: 1}
        ],
    },
    {
        id: 'ice',
        name: 'Ice',
        stops: ['#000000', '#0b3c8c', '#22b8e6', '#ffffff'],
    },
    {
        id: 'pink',
        name: 'Pink',
        stops: ['#000000', '#7a1f52', '#ff66aa', '#ffffff'],
    },
] satisfies HeatmapGradient[] as HeatmapGradient[];

export const defaultGradient = gradients[0];

export function getGradient(id: string): HeatmapGradient {
    return gradients.find((gradient) => gradient.id === id) ?? defaultGradient;
}

export function toTinyGradient(gradient: HeatmapGradient): tinygradient.Instance {
    return tinygradient(gradient.stops as tinygradient.StopInput[]);
}

/** A CSS image to preview the gradient with. */
export function gradientPreview(gradient: HeatmapGradient): string {
    return toTinyGradient(gradient).css('linear', 'to right');
}
