precision mediump float;
varying vec2 uv;

uniform float r;
uniform float g;
uniform float b;
uniform float radius;

void main() {
	float col = step(radius,length(uv));
	gl_FragColor = (1.-col)*vec4(r, g, b, 1.);
}
