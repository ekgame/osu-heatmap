<script setup lang="ts">
let active = ref(false)

function setActive() {
    active.value = true
}

function setInactive() {
    active.value = false
}

function onDrop(event: DragEvent) {
    setInactive();
    emit('loadFromDroppedFile', event)
}

const emit = defineEmits([
    'loadFromFile',
    'loadFromUrl',
    'loadFromDroppedFile',
]);

</script>

<template>
    <div 
        class="app-dnd-border"
        :class="{ active: active }"
        @dragenter.prevent="setActive"
        @dragover.prevent="setActive"
        @dragleave.prevent="setInactive"
        @drop.prevent="onDrop"
    >
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
                <ExampleBeatmapCard
                    link="https://osu.ppy.sh/beatmapsets/1590324#osu/4019497"
                    beatmapSetId="1590324"
                    title="B2 - An autumnal equinox"
                    artist="The Caretaker"
                    creator="Velamy"
                    @loadFromUrl="emit('loadFromUrl', $event)"
                />
                <ExampleBeatmapCard
                    link="https://osu.ppy.sh/beatmapsets/1582234#osu/3231140"
                    beatmapSetId="1582234"
                    title="Thoughtcrime"
                    artist="Yorushika"
                    creator="Inversion2"
                    @loadFromUrl="emit('loadFromUrl', $event)"
                />
                <ExampleBeatmapCard
                    link="https://osu.ppy.sh/beatmapsets/1206001#osu/2511210"
                    beatmapSetId="1206001"
                    title="Apex Of The Vortex"
                    artist="Tipper"
                    creator="verychill"
                    @loadFromUrl="emit('loadFromUrl', $event)"
                />
                <ExampleBeatmapCard
                    link="https://osu.ppy.sh/beatmapsets/1343602#osu/2782887"
                    beatmapSetId="1343602"
                    title="Unbreakable (Sped Up & Cut Ver.)"
                    artist="Fireflight"
                    creator="wafer"
                    @loadFromUrl="emit('loadFromUrl', $event)"
                />
                <ExampleBeatmapCard
                    link="https://osu.ppy.sh/beatmapsets/1607795#osu/3283179"
                    beatmapSetId="1607795"
                    title="Shrine Maiden - Eien no Miko"
                    artist="Yonder Voice"
                    creator="__Ag"
                    @loadFromUrl="emit('loadFromUrl', $event)"
                />
            </div>
        </div>
    </div>
</template>