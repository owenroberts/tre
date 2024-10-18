import * as THREE from 'three';

/**
 * based on https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/SobelOperatorShader.js
 * also: https://blog.frost.kiwi/GLSL-noise-and-radial-gradient/
 * noise blend - 0-1 is some blend, above 1 is all noise
 */

const BandShader = {

	name: 'BandShader',

	uniforms: {
		'tDiffuse': { value: null },
		'bandSize': { value: 16 },
		'noiseBlend': { value: 56 / 255 },
		// 'noiseSize': { value: 63 },
	},

	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
		uniform float bandSize;
		uniform float noiseBlend;
		varying vec2 vUv;

		/* Gradient noise from Jorge Jimenez's presentation: */
		/* http://www.iryoku.com/next-generation-post-processing-in-call-of-duty-advanced-warfare */
		float gradientNoise(in vec2 uv) {
			return fract(52.9829189 * fract(dot(uv, vec2(0.06711056, 0.00583715))));
		}

		float band(float f) {
			return floor(f * bandSize) / bandSize;
		}

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			vec3 color = vec3(band(texel.r), band(texel.g), band(texel.b));
			float noise = (noiseBlend) * gradientNoise(gl_FragCoord.xy) - (noiseBlend / 2.0);
			color *= noise * 4.0;
			gl_FragColor = vec4(color, 1.0);
		}`

};

export { BandShader };