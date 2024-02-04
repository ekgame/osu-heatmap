<template>
    <button class="btn">
        <slot></slot>
    </button>
</template>

<style scoped>
.btn {
    padding: 0.5em 1em;
    background-color: var(--button-color);
    border-radius: var(--button-radius);
    color: var(--button-text-color);
}

.input-group > .btn:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
</style>