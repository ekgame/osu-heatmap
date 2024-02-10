<script setup lang="ts">
import type { RenderingProgress } from '~/src/HeatmapRenderer';

const props = defineProps<{
    progress: RenderingProgress,
}>();

const emit = defineEmits([
    'abort',
]);

</script>

<template>
    <div class="progress-container">
        <div class="rendering-dialog">
            <div class="flex flex-col gap-4">
                <div>
                    Rendering heatmap... ({{ props.progress.current }}/{{ props.progress.max }})
                </div>
                <progress
                    class="progress"
                    :value="props.progress.current" 
                    :max="props.progress.max"
                ></progress>
                <BasicButton @click="emit('abort')">Cancel</BasicButton>
            </div>
        </div>
        
    </div>
</template>

<style scoped>
.progress-container {
    position: absolute;
    inset: 0;
    padding: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
}

.rendering-dialog {
    padding: 1em;
    background-color: var(--content-background-color);
    border-radius: 0.5em;
    width: 20em;
    max-width: 100%;
    color: var(--text-color);
}

progress {
    border-radius: 0.5em;
}

progress[value]::-moz-progress-bar {
  background: var(--button-color);
}
</style>