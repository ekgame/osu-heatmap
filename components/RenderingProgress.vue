<script setup lang="ts">
import type { RenderingProgress } from '~/src/HeatmapRenderer';

const props = defineProps<{
    progress: RenderingProgress,
}>();

</script>

<template>
    <div class="progress-container">
        {{ props.progress.current }} / {{ props.progress.max }}
    </div>
</template>

<style scoped>
.progress-container {
    position: absolute;
    inset: 0;
    padding: 1em;
}
</style>