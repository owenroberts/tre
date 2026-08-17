import * as THREE from 'three';

// render stuff
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

// my lines pass
import { LinesPass } from '../tre.js';

// setup post processor
const linesPassDefaults = {
	lineColor: 0x000000,
	bgColor: 0xC7C7C7,
	bgAlpha: 0.0,
	diffuseCutoff: 40,
	normalCutoff: 50,
	noiseMultiplier: 10,

	// unused params?
	diffuseNoiseOffset: 0.0, 
	normalNoiseOffset: 0.0,
};

/**
 * setup post processing and ui to toggle in tests scenes
 * @param  {object} [options.scene]  - three scene
 * @param  {object} [options.camera] - camera
 * @param  {object} [options.gui]    - gui
 * @return {object} composer         - render composer
 */
export function setupPostProcessing({ scene, camera, renderer }) {

	renderer.physicallyCorrectLights = true;
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.toneMapping = THREE.CineonToneMapping;
	renderer.toneMappingExposure = 1.75;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	
	const linesPass = new LinesPass({
		scene, 
		camera,
		width: renderer.domElement.clientWidth, 
		height: renderer.domElement.clientHeight, 
		uniforms: {
			lineColor: { type: 'vec3', value: new THREE.Color(linesPassDefaults.lineColor) },
			bgColor: { type: 'vec3', value: new THREE.Color(linesPassDefaults.bgColor) },
			bgAlpha: { type: 'float', value: linesPassDefaults.bgAlpha },
			diffuseCutoff: { type: 'float', value: linesPassDefaults.diffuseCutoff },
			normalCutoff: { type: 'float', value: linesPassDefaults.normalCutoff },
			noiseMultiplier: { type: 'float', value: linesPassDefaults.noiseMultiplier },
		}
	});

	const composer = new EffectComposer(renderer);
	const renderPass = new RenderPass(scene, camera); // need render pass for shadows, diffuse cutoff
	composer.addPass(renderPass);
	composer.addPass(linesPass);

	return { composer, linesPass };
}

export function getSketchyParams(ui, uniforms) {

	// https://discourse.threejs.org/t/setting-color-in-3js-code-vs-what-lil-gui-uses/67907/2
	ui.addRef({
		label: "line color",
		type: "UIColor",
		value: "#" + uniforms.lineColor.value,
		callback: value => {
			uniforms.lineColor.value = new THREE.Color(value);
		}
	});

	ui.addRef({
		label: "bg color",
		type: "UIColor",
		value: "#" + uniforms.bgColor.value.getHexString(),
		callback: value => {
			uniforms.bgColor.value = new THREE.Color(value);
		}
	});

	ui.addRef({
		label: "bg alpha",
		obj: uniforms.bgAlpha,
		ref: "value",
		value: uniforms.bgAlpha.value,
		min: 0,
		max: 1,
		step: 0.1,
		type: "UIRange",
	});

	ui.addRef({
		label: "diffuse cutoff",
		obj: uniforms.diffuseCutoff,
		ref: "value",
		min: 0.001,
		max: 60.000,
		step: 0.1,
	});

	ui.addRef({
		label: "normal cutoff",
		obj: uniforms.normalCutoff,
		ref: "value",
		min: 0.1,
		max: 100.0,
		step: 0.1,
	});

	ui.addRef({
		label: "noise multiplier",
		obj: uniforms.noiseMultiplier,
		ref: "value",
		min: 0.1,
		max: 100.0,
	});
}
