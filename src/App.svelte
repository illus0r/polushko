<script>
	import Control from './Control.svelte';
	import Shader from './Shader.svelte';

	let controlsArray = [
		{name:"r", value:1},
		{name:"g", value:0},
		{name:"b", value:0},
		{name:"radius", value:.5},
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
	<Control name='{c.name}' bind:value={c.value} />
{/each}
</div>
