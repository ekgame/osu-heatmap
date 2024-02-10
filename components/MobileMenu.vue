<template>
    <div class="mobile-menu-container shadow-2xl">
        <slot></slot>
    </div>
</template>

<style scoped>
.mobile-menu-container {
    background-color: var(--content-background-color);
    position: sticky;
    inset: 0;
}
</style>