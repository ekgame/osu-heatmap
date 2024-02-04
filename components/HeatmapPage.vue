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
            <div class="layout">
                <div class="left">
                    <HeatmapInfoAndOptions/>
                </div>
                <div class="right"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.layout {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: "left right";
    height: 100%;

    .left {
        grid-area: left;
        width: 25em;
        overflow-y: auto;
    }

    .right {
        grid-area: right;
        background-color: black;
    }
}
</style>