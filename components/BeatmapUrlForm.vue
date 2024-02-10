<script setup lang="ts">
const input = ref('');

const emit = defineEmits([
    'loadFromUrl',
]);

function loadFromUrl() {
    emit('loadFromUrl', input.value);
}
</script>

<template>
    <form @submit.prevent="loadFromUrl">                        
        <div class="input-group">
            <input 
                type="text" 
                placeholder="https://osu.ppy.sh/beatmapsets/..." 
                id="beatmap-url"
                v-model="input"
            />
            <BasicButton @click="loadFromUrl">Load</BasicButton>
        </div>
    </form>
</template>