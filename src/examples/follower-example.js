import * as THREE from 'three';
import { SceneBuilder } from './scene-builder';
import { Follower } from '../tre';

/**
 * creates a follower
 * moves toward list of targets
 * attach a child visual (obj or animation)
 * basically flock for single obj ... 
 */
export class FollowerExample {
	constructor(sceneParams) {

		this.scene = sceneParams.scene;
		this.camera = sceneParams.camera;
		this.renderer = sceneParams.renderer;

		// this.camera.position.x = -20;
		this.camera.position.z = 20;
		this.camera.position.y = 40;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		this.debug = false;

		const builder = new SceneBuilder(this.scene);
		builder.addGround();
		builder.addLights();

		const targets = [
			builder.addSphere({ x: 10, y: 5, z: 20 }),
			builder.addSphere({ x: 10, y: 5, z: 10 }),
			builder.addSphere({ x: 10, y: 5, z: 0 }),
			builder.addSphere({ x: 10, y: 5, z: -10 }),
			builder.addSphere({ x: 10, y: 5, z: -20 }),
		];

		const followerObj = builder.addCube({ x: 0, y: 0, z: 0 });
		this.follower = new Follower({
			children: [followerObj],
			targets: targets.map(t => t.position),
			scene: this.scene,
			isCyclic: true,
		});

	}

	animate(time) {
		if (!this.prevTime) this.prevTime = time;
		const timeElapsed = time - this.prevTime;
		this.prevTime = time;
		const timeElapsedInSeconds = timeElapsed / 1000;

		this.follower.update(timeElapsedInSeconds);

		this.renderer.render( this.scene, this.camera );
		
	}

	setupParams(panel) {

		panel.addRef({ obj: this, ref: "debug", });
		
	}
}