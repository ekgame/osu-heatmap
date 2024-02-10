<script setup lang="ts">
import type { BeatmapDefinition, BeatmapVersion } from '~/src/models';

const props = defineProps<{
    beatmap: BeatmapDefinition|null,
    availableVersions: BeatmapVersion[],
    selectedVersion: BeatmapVersion|null,
}>();

const emit = defineEmits([
    'reset',
    'selectVersion',
]);
</script>

<template>
    <div class="layout">
        <div class="left">
            <HeatmapInfoAndOptions
                :beatmap="beatmap"
                :availableVersions="availableVersions"
                :selectedVersion="selectedVersion"
                @reset="emit('reset')"
                @selectVersion="emit('selectVersion', $event)"
            />
        </div>
        <div class="right">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.layout {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: "left right";
    height: 100%;

    .left {
        grid-area: left;
        width: 25em;
        overflow-y: auto;
    }

    .right {
        grid-area: right;
        background-color: black;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    @media (max-width: 640px) {
        .layout {
            grid-template-columns: 1fr;
            grid-template-areas: "right";
        }

        .left {
            display: none;
        }
    }
}
</style>