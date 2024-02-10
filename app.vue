<script setup lang="ts">
import { render, type AbortRenderingSignal, type RenderingProgress } from '~/src/HeatmapRenderer';
import { BeatmapDecoder } from 'osu-parsers';
import { StandardRuleset } from 'osu-standard-stable';
import type { BeatmapDefinition, BeatmapVersion } from './src/models';
import type { Beatmap } from 'osu-classes';
import PinchScrollZoom from '@coddicat/vue-pinch-scroll-zoom';

const currentBeatmap = ref<BeatmapDefinition|null>(null);
const availableVersions = ref<BeatmapVersion[]>([]);
const selectedVersion = ref<BeatmapVersion|null>(null);
const mobileMenuOpen = ref(false);
const renderingProgress = ref<RenderingProgress|null>(null);

const canvas = ref(null);
const canvasMargin = 55;
const canvasWidth = 512 + canvasMargin * 2;
const canvasHeight = 384 + canvasMargin * 2;

let abortRenderingSignal: AbortRenderingSignal|null = null;

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};

const readTextFile = (file: File) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (event) => resolve(event.target!!.result);
  reader.onerror = reject;
  reader.readAsText(file);
});

async function loadFromFile() {
    const file = await fileSelectPopup();
    console.log(file);
    if (!file) return;
    const string = await readTextFile(file);
    await loadSingleBeatmap(string as string);
}

async function fileSelectPopup(): Promise<File|null> {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.osu,.osz';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) {
                resolve(null);
                return;
            }
            resolve(file);
        };
        input.onerror = reject;
        input.click();
    });
}

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

function renderBeatmap(beatmap: Beatmap) {
    abortRendering();
    const ruleset = new StandardRuleset();
    const standardWithNoMod = ruleset.applyToBeatmap(beatmap);
    abortRenderingSignal = render(standardWithNoMod, canvas.value!!, handleRenderingProgress);
}

function abortRendering() {
    console.log('abortRendering');
    if (abortRenderingSignal) {
        abortRenderingSignal.abort();
        abortRenderingSignal = null;
    }
    renderingProgress.value = null;
}

function handleRenderingProgress(progress: RenderingProgress) {
    console.log(progress);
    renderingProgress.value = progress;
    if (progress.finished) {
        renderingProgress.value = null;
    }
}

function clearBeatmap() {
    abortRendering();
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
                @loadFromFile="(async () => loadFromFile())"
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

                <RenderingProgress 
                    v-if="renderingProgress" 
                    :progress="renderingProgress"
                    @abort="abortRendering"
                />
            </HeatmapPage>
        </div>
    </div>
</template>

