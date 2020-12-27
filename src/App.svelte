<script>
	import Control from './Control.svelte';
	import Shader from './Shader.svelte';

	let controlsArray = [
		{name:"Lightness threshold", id:"threshold", value:0.0},
		{name:"Color shift", id:"colorShift_", value:0.02},
		{name:"Spot seed", id:"spotSeed", value:0.0},
		{name:"Spot radius", id:"spotRadius", value:0.5},
		{name:"Spot details", id:"spotDetails", value:0.5},
		{name:"Spot amplitude", id:"spotAmplitude", value:0.5},
		{name:"Blur", id:"blur", value:0.1},
		{name:"Time", id:"time_", value:0.0, max: 500, step: .1},
	]

	let saveImage = () => { 
		let canvas = document.querySelector("#canvas-main");
		var link = document.createElement('a');
		link.download = 'image.png';
		link.href = canvas.toDataURL("image/png")
		link.click();
	}

</script>


<style>
	.control-panel {
		text-align: right;
		color: white;
		position: absolute;
		bottom: 0;
		right: 0;
	}
</style>


<Shader {controlsArray} />

<div class="control-panel">
	{#each controlsArray as c}
		<Control name='{c.name}' bind:value={c.value} min={c.min} max={c.max} step={c.step} />
	{/each}

	<button on:click={saveImage}>Save image</button>
</div>
