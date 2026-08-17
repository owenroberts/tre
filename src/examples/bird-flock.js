import * as THREE from 'three';

import { setupPostProcessing, getSketchyParams } from './setup-post-processing';
import { SceneBuilder } from './scene-builder';
import { Bird, Flock, Follower } from '../tre';

export class BirdFlock {
	constructor(sceneParams) {

		this.scene = sceneParams.scene;
		this.camera = sceneParams.camera;
		this.renderer = sceneParams.renderer;

		this.camera.position.x = 30;
		this.camera.position.z = 30;
		this.camera.position.y = 50;

		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

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

		const d = 20;
		const d2 = d/2;

		this.flockTargets = [
			builder.addSphere({ x: d,  y: d2,  z: -d }), 
			builder.addSphere({ x: -d, y:  d,  z: -d }), 
			builder.addSphere({ x: -d, y:  d2, z: d  }), 
		];
		this.targetIndex = 0;

		this.flock = new Flock({ type: Bird }, { size: 0.5 });
		this.flock.members.forEach(m => this.scene.add(m.obj)); // automate this ...
		this.flock.setup(this.flockTargets[0], this.flockTargets[1]);

		const b = this.flock.members[0].member;
		const flockData = {
			speed: b.speed,
			radius: b.flocking.radius,
			align: b.flocking.align,
			center: b.flocking.center,
			separation: b.flocking.separation,
			seek: b.flocking.seek,
		};

	}

	animate(time) {
		if (!this.prevTime) this.prevTime = time;
		const timeElapsed = time - this.prevTime;
		this.prevTime = time;
		const timeElapsedInSeconds = timeElapsed / 1000;

		if (this.sketchy) this.composer.render();
		else this.renderer.render(this.scene, this.camera);


		this.flock.update(timeElapsedInSeconds);
		if (this.flock.reachedTarget) {
			this.targetIndex = (this.targetIndex + 1) % this.flockTargets.length;
			this.flock.target = this.flockTargets[this.targetIndex];
			this.flock.reachedTarget = false;

		}
	}

	setupParams(panel) {
		panel.addRef({ obj: this, ref: "debug", });
		panel.addRef({ obj: this, ref: "sketchy", });

		panel.addRef({
			label: "speed",
			value: 0.4,
			callback: value => {
				this.flock.members.forEach(m => { m.speed = value; });
			}
		});
	}


}

