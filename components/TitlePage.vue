<script setup lang="ts">


const emit = defineEmits([
    'loadFromFile',
    'loadFromUrl',
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
            <BeatmapUrlForm
                @loadFromUrl="emit('loadFromUrl', $event)"
            />
            <div class="divider my-2">or</div>
            <p class="mb-2 flex">Load from an example:</p>

            <div class="flex flex-col gap-4">
                <ExampleBeatmapCard
                    link="https://osu.ppy.sh/beatmapsets/380143#osu/831868"
                    beatmapSetId="380143"
                    title="RELOADED"
                    artist="EGOIST"
                    creator="handsome"
                    @loadFromUrl="emit('loadFromUrl', $event)"
                />
                <ExampleBeatmapCard
                    link="https://osu.ppy.sh/beatmapsets/123839#osu/316018"
                    beatmapSetId="123839"
                    title="The Grimoire of Alice"
                    artist="Akiyama Uni"
                    creator="Hollow Wings"
                    @loadFromUrl="emit('loadFromUrl', $event)"
                />
                <ExampleBeatmapCard
                    link="https://osu.ppy.sh/beatmapsets/1521219#osu/3337690"
                    beatmapSetId="1521219"
                    title="I AM"
                    artist="Theocracy"
                    creator="I Must Decrease"
                    @loadFromUrl="emit('loadFromUrl', $event)"
                />
                <ExampleBeatmapCard
                    link="https://osu.ppy.sh/beatmapsets/675125#osu/1428309"
                    beatmapSetId="675125"
                    title="Cookie Bouquets"
                    artist="Dormir"
                    creator="dsco"
                    @loadFromUrl="emit('loadFromUrl', $event)"
                />
                <ExampleBeatmapCard
                    link="https://osu.ppy.sh/beatmapsets/300748#osu/674514"
                    beatmapSetId="300748"
                    title="+Danshi"
                    artist="Reol"
                    creator="Chaoslitz"
                    @loadFromUrl="emit('loadFromUrl', $event)"
                />
                <ExampleBeatmapCard
                    link="https://osu.ppy.sh/beatmapsets/364574#osu/800237"
                    beatmapSetId="364574"
                    title="TSUBAKI"
                    artist="Ocelot"
                    creator="Hollow Wings"
                    @loadFromUrl="emit('loadFromUrl', $event)"
                />
                <ExampleBeatmapCard
                    link="https://osu.ppy.sh/beatmapsets/870930#osu/1819850"
                    beatmapSetId="870930"
                    title="Ash Like Snow (TV Size)"
                    artist="the brilliant green"
                    creator="Myxomatosis"
                    @loadFromUrl="emit('loadFromUrl', $event)"
                />
            </div>
        </div>
    </div>
</template>