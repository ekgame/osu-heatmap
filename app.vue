<script setup lang="ts">
import { render } from '~/src/HeatmapRenderer';
import { BeatmapDecoder } from 'osu-parsers';
import { StandardRuleset } from 'osu-standard-stable';
import type { BeatmapDefinition, BeatmapVersion } from './src/models';
import type { Beatmap } from 'osu-classes';
import PinchScrollZoom from '@coddicat/vue-pinch-scroll-zoom';

const currentBeatmap = ref<BeatmapDefinition|null>(null);
const availableVersions = ref<BeatmapVersion[]>([]);
const selectedVersion = ref<BeatmapVersion|null>(null);
const mobileMenuOpen = ref(false);

const canvas = ref(null);
const canvasMargin = 55;
const canvasWidth = 512 + canvasMargin * 2;
const canvasHeight = 384 + canvasMargin * 2;

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};

function loadFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.osu,.osz';
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async () => {
            await loadSingleBeatmap(reader.result as string);
        };
    };
    input.click();
}
``
async function loadSingleBeatmap(string: string) {
    clearBeatmap();
    const decoder = new BeatmapDecoder();
    try {
        const beatmap = decoder.decodeFromString(string);
        if (beatmap.mode !== 0) {
            throw new Error('This file is not an osu! standard mode beatmap.');
        }        
        let beatmapSetId = null;
        if (beatmap.metadata.beatmapSetId) {
            beatmapSetId = `${beatmap.metadata.beatmapSetId}`;
        }
        currentBeatmap.value = {
            beatmapSetId: beatmapSetId,
            title: beatmap.metadata.title,
            artist: beatmap.metadata.artist,
            creator: beatmap.metadata.creator,
        };

        let beatmapId = null;
        if (beatmap.metadata.beatmapId) {
            beatmapId = `${beatmap.metadata.beatmapId}`;
        }
        selectedVersion.value = {
            beatmapId: beatmapId,
            version: beatmap.metadata.version,
        };
        availableVersions.value = [selectedVersion.value];

        await nextTick();
        await renderBeatmap(beatmap);
    } catch (e) {
        console.error(e);
        //  TODO: show error message
    }
}

async function renderBeatmap(beatmap: Beatmap) {
  const ruleset = new StandardRuleset();
  const standardWithNoMod = ruleset.applyToBeatmap(beatmap);
  await render(standardWithNoMod, canvas.value!!);
}

function clearBeatmap() {
    mobileMenuOpen.value = false;
    currentBeatmap.value = null;
    availableVersions.value = [];
    selectedVersion.value = null;
}
</script>

<template>
    <div class="app-layout">
        <HeaderView 
            :mobileMenuOpen="mobileMenuOpen" 
            @toggleMobileMenu="toggleMobileMenu"
        />

        <div class="app-layout__main">
            <MobileMenu v-if="mobileMenuOpen">
                <HeatmapInfoAndOptions
                    :beatmap="currentBeatmap"
                    @reset="clearBeatmap"
                />
            </MobileMenu>

            <TitlePage
                v-if="!currentBeatmap"
                @loadFromFile="loadFromFile"
            />
            <HeatmapPage
                v-else
                :beatmap="currentBeatmap"
                @reset="clearBeatmap"
            >
                <PinchScrollZoom
                    within
                    centred
                    :width="canvasWidth"
                    :height="canvasHeight"
                >
                    <canvas :width="canvasWidth" :height="canvasHeight" ref="canvas"></canvas>
                </PinchScrollZoom>
            </HeatmapPage>
        </div>
    </div>
</template>

