import * as THREE from 'three';

import { SceneBuilder } from './scene-builder';
import { getAnimatorParams } from './get-animator-params';
import { Animator } from '../tre';

export class AnimatorExample {
	constructor(sceneParams) {

		this.scene = sceneParams.scene;
		this.camera = sceneParams.camera;
		this.renderer = sceneParams.renderer;

		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.debug = false;

		const builder = new SceneBuilder(this.scene);
		builder.addGround();
		builder.addLights();

		this.cube = builder.addCube();
		const sphere = builder.addSphere({ x: 2, s: 0.5 });

		// recreate the cube animation with animator
		this.cubeAnimator = new Animator({
			end: Math.PI * 2,
			duration: 5,
			mirror: false,
			callback: value => {
				this.cube.rotation.y = value;
				this.cube.rotation.x = value;
			}
		});

		this.sphereAnimator = new Animator({
			start: 0,
			end: 2,
			duration: 3,
			loop: false,
			callback: value => {
				sphere.position.y = value;
			}
		});
	}

	animate(time) {
		if (!this.prevTime) this.prevTime = time;
		const timeElapsed = time - this.prevTime;
		this.prevTime = time;
		const timeElapsedInSeconds = timeElapsed / 1000;

		this.renderer.render( this.scene, this.camera );
		
		// this.cubeAnimator.update(timeElapsedInSeconds);
		this.sphereAnimator.update(timeElapsedInSeconds);
	}

	setupParams(panel) {

		panel.addRef({ obj: this, ref: "debug", });
		getAnimatorParams(panel, this.sphereAnimator);
		
	}
}