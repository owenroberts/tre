uniform sampler2D baseTexture;
uniform sampler2D blendTexture;

varying vec2 vUv;

// blendOverlay from https://github.com/jamieowen/glsl-blend
// dont' want to figure out es6 import for this ... 
// ah fuck now i prob can ... 

float blendOverlay(float base, float blend) {
	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
	return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

void main() {
	vec4 a = texture2D( baseTexture, vUv );
	vec4 b = texture2D( blendTexture, vUv );
	vec4 r = vec4(1.0, 0.0, 0.0, 1.0);
	vec3 color =  blendOverlay(a.rgb, b.rgb);
	gl_FragColor = vec4(color, 1.0);
}