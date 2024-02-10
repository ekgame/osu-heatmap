<script setup lang="ts">
const props = defineProps<{
    link: string;
    beatmapSetId: string;
    title: string;
    artist: string;
    creator: string;
}>();

const emit = defineEmits([
    'loadFromUrl',
]);
</script>

<template>
    <div class="cursor-pointer" @click="emit('loadFromUrl', props.link)">
        <BeatmapCard
            :beatmapSetId="props.beatmapSetId"
            :title="props.title"
            :artist="props.artist"
            :creator="props.creator"
        />
    </div>
</template>