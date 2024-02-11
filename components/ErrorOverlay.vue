<script setup lang="ts">
const props = defineProps<{
    message: String;
}>();

const emit = defineEmits([
    'dismiss'
]);
</script>

<template>
    <div class="overlay-container">
        <div class="panel flex flex-col gap-4">
            <div class="font-bold text-2xl">Uh Oh</div>
            {{ props.message }}
            <BasicButton @click="emit('dismiss')">Dismiss</BasicButton>
        </div>
    </div>
</template>

<style scoped>
.overlay-container {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.418);
    z-index: 1;
}

.panel {
    padding: 1.5em;
    background-color: var(--content-background-color);
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.418);
}
</style>