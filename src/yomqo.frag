precision mediump float;
varying vec2 uv;

uniform float val;
uniform float TIME;
uniform float width;
uniform float height;

void main()
{
	gl_FragColor = vec4(vec3(val), 1.);
}

