precision mediump float;
varying vec2 uv;

uniform float val;
uniform float TIME;
uniform float width;
uniform float height;
uniform float mouseX;
uniform float mouseY;
uniform sampler2D texture;


// room settings
#define ROOM vec3(2.,1.,2.)
//#define tex(i) texture2D(texture,-p.zy*vec2(.25,1.)/ROOM.zy*.5+vec2(.125+.25*i,.5))


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
  vec3 p,rd=normalize(vec3(uv,2.)),n;
	for(int i=0;i<99;i++){
		p=rd*d;
		p.xz*=rot(-10.*mouseX/width);
		d+=e=dist(p);
		if(e<.01)break;
	}
	n=norm(p);
	if(abs(n.y)>sin(3.1415/4.))return;
	if(n.x>.707){
		gl_FragColor = texture2D(texture,(-p.zy*vec2(-.25,1.)/ROOM.zy*.5+vec2(.125+.25*1.,.5)));
		//gl_FragColor = tex(0.);
	}
	else if(n.x<-.707){
		gl_FragColor = texture2D(texture,-p.zy*vec2(.25,1.)/ROOM.zy*.5+vec2(.125+.25*3.,.5));
		//gl_FragColor = tex(2.);
	}
	else if(n.z>.707){
		gl_FragColor = texture2D(texture,-p.xy*vec2(.25,1.)/ROOM.xy*.5+vec2(.125+.25*0.,.5));
		//gl_FragColor = tex(2.);
	}
	else{
		gl_FragColor = texture2D(texture,-p.xy*vec2(-.25,1.)/ROOM.xy*.5+vec2(.125+.25*2.,.5));
		//gl_FragColor = tex(2.);
	}
}

