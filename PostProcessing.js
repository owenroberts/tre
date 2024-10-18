/*
	setup post processing
	example
*/
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';
import { BandPass } from './BandPass.js';
import { BandShader } from './BandShader.js';

import { LinesPass } from './LinesPass.js';
import vertexShader from './vert.glsl';
import blendShader from './blend.glsl';
import { Animator } from './Animator.js';

export function PostProcessing(params) {

	const { scene, skyScene, renderer, camera } = params;

	let width = renderer.domElement.clientWidth;
	let height = renderer.domElement.clientHeight;

	const linesRenderPass = new RenderPass(scene, camera);
	const linesPass = new LinesPass({
		width, height, scene, camera,
		uniforms: {
			lineColor: { type: 'vec3', value: new THREE.Color(0x000000) },
			bgColor: { type: 'vec3', value: new THREE.Color(0xC7C7C7) },
			lineWidth: 1,
			numLines: 5,
			diffuseCutoff: { type: 'float', value: 40 },
			normalCutoff: { type: 'float', value: 50 },
			noiseMultiplier: { type: 'float', value: 10 },
		}
	});

	const composer = new EffectComposer(renderer);
	composer.addPass(linesRenderPass);
	composer.addPass(linesPass);

	const animators = {
		diffuse: new Animator({
			value: 40,
			valueClamp: [30, 60],
			increment: 1,
			randomRange: [-1, 1],
			clampRange: [-3, 2],
			count: 24,
		}),
		normal: new Animator({
			value: 50,
			valueClamp: [10, 100],
			increment: 1,
			randomRange: [-1, 1],
			clampRange: [-3, 2],
			count: 24,
		}),
		noise: new Animator({
			value: 10,
			valueClamp: [2, 14],
			increment: 1,
			randomRange: [-1, 1],
			clampRange: [-3, 2],
			count: 24,
		}),
	};


	const skyPass = new RenderPass(skyScene, camera);
	const options = {
		normalEdgeStrength: 0,
		depthEdgeStrength: 0,
	};
	const renderPixelatedPass = new RenderPixelatedPass(12, skyScene, camera, options);
	// kinda glitchy, flickering, not really banding ... 
	const bandPass = new BandPass({
		bandSize: 12, 
		scene: skyScene, 
		camera
	});

	const bandEffect = new ShaderPass( BandShader );
	bandEffect.uniforms['bandSize'].value = 32;
	// sometimes flickering sometimes not ... 


	const outputPass = new OutputPass();
	const skyComposer = new EffectComposer(renderer);
	skyComposer.renderToScreen = false;
	skyComposer.addPass(skyPass);
	// skyComposer.addPass(renderPixelatedPass);
	skyComposer.addPass(bandEffect);
	skyComposer.addPass(outputPass);  // prevents flickering here (doesn't other cases??)
	// https://codesandbox.io/p/devbox/preserve-depth-forked-738cmp?file=%2Fsrc%2Fswap-pass.ts%3A145%2C38

	const mixPass = new ShaderPass(
		new THREE.ShaderMaterial( {
			uniforms: {
				baseTexture: { value: null },
				blendTexture: { value: skyComposer.renderTarget2.texture }
			},
			vertexShader: vertexShader,
			fragmentShader: blendShader,
			defines: {}
		} ), 'baseTexture'
	);
	mixPass.needsSwap = true;

	composer.addPass( mixPass );

	function update(value) {

		// animators.diffuse.update();
		// animators.normal.update();

		linesPass.material.uniforms.diffuseCutoff.value = animators.diffuse.update()
		linesPass.material.uniforms.normalCutoff.value = animators.normal.update();
		linesPass.material.uniforms.noiseMultiplier.value = animators.noise.update();

		// linesPass1.material.uniforms.noiseOffset.value.x = value.x;
		// linesPass1.material.uniforms.noiseOffset.value.y = value.y;

	}

	function process() {
		skyComposer.render();
		composer.render();
	}

	function setSize(w, h) {
		composer.setSize(w, h);
		skyComposer.setSize(w, h);
	}

	return { process, update, setSize };
}