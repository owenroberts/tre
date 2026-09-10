import * as THREE from 'three';
import { SceneBuilder } from './scene-builder';
import { ModelCat } from '../tre';
import { setupPostProcessing } from './setup-post-processing';


export class ModelCatExample {
	constructor(sceneParams) {

		this.scene = sceneParams.scene;
		this.camera = sceneParams.camera;
		this.renderer = sceneParams.renderer;

		this.camera.position.x = 5;
		this.camera.position.z = 8;
		this.camera.position.y = 5;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		this.debug = false;
		this.isWalking = true;

		const builder = new SceneBuilder(this.scene);
		builder.addGround({ y: 0 });
		builder.addLights();

		this.cat = new ModelCat({ scene: this.scene });

		const post = setupPostProcessing({
			scene: this.scene, 
			camera: this.camera,
			renderer: this.renderer,
		});

		this.composer = post.composer;

	}

	animate(time) {
		if (!this.prevTime) this.prevTime = time;
		const timeElapsed = time - this.prevTime;
		this.prevTime = time;
		const timeElapsedInSeconds = timeElapsed / 1000;

		this.cat.update(timeElapsedInSeconds, this.isWalking);
		
		if (this.debug) this.renderer.render(this.scene, this.camera);
		else this.composer.render();
	}

	setupParams(panel) {

		panel.addRef({ obj: this, ref: "debug", });
		panel.addRef({ obj: this, ref: "isWalking" });
		
	}
}