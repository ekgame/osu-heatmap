
import type { mergeProps } from 'vue';
<script setup lang="ts">
const props = defineProps<{
    beatmapSetId: string,
    title: number,
    artist: string,
    creator: string,
}>();
</script>

<template>
    <div class="flex flex-row">
        <div class="image default">
            <div class="image" :style="{backgroundImage: `url(https://assets.ppy.sh/beatmaps/${props.beatmapSetId}/covers/list.jpg)`}">
            </div>
        </div>
        <div class="info flex flex-col justify-center flex-1">
            <div class="text-2xl line-clamp-1">{{ props.title }}</div>
            <div class="text-l line-clamp-1">by {{ props.artist }}</div>
            <div class="text-sm font-bold line-clamp-1">mapset by {{ props.creator }}</div>
        </div>
    </div>
</template>

<style scoped>
.image {
    aspect-ratio: 1;
    border-top-left-radius: 0.5em;
    border-bottom-left-radius: 0.5em;
    background-position: center;
    background-size: cover;
    width: 6em;

    &.default {
        background-image: url('/assets/default-bg.png');
    }
}

.info {
    padding: 0.5em 1em;
    background-color: #0e171c;
    border-radius: 0.5em;
    margin-left: -.5em;
}
</style>