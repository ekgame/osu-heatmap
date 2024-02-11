<script setup lang="ts">
import { render, type AbortRenderingSignal, type RenderingProgress } from '~/src/HeatmapRenderer';
import { BeatmapDecoder } from 'osu-parsers';
import { StandardRuleset } from 'osu-standard-stable';
import type { BeatmapDefinition, BeatmapVersion } from './src/models';
import type { Beatmap } from 'osu-classes';
import PinchScrollZoom from '@coddicat/vue-pinch-scroll-zoom';
import JsZip from "jszip";

const title = 'osu! beatmap heatmap viewer';
const description = 'A heatmap generator for osu! beatmaps. Lighter colors show where there are more objects, darker colors where there are less. See where the play area is underused if you\'re an aspiring mapper or the hidden beauty some mappers hide in their maps.';

useSeoMeta({
  title: title,
  ogTitle: title,
  description: description,
  ogDescription: description,
  ogImage: 'https://osu-heatmap.ekga.me/assets/og-image.png',
});

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

function getFileExtension(filename: string): string|null {
    const re = /(?:\.([^.]+))?$/;
    return re.exec(filename)![1];
}

async function loadFromFile() {
    const file = await fileSelectPopup();
    if (!file) return;
    loadFile(file);
}

async function loadFromDroppedFile(event: DragEvent) {
    const file = event.dataTransfer?.files[0];
    if (!file) {
        return;
    }
    loadFile(file);
}

async function loadFile(file: File) {
    const fileExtension = getFileExtension(file.name);
    if (fileExtension === 'osz') {
        loadBeatmapSet(file);
    }
    else if (fileExtension === 'osu') {
        const string = await readTextFile(file);
        await loadSingleBeatmap(string as string);
    }
    else {
        console.error('Unsupported file type');
        // TODO: show error message
        return;
    }
}

async function loadFromUrl(url: string) {
    const result = await fetch('/api/beatmapset/fromUrl?' + new URLSearchParams({
        url: url,
    }));

    const data = await result.json();

    if (!result.ok) {
        // TODO: show error message
        console.error('Failed to load beatmap from URL');
        return;
    }

    currentBeatmap.value = {
        beatmapSetId: data.beatmapSetId,
        title: data.title,
        artist: data.artist,
        creator: data.creator,
    };

    availableVersions.value = data.versions.map((version: BeatmapVersion) => {
        return {
            beatmapId: version.beatmapId,
            version: version.version,
            source: 'api',
        };
    });

    const versionToSelect = availableVersions.value
        .find((version) => version.beatmapId == data.defaultVersion) || availableVersions.value[0];

    await selectVersion(versionToSelect);
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

async function loadBeatmapSet(file: File) {
    clearBeatmap();
    const decoder = new BeatmapDecoder();
    const zip = await JsZip.loadAsync(file);
    const beatmapData: {
        beatmap: Beatmap,
        raw: string,
    }[] = [];

    for (const [_, zipEntry] of Object.entries(zip.files)) {
        if (zipEntry.name.endsWith('.osu')) {
            const string = await zipEntry.async('string');
            const beatmap = decoder.decodeFromString(string);
            if (beatmap.mode !== 0) {
                return;
            }
            beatmapData.push({
                beatmap: beatmap,
                raw: string,
            });
        }
    }

    if (beatmapData.length === 0) {
        // TODO: show error message
        console.error('No osu! standard mode beatmaps found in the .osz file.');
        return;
    }

    const referenceBeatmap = beatmapData[0].beatmap;
    let beatmapSetId = null;
    if (referenceBeatmap.metadata.beatmapSetId) {
        beatmapSetId = `${referenceBeatmap.metadata.beatmapSetId}`;
    }

    currentBeatmap.value = {
        beatmapSetId: beatmapSetId,
        title: referenceBeatmap.metadata.title,
        artist: referenceBeatmap.metadata.artist,
        creator: referenceBeatmap.metadata.creator,
    };

    availableVersions.value = beatmapData.map((data) => {
        let beatmapId = null;
        if (data.beatmap.metadata.beatmapId) {
            beatmapId = `${data.beatmap.metadata.beatmapId}`;
        }
        return {
            beatmapId: beatmapId,
            version: data.beatmap.metadata.version,
            source: 'local',
            raw: data.raw,
        };
    });

    await selectVersion(availableVersions.value[0]);
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
        availableVersions.value = [{
            beatmapId: beatmapId,
            version: beatmap.metadata.version,
            source: 'local',
            raw: string,
        }];

        await selectVersion(availableVersions.value[0]);
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
    if (abortRenderingSignal) {
        abortRenderingSignal.abort();
        abortRenderingSignal = null;
    }
    renderingProgress.value = null;
}

function handleRenderingProgress(progress: RenderingProgress) {
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

async function selectVersion(version: BeatmapVersion) {
    selectedVersion.value = version;
    const decoder = new BeatmapDecoder();

    if (version.source === 'local') {
        const beatmap = decoder.decodeFromString(version.raw!!);
        await nextTick();
        renderBeatmap(beatmap);
    }
    else if (version.source === 'api') {
        const result = await fetch(`/api/osu/${version.beatmapId}`);
        if (!result.ok) {
            // TODO: show error message
            console.error('Failed to load beatmap');
            return;
        }
        const string = await result.text();
        const beatmap = decoder.decodeFromString(string);
        await nextTick();
        renderBeatmap(beatmap);
    }
    else {
        console.error('Unknown version source');
        // TODO: show error message
    }
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
                    :availableVersions="availableVersions"
                    :selectedVersion="selectedVersion"
                    @reset="clearBeatmap"
                    @selectVersion="selectVersion"
                />
            </MobileMenu>

            <TitlePage
                v-if="!currentBeatmap"
                @loadFromFile="loadFromFile"
                @loadFromUrl="loadFromUrl"
                @loadFromDroppedFile="loadFromDroppedFile"
            />
            <HeatmapPage
                v-else
                :beatmap="currentBeatmap"
                :availableVersions="availableVersions"
                :selectedVersion="selectedVersion"
                @reset="clearBeatmap"
                @selectVersion="selectVersion"
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

