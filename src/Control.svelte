<script>

export let name = 'Control'
export let min = 0
export let value = min
export let max = 1
export let step = (max-min)/100

 let val = 0.5;
</script>

<div>
	<label for="control">{name}</label>
	<input type=number bind:value={value} min={min} max={max} step={step} id='control'>
	<input type=range bind:value={value} min={min} max={max} step={step}>
</div>

