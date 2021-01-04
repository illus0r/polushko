precision mediump float;
varying vec2 uv;

uniform float val;
uniform float TIME;
uniform float width;
uniform float height;

uniform float time_;
uniform float stripeWidth;
uniform float stripeNoise_;
#define stripeNoise (stripeNoise_ == 1.)
uniform float stripeOpacity;
uniform float noiseAmp;
uniform float noiseFreq;
uniform float pointInputx;
uniform float pointInputy;
uniform float bulbColorR;
uniform float bulbColorG;
uniform float bulbColorB;
#define bulbColor vec4(bulbColorR, bulbColorG, bulbColorB, 1.)
uniform float mousex;
uniform float mousey;
#define iMouse vec2(mousex, mousey)

// glslsandbox uniforms
#define time TIME
#define resolution vec2(width, height)

// shadertoy emulation
#define iTime (time_*100.+TIME/100.)
#define iResolution vec2(width, height)


///////////////////////////////////////


#define MAX_STEPS 400
#define MAX_DIST 100.
#define EPSILON 0.001
#define PI 3.14159265
#define COL1 1.
#define COL2 2.
#define COL3 3.

// float rnd(float x) {return fract(54321.987 * sin(987.12345 * x));}
float rnd(float x) {return 2.*fract(54321.987 * sin(987.12345 * x))-1.;}
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

float hue2rgb(float f1, float f2, float hue) {
    if (hue < 0.0)
        hue += 1.0;
    else if (hue > 1.0)
        hue -= 1.0;
    float res;
    if ((6.0 * hue) < 1.0)
        res = f1 + (f2 - f1) * 6.0 * hue;
    else if ((2.0 * hue) < 1.0)
        res = f2;
    else if ((3.0 * hue) < 2.0)
        res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
    else
        res = f1;
    return res;
}

vec3 hsl2rgb(vec3 hsl) {
    vec3 rgb;

    if (hsl.y == 0.0) {
        rgb = vec3(hsl.z); // Luminance
    } else {
        float f2;

        if (hsl.z < 0.5)
            f2 = hsl.z * (1.0 + hsl.y);
        else
            f2 = hsl.z + hsl.y - hsl.y * hsl.z;

        float f1 = 2.0 * hsl.z - f2;

        rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
        rgb.g = hue2rgb(f1, f2, hsl.x);
        rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
    }
    return rgb;
}


