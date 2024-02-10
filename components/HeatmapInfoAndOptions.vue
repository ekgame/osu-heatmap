<script setup lang="ts">
import type { BeatmapDefinition, BeatmapVersion } from '~/src/models';

const props = defineProps<{
    beatmap: BeatmapDefinition|null,
    selectedVersion: BeatmapVersion|null,
    availableVersions: BeatmapVersion[],
}>();

const emit = defineEmits([
    'reset',
    'selectVersion',
]);
</script>

<template>
    <div class="flex flex-col">
        <template v-if="beatmap">
            <div class="p-4">
                <p class="mb-2 font-bold">Currently viewing:</p>
                <BeatmapCard
                    :beatmapSetId="beatmap.beatmapSetId"
                    :title="beatmap.title"
                    :artist="beatmap.artist"
                    :creator="beatmap.creator"
                />
            </div>
            <div class="flex flex-col">
                <div 
                    class="version-button"
                    :class="{ active: selectedVersion && selectedVersion === version }"
                    v-for="(version, index) in availableVersions" 
                    :key="index"
                    @click="emit('selectVersion', version)"
                >
                    {{ version.version }}
                </div>
            </div>
        </template>

        <div class="p-4 flex flex-col">
            <BasicButton
                v-if="beatmap"
                :fullWidth="true" 
                @click="emit('reset')"
            >
                Choose another beatmap
            </BasicButton>
            <div class="external-link-list mt-8">
                <a class="external-link-with-icon" target="_blank" href="https://discord.gg/SKA2kwgZMp">
                    <img src="~/assets/icons/discord.svg"/>
                    <div>
                        Have questions?<br>
                        Join our Discord server
                    </div>
                </a>

                <a class="external-link-with-icon" target="_blank" href="https://github.com/ekgame/osu-heatmap">
                    <img src="~/assets/icons/github.svg"/>
                    <div>
                        Wanna see the code?<br>
                        Check out the GitHub repository
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>

.version-button {
    padding: 0.5em 1em;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(36, 146, 208, 0.15)
    }

    &.active {
        background-color: rgba(36, 146, 208, 0.35)
    }
}

.external-link-list {
    display: flex;
    flex-direction: column;
    gap: 2em;
}

.external-link-with-icon {
    display: grid;
    grid-template-columns: 3em 1fr;
    grid-template-areas: "icon text";
    column-gap: 1em;
    position: relative;
}

.external-link-with-icon img {
    grid-area: icon;
    height: 100%;
    aspect-ratio: 1;
}

.external-link-with-icon:not(:last-child) :after {
    content: ' ';
    position: absolute;
    width: 100%;
    border-bottom: 1px solid #484848;
    left: 0;
    bottom: -1em;
}

</style>