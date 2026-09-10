import { setupPostProcessing, getSketchyParams } from './setup-post-processing';
/**
 * parent class for any example with sketchy post processing
 */
export class SketchExample {

	constructor(sceneParams, withSketchyParams=false) {

		this.scene = sceneParams.scene;
		this.camera = sceneParams.camera;
		this.renderer = sceneParams.renderer;

		const post = setupPostProcessing({
			scene: this.scene, 
			camera: this.camera,
			renderer: this.renderer,
		});

		this.composer = post.composer;
		this.linesPass = post.linesPass;

		this.debug = false;
		this.withSketchyParams = withSketchyParams;
	}

	animate(time) {
		if (!this.prevTime) this.prevTime = time;
		const timeElapsed = time - this.prevTime;
		this.prevTime = time;
		const timeElapsedInSeconds = timeElapsed / 1000;

		this.render(timeElapsedInSeconds);

		if (this.debug) this.renderer.render(this.scene, this.camera);
		else this.composer.render();
	}

	setupParams(panel) {
		panel.addRef({ obj: this, ref: "debug", });

		if (this.withSketchyParams) {
			getSketchyParams(panel, this.linesPass.material.uniforms);
		}
	}
}