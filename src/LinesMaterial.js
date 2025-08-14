// https://tympanus.net/codrops/2022/11/29/sketchy-pencil-effect-with-three-js-post-processing/
import * as THREE from 'three';

import fragmentShader from './glsl/sketchy_frag.glsl';
import vertexShader from './glsl/simple_vert.glsl';

// add some defaults here 
export class LinesMaterial extends THREE.ShaderMaterial {
	constructor(params) {
		super({
			uniforms: {
				lineColor: params.uniforms.lineColor,
				bgColor: params.uniforms.bgColor,
				bgAlpha: params.uniforms.bgAlpha,
				diffuseCutoff: params.uniforms.diffuseCutoff,
 				normalCutoff: params.uniforms.normalCutoff,
 				noiseMultiplier: params.uniforms.noiseMultiplier,
				tDiffuse: { value: null },
				uNormals: { value: null },
				uTexture: { value: null },
				uResolution: { value: new THREE.Vector2(1, 1) },
			},
		vertexShader,
		fragmentShader
	});
  }
}