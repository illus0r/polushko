<script>

export let name = 'Control'
export let min = 0
export let value = min
export let max = 1
export let step = (max-min)/100

let width = 130;
let percent
$: percent = width * (value-min) / (max-min)

</script>


<style>
[type='range']::-webkit-slider-runnable-track {
	background: linear-gradient(#fff, #fff) 0/var(--val) 100% no-repeat #7C7C72;	
	display: inline-block;
	height: 32px;
	border-radius: 4px;
}

[type='range']::-webkit-slider-thumb {
	visibility: hidden;
}

[type='range'] {
	height: 32px;
	position: relative;
	top: 10px;
}

.row>*{
	margin: 5px 5px;
}

label{
	width: 170px;
	display: inline-block;
	text-align: left;
}

[type=number] {
	width: 70px;
	background: #7C7C72;
	border-radius: 4px;
	border: none;
	color: white;
	height: 32px;
	box-sizing: border-box;
	font-size: inherit;
	padding: 0 4px;
}

</style>


<div class='row'>
	<label for="control">{name}</label>
	<input type=number bind:value={value} min={min} max={max} step={step} id='control'>
	<input type=range bind:value={value} min={min} max={max} step={step} style='width:{width}px; --val:{percent}px'>
</div>

