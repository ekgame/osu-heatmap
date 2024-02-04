<script setup lang="ts">
const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>

<template>
    <div class="app-layout">
        <HeaderView 
            :mobileMenuOpen="mobileMenuOpen" 
            @toggleMobileMenu="toggleMobileMenu"
        />

        <div class="app-layout__main">
            <MobileMenu v-if="mobileMenuOpen"/>
            <div class="app-dnd-border">
                <div class="app-title-screen-container">
                    <h1 class="font-bold text-2xl">Load a beatmap</h1>
                    <p class="mb-10">Supports .osu and .osz files for the standard gamemode</p>
                    <div class="hidden sm:block">
                        <p>Drag and drop a file into this window.</p>
                        <div class="divider my-2">or</div>
                    </div>

                    <div class="hidden sm:flex flex-col">
                        <BasicButton>Load a file from your computer</BasicButton>
                    </div>
                    <div class="flex sm:hidden flex-col">
                        <BasicButton>Load a file from your phone</BasicButton>
                    </div>

                    <div class="divider my-2">or</div>
                    <p class="mb-2 flex">Load from a link:</p>
                    <BeatmapUrlForm/>
                    <div class="divider my-2">or</div>
                    <p class="mb-2 flex">Load from an example:</p>
                </div>
            </div>
        </div>
    </div>
</template>