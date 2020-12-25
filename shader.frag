precision mediump float;
varying vec2 uv;
uniform float r;
uniform float g;
uniform float b;

void main() {
	gl_FragColor = vec4(r, g, b, 1.);
}
