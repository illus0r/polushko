<script>
	import Control from './Control.svelte';
	import Shader from './Shader.svelte';

	let controlsArray = [
		{name:"r", value:0},
		{name:"g", value:0},
		{name:"b", value:0},
	]
</script>

<style>
	p {
		color: purple;
		font-family: 'Comic Sans MS', cursive;
		font-size: 2em;
	}
</style>

<Shader {controlsArray} />

<div class="control-panel">

{#each controlsArray as c}
	<Control name='{c.name}' bind:value={c.value} bind:cc={controlsArray} />
{/each}
</div>

<svg><circle fill='white' cx='0' cy='0' r={controlsArray[0].value}/></svg>

