<style>
#canvas-main {
	z-index: -1;
	position: fixed;
	top: 0px;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>


<script>

import shaderFrag from "./openEye.frag";

export let controlsArray = [];


let controlUniforms = {}
$: controlsArray.forEach(d=>{
	controlUniforms[d.id] = () => d.value
})

window.onload = function() {

const regl = require('regl')({
	canvas: '#canvas-main',
	pixelRatio: 1/2,
	attributes: {preserveDrawingBuffer: true,}
})

const setupQuad = regl({
	frag: shaderFrag,
	vert: `precision mediump float;attribute vec2 position;varying vec2 uv;void main() {uv=position;gl_Position = vec4(position, 0, 1);}`,

	attributes: {
		position: [ -4, -4, 4, -4, 0, 4 ]
	},

	uniforms: {
		...controlUniforms,
		tick: regl.context('tick'),
		TIME: regl.context('time'),
		width: regl.context('viewportWidth'),
    height: regl.context('viewportHeight'),
	},

	depth: { enable: false },

	count: 3
})

regl.frame(() => {
	setupQuad(() => {
		regl.draw()
	})
})

}

</script>


<canvas id="canvas-main"/>
