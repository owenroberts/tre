import * as THREE from 'three';

// render stuff
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

// my lines pass
import { LinesPass } from '../tre.js';


/**
 * setup post processing and ui to toggle in tests scenes
 * @param  {object} [options.scene]  - three scene
 * @param  {object} [options.camera] - camera
 * @param  {object} [options.gui]    - gui
 * @return {object} composer         - render composer
 */
export function setupPostProcessing({ scene, camera, renderer, gui }) {

	// setup post processor
	const linesPassData = {
		lineColor: 0x000000,
		bgColor: 0xC7C7C7,
		bgAlpha: 0.0,
		diffuseCutoff: 40,
		normalCutoff: 50,
		noiseMultiplier: 10,
		diffuseNoiseOffset: 0.0,
		normalNoiseOffset: 0.0,
	};

	const linesPass = new LinesPass({
		scene, 
		camera,
		width: renderer.domElement.clientWidth, 
		height: renderer.domElement.clientHeight, 
		uniforms: {
			lineColor: { type: 'vec3', value: new THREE.Color(linesPassData.lineColor) },
			bgColor: { type: 'vec3', value: new THREE.Color(linesPassData.bgColor) },
			bgAlpha: { type: 'float', value: linesPassData.bgAlpha },
			diffuseCutoff: { type: 'float', value: linesPassData.diffuseCutoff },
			normalCutoff: { type: 'float', value: linesPassData.normalCutoff },
			noiseMultiplier: { type: 'float', value: linesPassData.noiseMultiplier },
		}
	});

	const composer = new EffectComposer(renderer);
	const renderPass = new RenderPass(scene, camera); // need render pass for shadows, diffuse cutoff
	composer.addPass(renderPass);
	composer.addPass(linesPass);

	const shaderFolder = gui.addFolder( "Sketchy Shader Uniforms" );
	shaderFolder.close();

	// https://discourse.threejs.org/t/setting-color-in-3js-code-vs-what-lil-gui-uses/67907/2
	shaderFolder.addColor(linesPassData, 'lineColor').onChange(value => {
		linesPass.material.uniforms.lineColor.value = new THREE.Color().setHex(value, THREE.SRGBColorSpace);
	});

	shaderFolder.addColor(linesPassData, 'bgColor').onChange(value => {
		linesPass.material.uniforms.bgColor.value = new THREE.Color().setHex(value, THREE.SRGBColorSpace);
	});

	shaderFolder.add(linesPassData, 'bgAlpha', 0, 1).onChange(value => {
		linesPass.material.uniforms.bgAlpha.value = value;
	});

	shaderFolder.add(linesPassData, 'diffuseCutoff', 0.001, 60.000).onChange(value => {
		linesPass.material.uniforms.diffuseCutoff.value = value;
	});

	shaderFolder.add(linesPassData, 'normalCutoff', 0.1, 100.0).onChange(value => {
		linesPass.material.uniforms.normalCutoff.value = value;
	});

	shaderFolder.add(linesPassData, 'noiseMultiplier', 0.1, 100.0).onChange(value => {
		linesPass.material.uniforms.noiseMultiplier.value = value;
	});

	return composer;
}