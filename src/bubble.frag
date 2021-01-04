precision mediump float;
varying vec2 uv;

uniform float val;
uniform float TIME;
uniform float width;
uniform float height;

uniform float time_;
uniform float distance;
uniform float refK;
uniform float bgK;
uniform float edgeK;
uniform float rainbowK;
uniform float noiseAmp;
uniform float noiseFreq;
uniform float mousex;
#define mouse vec2(mousex, 1.)
uniform sampler2D texture;
#define cube texture
			
			
			
			
      

#define time TIME
#define resolution vec2(width, height)

// shadertoy emulation
#define iTime (time_*100.+TIME/100.)
#define iResolution vec2(width, height)


///////////////////////////////////////


#define MAX_STEPS 100
#define MAX_DIST 10.
#define EPSILON 0.01
#define PI 3.14159265
#define COL1 1.
#define COL2 2.
#define COL3 3.


vec4 textureCubeZ(sampler2D tex, vec3 p) {
  float absX = abs(p.x);
  float absY = abs(p.y);
  float absZ = abs(p.z);

  int isXPositive = p.x > 0. ? 1 : 0;
  int isYPositive = p.y > 0. ? 1 : 0;
  int isZPositive = p.z > 0. ? 1 : 0;

  float maxAxis, uc, vc;
  vec2 crop;

  // POSITIVE X
  if (isXPositive!=0 && absX >= absY && absX >= absZ) {
    maxAxis = absX;
    uc = -p.z;
    vc = p.y;
    crop=vec2(2,1);
  }
  // NEGATIVE X
  if (isXPositive==0 && absX >= absY && absX >= absZ) {
    maxAxis = absX;
    uc = p.z;
    vc = p.y;
    crop=vec2(0,1);
  }
  // NEGATIVE Y
  if (isYPositive!=0 && absY >= absX && absY >= absZ) {
    maxAxis = absY;
    uc = p.x;
    vc = -p.z;
    crop=vec2(1,2);
  }
  // POSITIVE Y
  if (isYPositive==0 && absY >= absX && absY >= absZ) {
    maxAxis = absY;
    uc = p.x;
    vc = p.z;
    crop=vec2(1,0);
  }
  // POSITIVE Z
  if (isZPositive!=0 && absZ >= absX && absZ >= absY) {
    maxAxis = absZ;
    uc = p.x;
    vc = p.y;
    crop=vec2(1,1);
  }
  // NEGATIVE Z
  if (isZPositive==0 && absZ >= absX && absZ >= absY) {
    maxAxis = absZ;
    uc = -p.x;
    vc = p.y;
    crop=vec2(3,1);
  }

  // Convert range from -1 to 1 to 0 to 1
  vec2 uv = 0.5 * (vec2(uc,vc) / maxAxis + 1.0);

  uv+=crop;
  uv/=vec2(4,3);

  return texture2D(tex, uv);
}
mat2 rot(float a) {float s = sin(a), c = cos(a);return mat2(c, -s, s, c);}
float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}
float opSmoothUnion( float d1, float d2, float k ) {    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );    return mix( d2, d1, h ) - k*h*(1.0-h); }
//float rnd(float x) {return fract(54321.987 * sin(987.12345 * x));}
float rnd(float x) {return 2.*fract(54321.987 * sin(987.12345 * x))-1.;}
float opSmoothSubtraction( float d1, float d2, float k ) {    float h = clamp( 0.5 - 0.5*(d1+d2)/k, 0.0, 1.0 );    return mix( d1, -d2, h ) + k*h*(1.0-h); }
float hash( float n ) { return fract(sin(n)*753.5453123); }
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        0.366025403784439,
                        -0.577350269189626,
                        0.024390243902439);

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
      dot(x0,x0),
      dot(x1,x1),
      dot(x2,x2)
      ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}




// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
vec2 getDist(vec3 p) {
  p.xy*=rot(PI/4.);
  p.xz*=rot(PI/4.);
  // p.x+=10.*snoise(p.yz*.03+iTime*.2) * smoothstep(1., 10., length(p));
  // p.y+=10.*snoise(p.yz*.03+iTime*.2) * smoothstep(1., 10., length(p));
  // p=fract(p+.5)-.5;
  p*=1.9;
  p+=.1*snoise((p.yz+p.zx)*.3+iTime*1.2);
  // p.y+=.03*snoise(p.xz*2.3+iTime*.2);
  // p.z+=.03*snoise(p.xy*2.3+iTime*.2);
  float boxes = 99999.;
  float timeChank = (iTime*.3);
  for(int i=0;i<2;i++){
    vec3 shift = .3*vec3(
      snoise(vec2(timeChank+float(i),1.)),
      snoise(vec2(timeChank+float(i),2.)),
      snoise(vec2(timeChank+float(i),3.))
      );
    vec3 size = .1+.4*vec3(
      snoise(vec2(timeChank+float(i),5.))+1.,
      snoise(vec2(timeChank+float(i),6.))+1.,
      snoise(vec2(timeChank+float(i),7.))+1.
      );
    boxes = opSmoothUnion(boxes,sdBox(p+shift, size),.1);
    // boxes = min(boxes,sdBox(p+shift, size));
  }
  boxes-=.1;
  // p.z+=amp.z*snoise(p.xy*1.3+iTime*.2);
  // p.y+=amp.y*snoise(p.xz*1.3+iTime*.2);

  return vec2(boxes*.3, COL1);
  // return vec2(length(p)-.99, COL1);
}
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑





