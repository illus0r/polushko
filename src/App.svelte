<script>
	import Control from './Control.svelte';
	import Shader from './Shader.svelte';


	let controlsArrays = {}
	controlsArrays['test'] = [
		{name:"val", id:"val", min:0, value:0.0, max:1, step:.01},
	]
	controlsArrays['polushko'] = [
		{name:"val", id:"val", min:0, value:0.0, max:1, step:.01},
	]


	let shaderName = 'polushko'
	if(window.location.hash) {
		shaderName = window.location.hash.slice(1)//.toLowerCase()
	}

	let shaderFrag = {}
	import polushko from "./polushko.frag";
	shaderFrag['polushko'] = polushko
	import test from "./test.frag";
	shaderFrag['test'] = test

	let saveImage = () => { 
		let canvas = document.querySelector("#canvas-main");
		var link = document.createElement('a');
		link.download = 'image.png';
		link.href = canvas.toDataURL("image/png")
		link.click();
	}


</script>


<style>

	@font-face {
  font-family: "Suisse";
	/*src: url("./SuisseIntl-Book-WebTrial.ttf") format("truetype");*/
	src: url("./SuisseIntl-Book-WebTrial.woff") format("woff");
	}

	*{
		font-family: "Suisse";
		line-height: 32px;
		font-size: 18px;
		color: white;
	}

	.control-panel {
		position: absolute;
		bottom: 0;
		right: 0;

		padding: 14px 15px 20px;

		background: rgba(51, 51, 51, 0.7);
		border-radius: 4px 4px 0px 4px;
	}

	.header {
		height: 32px;
		margin-bottom: 11px;
	}

	.logo{
		background: url(./logo.png);
		background-size: 30px;
		width: 30px;
		height: 30px;
		float: left;
	}

	.title{
		color: #FFFFFF;
		text-align: center;
		left: -16px;
		position: relative;
		
	}

	button{
		margin-top: 20px;
		margin-left: 6px;
		background: #88888899;
		border-radius: 4px;
		padding: 0 20px;
		border: none;
	}
	button:hover{
		background: #888888;
	}

</style>


<Shader controlsArray={controlsArrays[shaderName]} shader={shaderFrag[shaderName]} />

<div class="control-panel">
	<div class='header'>
		<div class="logo"></div>
		<div class="title">{shaderName} by Pre-logo</div>
	</div>

	{#each controlsArrays[shaderName] as c}
		<Control name={c.name} bind:value={c.value} min={c.min} max={c.max} step={c.step} />
	{/each}

	<button on:click={saveImage}>Download image</button>
</div>
