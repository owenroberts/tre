import * as THREE from 'three';

import { setupPostProcessing, getSketchyParams } from './setup-post-processing';
import { getDefaultScene } from './get-default-scene';

export class PostSketchy {
	constructor(sceneParams) {

		this.scene = sceneParams.scene;
		this.camera = sceneParams.camera;
		this.renderer = sceneParams.renderer;

		getDefaultScene(this.scene);
		this.debug = false;

		const post = setupPostProcessing({
			scene: this.scene, 
			camera: this.camera,
			renderer: this.renderer,
		});

		this.composer = post.composer;
		this.linesPass = post.linesPass;
	}

	animate() {

		if (this.debug) this.renderer.render(this.scene, this.camera);
		else this.composer.render();

		this.scene.cube.rotation.x += 0.01;
		this.scene.cube.rotation.y += 0.01;
	}

	setupParams(panel) {

		panel.addRef({ obj: this, ref: "debug", });
		getSketchyParams(panel, this.linesPass.material.uniforms);
		
	}
}