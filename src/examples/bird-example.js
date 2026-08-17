import * as THREE from 'three';

import { setupPostProcessing, getSketchyParams } from './setup-post-processing';
import { SceneBuilder } from './scene-builder';
import { Easings, Animator, Joint, Bird } from '../tre';

export class BirdExample {
	constructor(sceneParams) {

		this.scene = sceneParams.scene;
		this.camera = sceneParams.camera;
		this.renderer = sceneParams.renderer;

		this.debug = false;
		this.sketchy = true;

		const builder = new SceneBuilder(this.scene);
		builder.addGround();
		builder.addLights();

		const post = setupPostProcessing({
			scene: this.scene, 
			camera: this.camera,
			renderer: this.renderer,
		});

		this.composer = post.composer;

		this.bird = new Bird();
		this.scene.add(this.bird.model);
	}

	animate(time) {
		if (!this.prevTime) this.prevTime = time;
		const timeElapsed = time - this.prevTime;
		this.prevTime = time;
		const timeElapsedInSeconds = timeElapsed / 1000;

		if (this.sketchy) this.composer.render();
		else this.renderer.render(this.scene, this.camera);
		
		this.bird.update(timeElapsedInSeconds);
	}

	setupParams(panel) {

		panel.addRef({ obj: this, ref: "debug", });
		panel.addRef({ obj: this, ref: "sketchy", });
		
	}
}