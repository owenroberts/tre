import * as THREE from 'three';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import { setupPostProcessing, getSketchyParams } from './setup-post-processing';
import { getDefaultScene } from './get-default-scene';
import { SceneBuilder } from './scene-builder';
import { vertexShader, blendShader } from '../tre';

export class DoublePostSketchy {
	constructor(sceneParams) {

		this.scene1 = sceneParams.scene;
		this.scene2 = new THREE.Scene();
		this.camera = sceneParams.camera;
		this.renderer = sceneParams.renderer;

		this.debug = false;

		getDefaultScene(this.scene1);

		const builder = new SceneBuilder(this.scene2);
		builder.addLights();
		builder.addCube({ x: 5, z: -5, y: 2});
		builder.addSphere({ x: 0, z: -5, y: 2});
		builder.addTorus({ x: -5, z: -5, y: 2});

		const post1 = setupPostProcessing({
			scene: this.scene1, 
			camera: this.camera,
			renderer: this.renderer,
		});

		this.composer1 = post1.composer;
		this.renderPass1 = post1.renderPass;
		this.linesPass1 = post1.linesPass;

		const post2 = setupPostProcessing({
			scene: this.scene2, 
			camera: this.camera,
			renderer: this.renderer,
		});

		this.composer2 = post2.composer;
		this.renderPass2 = post2.renderPass;
		this.linesPass2 = post2.linesPass;

		const outputPass = new OutputPass();
		this.composer2.renderToScreen = false;
		this.composer2.addPass(outputPass);

		// https://codesandbox.io/p/devbox/preserve-depth-forked-738cmp?file=%2Fsrc%2Fswap-pass.ts%3A145%2C38
		

		/* blend is add, could be other funcs ... *** */

		const mixPass = new ShaderPass(
			new THREE.ShaderMaterial( {
				uniforms: {
					baseTexture: { value: null },
					blendTexture: { value: this.composer2.renderTarget2.texture }
				},
				vertexShader: vertexShader,
				fragmentShader: blendShader,
				defines: {}
			} ), 'baseTexture'
		);
		mixPass.needsSwap = true;
		this.composer1.addPass(mixPass);
	}

	animate() {

		if (this.debug) {
			this.renderer.render(this.scene, this.camera);
		} else {
			this.composer2.render();
			this.composer1.render();
		}

		this.scene1.cube.rotation.x += 0.01;
		this.scene1.cube.rotation.y += 0.01;
	}

	setupParams(panel) {

		panel.addRef({ obj: this, ref: "debug", });
		getSketchyParams(panel, this.linesPass1.material.uniforms);
		getSketchyParams(panel, this.linesPass2.material.uniforms);
		
	}
}