import * as THREE from 'three';

import { setupPostProcessing, getSketchyParams } from './setup-post-processing';
import { getAnimatorParams } from './get-animator-params';
import { getDefaultScene } from './get-default-scene';
import { Animator } from '../tre';

export class SketchyAnimator {
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

		this.diffuseAnimator = new Animator({
			start: 0.1,
			end: 10.0,
			duration: 4,
			step: 0.01,
			frameCount: 8,
			callback: value => {
				this.linesPass.material.uniforms.diffuseCutoff.value = value;
			}
		});

		this.normalAnimator = new Animator({
			start: 0.1,
			end: 10.0,
			duration: 3,
			step: 0.01,
			frameCount: 12,
			callback: value => {
				this.linesPass.material.uniforms.normalCutoff.value = value;
			}
		});

		this.noiseAnimator = new Animator({
			start: 1,
			end: 10.0,
			duration: 4,
			frameCount: 12,
			callback: value => {
				this.linesPass.material.uniforms.noiseMultiplier.value = value;
			}
		});
	}

	animate(time) {
		if (!this.prevTime) this.prevTime = time;
		const timeElapsed = time - this.prevTime;
		this.prevTime = time;
		const timeElapsedInSeconds = timeElapsed / 1000;

		if (this.debug) this.renderer.render(this.scene, this.camera);
		else this.composer.render();

		this.scene.cube.rotation.x += 0.01;
		this.scene.cube.rotation.y += 0.01;

		this.diffuseAnimator.update(timeElapsedInSeconds);
		// this.normalAnimator.update(timeElapsedInSeconds);
		// this.noiseAnimator.update(timeElapsedInSeconds);
	}

	setupParams(panel) {

		panel.addRef({ obj: this, ref: "debug", });
		// getSketchyParams(panel, this.linesPass.material.uniforms);
		getAnimatorParams(panel, this.diffuseAnimator);
		
	}
}