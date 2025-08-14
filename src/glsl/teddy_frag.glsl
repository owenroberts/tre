uniform sampler2D tDiffuse;
varying vec2 vUv;

// uniform vec3 cameraPosition;
varying vec3 vWorldPosition;


void main() {
	vec4 color = texture2D( tDiffuse, vUv );
	color.r = vWorldPosition.x;
	gl_FragColor = color;
}