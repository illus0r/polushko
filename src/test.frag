precision mediump float;
varying vec2 uv;

uniform float val;
uniform float TIME;
uniform float width;
uniform float height;

uniform sampler2D texture;

void main()
{
	gl_FragColor = texture2D(texture, uv+val);
}

