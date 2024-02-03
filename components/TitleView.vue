<template>
    <div class="app-layout">
        <HeaderView/>
        <div class="app-layout__main">
            <div class="app-dnd-border">
                <div class="app-title-screen-container">
                    <h1 class="font-bold text-2xl">Load a beatmap</h1>
                    <p class="mb-10">Supports .osu and .osz files for the standard gamemode</p>
                    <p>Drag and drop a file into this window.</p>
                    <div class="divider my-2">or</div>
                    <BasicButton>Load a file from your computer</BasicButton>
                    <div class="divider my-2">or</div>
                    <p class="mb-2 flex">Load from a link:</p>
                    <form>                        
                        <div class="input-group">
                            <input type="text" placeholder="https://osu.ppy.sh/beatmapsets/..." id="beatmap-url"/>
                            <BasicButton>Load</BasicButton>
                        </div>
                    </form>
                    <div class="divider my-2">or</div>
                    <p class="mb-2 flex">Load from an example:</p>
                </div>
            </div>
        </div>
    </div>
</template>