import * as THREE from 'three';
import { SketchExample } from './sketch-example';
import { SceneBuilder } from './scene-builder';
import { getAnimatorParams } from './get-animator-params';
import { Animator } from '../tre';

export class AnimatorExample extends SketchExample {
	constructor(sceneParams) {
		super(sceneParams);

		const builder = new SceneBuilder(this.scene);
		builder.addGround();
		builder.addLights();

		const cube = builder.addCube();
		const sphere = builder.addSphere({ x: 2, s: 0.5 });

		// recreate the cube animation with animator
		this.cubeAnimator = new Animator({
			end: Math.PI * 2,
			duration: 5,
			mirror: false,
			callback: value => {
				cube.rotation.y = value;
				cube.rotation.x = value;
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

	render(timeElapsedInSeconds) {
		this.cubeAnimator.update(timeElapsedInSeconds);
		this.sphereAnimator.update(timeElapsedInSeconds);
	}

	setupParams(panel) {
		super.setupParams(panel);
		getAnimatorParams(panel, this.sphereAnimator);
	}
}