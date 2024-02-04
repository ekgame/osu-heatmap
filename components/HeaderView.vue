<script setup lang="ts">
const props = defineProps<{
    mobileMenuOpen: boolean;
}>();

const emit = defineEmits(['toggleMobileMenu']);

</script>

<template>
    <header class="app-layout__header">
        <div class="app-title">
            osu! <strong>beatmap heatmap</strong>
        </div>
        <div class="app-external-link-icons hidden sm:flex">
            <a target="_blank" href="https://discord.gg/SKA2kwgZMp">
                <img src="~/assets/icons/discord.svg"/>
            </a>
            <a target="_blank" href="https://github.com/ekgame/osu-heatmap">
                <img src="~/assets/icons/github.svg"/>
            </a>
        </div>
        <div class="app-mobile-toggle flex sm:hidden" @click="emit('toggleMobileMenu')">
            <img v-if="!props.mobileMenuOpen" src="~/assets/icons/menu.svg"/>
            <img v-else src="~/assets/icons/close.svg"/>
        </div>
    </header>
</template>