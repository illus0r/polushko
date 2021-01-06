precision mediump float;
varying vec2 uv;

uniform float val;
uniform float TIME;
uniform float width;
uniform float height;
uniform sampler2D texture;


// room settings
#define ROOM vec3(2.,1.,2.)


float box(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0);}

mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}

float dist(vec3 p){
   return -box(p,ROOM);
}

vec3 norm(vec3 p){
	vec2 e = vec2(.01,0.);
	return normalize(vec3(
		dist(p+e.xyy)-dist(p-e.xyy),
		dist(p+e.yxy)-dist(p-e.yxy),
		dist(p+e.yyx)-dist(p-e.yyx)
	));
}

void main()
{
	float d=0.,e;
  vec3 p,rd=normalize(vec3(uv,1.)),n;
	for(int i=0;i<99;i++){
		p=rd*d;
		p.xz*=rot(TIME);
		d+=e=dist(p);
		if(e<.01)break;
	}
	n=norm(p);
	if(abs(n.y)>sin(3.1415/4.))return;
	if(abs(n.x)>sin(3.1415/4.)){
		gl_FragColor = texture2D(texture, -p.zy/ROOM.zy*.5+.5);
	}
	else{
		gl_FragColor = texture2D(texture, -p.xy/ROOM.xy*.5+.5);
	}
}