mat2 rot(float a) {float s = sin(a), c = cos(a);return mat2(c, -s, s, c);}
float sdBox( vec3 p, vec3 b ){  vec3 q = abs(p) - b;  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);}
float opSmoothUnion( float d1, float d2, float k ) {    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );    return mix( d2, d1, h ) - k*h*(1.0-h); }
float opSmoothSubtraction( float d1, float d2, float k ) {    float h = clamp( 0.5 - 0.5*(d1+d2)/k, 0.0, 1.0 );    return mix( d1, -d2, h ) + k*h*(1.0-h); }
float fsnoiseDigits(vec2 c){return fract(sin(dot(c, vec2(0.129898, 0.78233))) * 437.585453);}
float fsnoise(vec2 c){return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453);}
float hash( float n ) { return fract(sin(n)*753.5453123); }
// Some useful functions
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
float rand(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}
float noise(vec2 n) {
  //https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}


// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
vec2 getDist(vec3 p) {
    float spheres = length(p) - 1.5;
    for(int i = 0; i < 4; i++) {
        vec3 ps = p;
        // ps *= 2.;
        ps += vec3( 1. * sin(iTime * 1.5 + 10. * float(i)),
                    1. * sin(iTime * 2.5 + 10. * float(i) + 10.),
                    1. * sin(iTime * 3.5 + 10. * float(i) + 2.) );
        spheres = opSmoothUnion(spheres, length(ps) - .5, 1.5);
    }
    for(int i = 0; i < 4; i++) {
        vec3 ps = p;
        // ps *= 2.;
        ps += vec3( 1. * sin(iTime * 1.7 + 20. * float(i)),
                    1. * sin(iTime * 2.3 + 20. * float(i) + 10.),
                    1. * sin(iTime * 3.1 + 20. * float(i) + 2.) );
        spheres = opSmoothSubtraction(spheres, length(ps) - .5, 1.5);
    }
  return vec2(spheres, COL1);
}
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑










vec3 rayMarch(vec3 ro, vec3 rd) {
	float d = 0.;
    float info = 0.;
    int ii=0;
    for (int i = 0; i < MAX_STEPS; i++) {
      ii=i;
    	vec2 distToClosest = getDist(ro + rd * d);
        d += abs(distToClosest.x);
        info = distToClosest.y;
        if(abs(distToClosest.x) < EPSILON || d > MAX_DIST) {
        	break;
        }
    }
    return vec3(d, info, ii);
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
    vec3 p, color,rd,rm,n,ro;
    ro=vec3(0,0.*sin(iTime),-5);
    // ro.zy*=rot(iMouse.y*10.);
    ro.xz*=rot(iMouse.x*10.);
    float d, info, dtotal=0.;
    rd = getRayDir(uv, ro, vec3(0), 1.);

    rm = rayMarch(ro, rd);
    d = rm[0];
    info = rm[1];
    float steps = rm[2];

    // vec3 n = getNormal(p);
    // color = textureCube(bgCube, rd).xyz;
    // color = texture2D(bg, rd.xy).xyz;
    // color = vec3(1);//textureCube(bg, rd).xyz;

    // // reflection
    // for (int i = 0; i < 2; i++) {
    //   rm = rayMarch(ro, rd);
    //   info = rm[1];
    //   dtotal += d = rm[0];
    //   if (dtotal > MAX_DIST) break;
    //   p = ro + rd * d;
    //   n = getNormal(p);
    //   ro = p + rd * 0.05;
    //   rd = reflect(rd, n);
    // }

    // refraction
    // vec3 colorCollected = vec3(1);
    // float e = iMouse.y;
    // for (int i = 0; i < 2; i++) {
    //     rm = rayMarch(ro, rd);
    //     dtotal += d = rm[0];
    //     info = rm[1];
    //     p = ro + rd * d;
    //     n = getNormal(p);
    //     ro = p + rd * 0.01;
    //     rd = refract(rd, n, 1. - e);
    //     if (dtotal > MAX_DIST) break;
    //     if (info == COL1) {
    //         colorCollected += vec3(.2,.9,.1);
    //     }
    //     else if (info == COL2) {
    //         colorCollected += vec3(1,1,0);
    //     }
    //     else if (info == COL3) {
    //         colorCollected += vec3(1.,.1,.1);
    //     }
    //
    //     rm = rayMarch(ro, rd);
    //     dtotal += d = rm[0];
    //     p = ro + rd * d;
    //     n = getNormal(p);
    //     ro = p + rd * 0.01;
    //     rd = refract(rd, n, 1. + e);
    //     if (dtotal > MAX_DIST) break;
    // }

    if (d < MAX_DIST) {
      n = getNormal(ro+rd*d).yzx;

      vec3 stripes;
      if (!stripeNoise) stripes = step(0.,sin(n/stripeWidth));

      // // noisy texture
      vec3 amp = vec3(4.*noiseAmp);
      n.z+=amp.z*snoise(n.xy*10.*noiseFreq+iTime);
      n.x+=amp.x*snoise(n.yz*10.*noiseFreq+iTime);
      n.y+=amp.y*snoise(n.xz*10.*noiseFreq+iTime);
      // color = textureCubeZ(bg, n).xyz;

      // vec3 amp = vec3(0.2);
      // n.x+=amp.x*snoise(n.yz*2.+iTime);
      // n.y+=amp.y*snoise(n.xz*2.+iTime);
      // n.z+=amp.z*snoise(n.xy*2.+iTime);
      // n.xy *= rot(iTime*2.);
      // n.xz *= rot(iTime*3.);
      color = hsl2rgb(-n*.5+.5);
      // color *=  smoothstep(2.,1.5,d);

      // // pepsi colors
      // n = n*.5+.5;
      // float r=n.x, b=n.x;
      // b = smoothstep(0.0, 0.7, r);
      // r = smoothstep(0.99, 0.3, r);
      // color = vec3(r, min(r, b), b);

      // //shade
      // float shade = dot(n, vec3(1,1,-1))*.5+.8;
      // color *= shade;

      if (stripeNoise) stripes = step(0.,sin(n/stripeWidth));
      color *= mix(vec3(1.), stripes, stripeOpacity);
      
      color = clamp(color, 0., 1.);
      color*=bulbColor.xyz;
    }
    else {
      // start
      // color = vec3(step(.9,snoise(rd.xy*100.)));

      color = vec3(1);
    }
    fragColor = vec4(color,1);
}


///////////////////////////////////////

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}

