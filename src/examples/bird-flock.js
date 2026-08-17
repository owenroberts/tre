import * as THREE from 'three';

import { setupPostProcessing, getSketchyParams } from './setup-post-processing';
import { SceneBuilder } from './scene-builder';
import { Bird, Flock, Follower, BIRD_FLOCK_CONFIG } from '../tre';

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

		const targets = [
			builder.addSphere({ x: d,  y: d2,  z: -d }), 
			builder.addSphere({ x: -d, y:  d,  z: -d }), 
			builder.addSphere({ x: -d, y:  d2, z: d  }), 
		];

		this.flock = new Flock({
			scene: this.scene,
			count: 6, 
			type: Bird, 
			config: BIRD_FLOCK_CONFIG, 
			memberParams: { size: 1 },
			start: targets[0].position,
			targets: targets.map(t => t.position),
		});
		// this.flock.setup(this.flockTargets[0], this.flockTargets[1]);

		const flockData = {
			radius: BIRD_FLOCK_CONFIG.flocking.radius,
			align: BIRD_FLOCK_CONFIG.flocking.align,
			center: BIRD_FLOCK_CONFIG.flocking.center,
			separation: BIRD_FLOCK_CONFIG.flocking.separation,
			seek: BIRD_FLOCK_CONFIG.flocking.seek,
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
	}

	setupParams(panel) {
		panel.addRef({ obj: this, ref: "debug", });
		panel.addRef({ obj: this, ref: "sketchy", });

		panel.addRef({
			label: "speed",
			value: BIRD_FLOCK_CONFIG.speed,
			callback: value => {
				this.flock.members.forEach(m => { m.speed = value; });
			}
		});
	}


}

