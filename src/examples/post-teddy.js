import * as THREE from 'three';

// render stuff
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import { getDefaultScene } from './get-default-scene';

// teddy pass
import { TeddyPass } from '../post/teddy-pass.js';

export class PostTeddy {
	constructor(sceneParams) {

		this.scene = sceneParams.scene;
		this.camera = sceneParams.camera;
		this.renderer = sceneParams.renderer;

		this.renderer.physicallyCorrectLights = true;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.toneMapping = THREE.CineonToneMapping;
		this.renderer.toneMappingExposure = 1.75;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		getDefaultScene(this.scene);

		this.debug = false;

		// setup post processor
		this.teddyPassData = {
			lineColor: 0x000000,
			bgColor: 0xC7C7C7,
			bgAlpha: 0.0,
			diffuseCutoff: 40,
			normalCutoff: 50,
			noiseMultiplier: 10,
			diffuseNoiseOffset: 0.0,
			normalNoiseOffset: 0.0,
		};

		const teddyPass = new TeddyPass({
			scene: this.scene, 
			camera: this.camera,
			width: this.renderer.domElement.clientWidth, 
			height: this.renderer.domElement.clientHeight, 
			uniforms: {
				lineColor: { type: 'vec3', value: new THREE.Color(this.teddyPassData.lineColor) },
				bgColor: { type: 'vec3', value: new THREE.Color(this.teddyPassData.bgColor) },
				bgAlpha: { type: 'float', value: this.teddyPassData.bgAlpha },
				diffuseCutoff: { type: 'float', value: this.teddyPassData.diffuseCutoff },
				normalCutoff: { type: 'float', value: this.teddyPassData.normalCutoff },
				noiseMultiplier: { type: 'float', value: this.teddyPassData.noiseMultiplier },
			}
		});

		const renderPass = new RenderPass(this.scene, this.camera); // need render pass for shadows, diffuse cutoff
		
		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(renderPass);
		this.composer.addPass(teddyPass);

	}

	animate() {

		if (this.debug) this.renderer.render(this.scene, this.camera);
		else this.composer.render();

		this.scene.cube.rotation.x += 0.01;
		this.scene.cube.rotation.y += 0.01;
	}


	setupParams(panel) {

		panel.addRef({
			obj: this,
			ref: "debug",
		});

	}
}