vec4 rayMarch(vec3 ro, vec3 rd/*, int inversion*/) {
	float d = 0.;
  float info = 0.;
  float glow = 9999.;
  int ii=0;
  for (int i = 0; i < MAX_STEPS; i++) {
    ii=i;
  	vec2 distToClosest = getDist(ro + rd * d);
    d += distToClosest.x/**float(inversion)*/;
    info = distToClosest.y;
    glow = min(glow, abs(distToClosest.x));
    if(distToClosest.x < EPSILON || d > MAX_DIST) {
    	break;
    }
  }
  return vec4(d, info, ii, glow);
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(EPSILON, 0.);
    vec3 n = getDist(p).x - vec3(getDist(p - e.xyy).x,
                               getDist(p - e.yxy).x,
                               getDist(p - e.yyx).x);
	return normalize(n);
}

vec3 getRayDirection (vec3 ro, vec2 uv, vec3 lookAt) {
    vec3 rd;
    rd = normalize(vec3(uv - vec2(0, 0.), 1.));
    vec3 lookTo = lookAt - ro;
    float horizAngle = acos(dot(lookTo.xz, rd.xz) / length(lookTo.xz) * length(rd.xz));
    rd.xz *= rot(horizAngle);
    return rd;
}

vec3 getRayDir(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i);
    return d;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.y;
    vec3 p, color=vec3(0.),bg,rd,n,ro,ref;
    vec4 rm;
    ro=vec3(0,0,distance);
    ro.xz*=rot(mouse.x*10.);
    float d, info, dtotal=0., steps, marches, glow;
    rd = getRayDir(uv, ro, vec3(0), 1.);
    // rm = rayMarch(ro, rd);
    // d = rm[0];
    // info = rm[1];
    // steps = rm[2];

    vec3 light = vec3(50, 50, 50);
    // n = getNormal(p);

    bg=textureCubeZ(cube, rd).xyz;
    //float bgK = 2.;
    color=bgK*bg;
    marches+=bgK;
    // making several marches outside and inside
    // the surface along the ray
    for (int i = 0; i < 1; i++) {
      // if(i==0)continue;
      rm = rayMarch(ro, rd/*, mod(float(i),2.)==0.?1:-1*/);
      info = rm[1];
      glow += rm[3];
      // color+=0.00000002/glow;
      // marches+=1.;
      dtotal += d = rm[0];
      if (dtotal > MAX_DIST) break;
      // мы нактнулись.
      p = ro + rd * d;
      n = getNormal(p);
      // находим отражение
      // float refK = OSC3*10.;
      //float refK = .8;
      ref = reflect(rd, n);
      color+=refK*textureCubeZ(cube, ref).xyz;
      marches+=refK;
      // находим блеск
      // float edgeK = OSC2*10.;
      //float edgeK = 2.1;
      color+=edgeK*.1*smoothstep(-.5,1.,dot(ref, rd));
      color+=edgeK*.2*smoothstep(.6,1.,dot(ref, rd));
      color+=edgeK*.4*smoothstep(.9,1.,dot(ref, rd));
      // marches+=edgeK;

      // находим цвет
      // float rainbowK = OSC1;
      //float rainbowK = .5;
      vec3 amp = vec3(noiseAmp);
      // vec3 amp = vec3(50.*OSC4);
      n.z+=amp.z*snoise(n.xy*noiseFreq);
      n.x+=amp.x*snoise(n.yz*noiseFreq);
      n.y+=amp.y*snoise(n.xz*noiseFreq);
      color+= rainbowK*(n*.5+.5);
      marches+=rainbowK;

      // if(i==1){
        // color=getNormal(p)*5.5+5.5;
        // marches+=1.;
      // }
      ro = p + rd * EPSILON*2.;
    }
    color/=marches;

    // color+=texture2D(bg, uv).xyz;


    // vec3 dirToLight = normalize(light - p);
    // vec3 rayMarchLight = rayMarch(p + dirToLight * .06, dirToLight);
    // float distToObstable = rayMarchLight.x;
    // float distToLight = length(light - p);



    fragColor = vec4(color,1);
}


///////////////////////////////////////

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}


