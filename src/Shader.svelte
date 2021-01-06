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

export let controlsArray = [];
export let shader;

let pixelRatio = 1/1 // 1/8 is faster
let canvasWidth, canvasHeight

let controlUniforms = {}
$: controlsArray.forEach(d=>{
	controlUniforms[d.id] = () => d.value
})

window.onload = function() {

	let mouseX, mouseY;
	document.addEventListener('mousemove', (event) => {
		mouseX = event.clientX
		mouseY = event.clientY
	});
	const regl = require('regl')({
		canvas: '#canvas-main',
		attributes: {preserveDrawingBuffer: true,}
	})

	let setupQuad

	let image = new Image()
	image.crossOrigin = "Anonymous"
	//image.src = 'https://dianov.org/media/neuroji-evilous.png'
	//image.src = './pol2.jpg'
	image.src = './pol.jpg'
	//image.src = './test.png'
	image.onload = function () {
		let imageTexture = regl.texture(image)
		setupQuad = regl({
			frag: shader,
			vert: `precision mediump float;attribute vec2 position;varying vec2 uv;void main() {uv=position;gl_Position = vec4(position, 0, 1);}`,

			attributes: {
				position: [ -4, -4, 4, -4, 0, 4 ]
			},

			uniforms: {
				...controlUniforms,
				texture: imageTexture,
				tick: regl.context('tick'),
				TIME: regl.context('time'),
				width: regl.context('viewportWidth'),
				height: regl.context('viewportHeight'),
				mouseX: ()=>mouseX,
				mouseY: ()=>mouseY,
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

	resizeCanvas()
}

window.addEventListener('resize', function() {
	resizeCanvas()
})

function resizeCanvas() {
	canvasWidth = document.documentElement.clientWidth*pixelRatio
	canvasHeight = document.documentElement.clientHeight*pixelRatio
}

</script>


<canvas id="canvas-main" width="{canvasWidth}" height="{canvasHeight}"/>
