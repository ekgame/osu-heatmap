<script setup lang="ts">


const emit = defineEmits([
    'loadFromFile',
]);
</script>

<template>
    <div class="app-dnd-border">
        <div class="app-title-screen-container">
            <h1 class="font-bold text-2xl">Load a beatmap</h1>
            <p class="mb-10">Supports .osu and .osz files for the standard gamemode</p>
            <div class="hidden sm:block">
                <p>Drag and drop a file into this window.</p>
                <div class="divider my-2">or</div>
            </div>

            <div class="hidden sm:flex flex-col">
                <BasicButton @click="emit('loadFromFile')">Load a file from your computer</BasicButton>
            </div>
            <div class="flex sm:hidden flex-col">
                <BasicButton @click="emit('loadFromFile')">Load a file from your phone</BasicButton>
            </div>

            <div class="divider my-2">or</div>
            <p class="mb-2 flex">Load from a link:</p>
            <BeatmapUrlForm/>
            <div class="divider my-2">or</div>
            <p class="mb-2 flex">Load from an example:</p>

            <div class="flex flex-col gap-4">
                <BeatmapCard
                    beatmapSetId="123456"
                    title="Example Beatmap"
                    artist="Example Artist"
                    creator="Example Creator"
                />
                <BeatmapCard
                    beatmapSetId="123456"
                    title="Example Beatmap"
                    artist="Example Artist"
                    creator="Example Creator"
                />
                <BeatmapCard
                    beatmapSetId="123456"
                    title="Example Beatmap"
                    artist="Example Artist"
                    creator="Example Creator"
                />
                <BeatmapCard
                    beatmapSetId="123456"
                    title="Example Beatmap"
                    artist="Example Artist"
                    creator="Example Creator"
                />
            </div>
        </div>
    </div>
</template>