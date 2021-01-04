<script>
	import Control from './Control.svelte';
	import Shader from './Shader.svelte';


	let controlsArrays = {}
	controlsArrays['Open eye'] = [
		{name:"Lightness threshold", id:"threshold", min:-1, value:0.0, max:1, step:.01},
		{name:"Color shift", id:"colorShift_", value:0.02, max:.1, step:.01, min:0},
		{name:"Spot seed", id:"spotSeed", value:0.0, max:1, step:.01, min:0},
		{name:"Spot radius", id:"spotRadius", value:0.5, max:1, step:.01, min:0},
		{name:"Spot details", id:"spotDetails", value:0.5, max:1, step:.01, min:0},
		{name:"Spot amplitude", id:"spotAmplitude", value:0.5, max:1, step:.01, min:0},
		{name:"Blur", id:"blur", value:0.1, max:1, step:.01, min:0},
		{name:"Time", id:"time_", value:0.0, max: 500, step: .1, step:.01, min:0},
	]
	controlsArrays['Bubble'] = [
		{name: "time_", id: "time_", value: 0.1, min: 0, max: 1, step:.01},
		{name: "distance", id: "distance", max: 50, value: 2.1, min: 0, step:.01},
		{name: "refK", id: "refK", max: 10, value: 0.8, min: 0, step:.01},
		{name: "bgK", id: "bgK", max: 10, value: 2, min: 0, step:.01},
		{name: "edgeK", id: "edgeK", max: 10, value: 2.1, min: 0, step:.01},
		{name: "rainbowK", id: "rainbowK", max: 10, value: 0.5, min: 0, step:.01}	,
		{name: "noiseAmp", id: "noiseAmp", value: 1.1, min: 0, max: 1, step:.01},
		{name: "noiseFreq", id: "noiseFreq", max: 10, value: 1.2, min: 0, step:.01},
		{name: "mousex", id: "mousex", max: 1, min: 0, value: 0, step:.01},
	]
	controlsArrays['Yomqo'] = [
		{name: "time_", id:"time_", value: 0.1, min: 0, max: 1, step: 0.01, },
		{name: "stripeWidth", id:"stripeWidth",value: 0.05, min: 0, max: 1, step: 0.01, },
		{name: "stripeNoise_", id:"stripeNoise_", value: 1, min: 0, max: 1, step: 1., },
		{name: "stripeOpacity", id:"stripeOpacity",value: 0.2, min: 0, max: 1, step: 0.01, },
		{name: "noiseAmp", id:"noiseAmp",value: 0.02, min: 0, max: 1, step: 0.01, },
		{name: "noiseFreq", id:"noiseFreq",value: 0.2, min: 0, max: 1, step: 0.01, },
		{name: "bulbColorR", id:"bulbColorR", value:1.0, min: 0, max: 1, step: 0.01, },
		{name: "bulbColorG", id:"bulbColorG", value:.97, min: 0, max: 1, step: 0.01, },
		{name: "bulbColorB", id:"bulbColorB", value:.93, min: 0, max: 1, step: 0.01, },
		{name: "mousex", id: "mousex", max: 1, min: 0, value: 0, step:.01},
	]
	controlsArrays['test'] = [
		{name:"val", id:"val", min:0, value:0.0, max:1, step:.01},
	]


	let shaderName = 'Open eye'
	if(window.location.hash) {
		shaderName = window.location.hash.slice(1)//.toLowerCase()
	}

	let shaderFrag = {}
	import yomqo from "./yomqo.frag";
	shaderFrag['Yomqo'] = yomqo
	import bubble from "./bubble.frag";
	shaderFrag['Bubble'] = bubble
	import openeye from "./openeye.frag";
	shaderFrag['Open eye'] = openeye
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
