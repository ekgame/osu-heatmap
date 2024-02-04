<template>
    <div class="mobile-menu-container">
        <div class="external-link-list">
            <a class="external-link-with-icon" target="_blank" href="https://discord.gg/SKA2kwgZMp">
                <img src="~/assets/icons/discord.svg"/>
                <div>
                    Have questions?<br>
                    Join our Discord server
                </div>
            </a>

            <a class="external-link-with-icon" target="_blank" href="https://github.com/ekgame/osu-heatmap">
                <img src="~/assets/icons/github.svg"/>
                <div>
                    Wanna see the code?<br>
                    Check out the GitHub repository
                </div>
            </a>
        </div>
    </div>
</template>

<style scoped>
.mobile-menu-container {
    background-color: var(--content-background-color);
    padding: 1em;
    position: absolute;
    inset: 0;
}

.external-link-list {
    display: flex;
    flex-direction: column;
    gap: 2em;
}

.external-link-with-icon {
    display: grid;
    grid-template-columns: 3em 1fr;
    grid-template-areas: "icon text";
    column-gap: 1em;
    position: relative;
}

.external-link-with-icon img {
    grid-area: icon;
    height: 100%;
    aspect-ratio: 1;
}

.external-link-with-icon:not(:last-child) :after {
    content: ' ';
    position: absolute;
    width: 100%;
    border-bottom: 1px solid #484848;
    left: 0;
    bottom: -1em;
}
</style>