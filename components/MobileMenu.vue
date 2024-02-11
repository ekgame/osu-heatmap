<template>
    <div class="mobile-menu-container shadow-2xl">
        <slot></slot>
    </div>
</template>

<style scoped>
.mobile-menu-container {
    background-color: var(--content-background-color);
    position: fixed;
    inset: 0;
    top: 52px;
    z-index: 1;
    overflow: auto;
}
</style>