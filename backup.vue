<script setup lang="ts">
import { render } from '~/src/HeatmapRenderer';
import { BeatmapDecoder } from 'osu-parsers';
import { StandardRuleset } from 'osu-standard-stable';

const canvas = ref(null);
const canvasMargin = 55;
const canvasWidth = 512 + canvasMargin * 2;
const canvasHeight = 384 + canvasMargin * 2;

onMounted(async () => {
  const result = await fetch('/samples/sample11.osu').then(res => res.text());
  const decoder = new BeatmapDecoder();
  const beatmap = decoder.decodeFromString(result);

  if (beatmap.mode !== 0) {
    throw new Error('Invalid mode');
  }

  const ruleset = new StandardRuleset();
  const standardWithNoMod = ruleset.applyToBeatmap(beatmap);
  await render(standardWithNoMod, canvas.value!!);
})

</script>

<template>
  <div>
    <canvas :width="canvasWidth" :height="canvasHeight" ref="canvas"></canvas>
  </div>
</template>
