import * as THREE from 'three';
import { SceneBuilder } from './scene-builder';
import { Follower } from '../tre';
import { SketchExample } from './sketch-example';

/**
 * creates a follower
 * moves toward list of targets
 * attach a child visual (obj or animation)
 * basically flock for single obj ... 
 */
export class FollowerExample extends SketchExample {
	constructor(sceneParams) {
		super(sceneParams);

		this.camera.position.z = 20;
		this.camera.position.y = 40;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		const builder = new SceneBuilder(this.scene);
		builder.addGround();
		builder.addLights();

		const targets = [
			builder.addSphere({ x: 5, y: 5, z: 20 }),
			builder.addSphere({ x: 10, y: 5, z: 10 }),
			builder.addSphere({ x: 5, y: 5, z: 0 }),
			builder.addSphere({ x: 10, y: 5, z: -10 }),
			builder.addSphere({ x: 5, y: 5, z: -20 }),
		];

		const followerObj = builder.addCube({ x: 0, y: 0, z: 0 });
		this.follower = new Follower({
			children: [followerObj],
			targets: targets.map(t => t.position),
			scene: this.scene,
			isCyclic: true,
		});

	}

	render(timeElapsedInSeconds) {
		this.follower.update(timeElapsedInSeconds);
	}
}