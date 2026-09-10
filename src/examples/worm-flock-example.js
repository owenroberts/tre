import * as THREE from 'three';
import { SketchExample } from './sketch-example';
import { SceneBuilder } from './scene-builder';
import { Worm, Flock, WORM_FLOCK_CONFIG } from '../tre';

export class WormFlockExample extends SketchExample {

	constructor(sceneParams) {
		super(sceneParams);

		this.camera.position.x = 30;
		this.camera.position.z = 30;
		this.camera.position.y = 50;

		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		const builder = new SceneBuilder(this.scene);
		builder.addGround();
		builder.addLights();

		const d = 20;
		const d2 = d/2;

		const targets = [
			builder.addSphere({ x: d,  y: 0,  z: -d }), 
			builder.addSphere({ x: -d, y: 0,  z: -d }), 
			builder.addSphere({ x: -d, y: 0, z: d  }), 
		];

		this.flock = new Flock({
			scene: this.scene,
			count: 6, 
			type: Worm,
			config: WORM_FLOCK_CONFIG, 
			memberParams: { size: 0.1 },
			start: targets[0].position,
			targets: targets.map(t => t.position),
		});
		// this.flock.setup(this.flockTargets[0], this.flockTargets[1]);

		const flockData = {
			radius: WORM_FLOCK_CONFIG.flocking.radius,
			align: WORM_FLOCK_CONFIG.flocking.align,
			center: WORM_FLOCK_CONFIG.flocking.center,
			separation: WORM_FLOCK_CONFIG.flocking.separation,
			seek: WORM_FLOCK_CONFIG.flocking.seek,
		};

	}

	render(timeElapsedInSeconds) {
		this.flock.update(timeElapsedInSeconds);
	}

	setupParams(panel) {
		super.setupParams(panel);

		panel.addRef({
			label: "speed",
			value: WORM_FLOCK_CONFIG.speed,
			callback: value => {
				this.flock.members.forEach(m => { m.speed = value; });
			}
		});

		for (const k in WORM_FLOCK_CONFIG.flocking) {
			panel.addRef({
				label: k,
				value: WORM_FLOCK_CONFIG.flocking[k],
				callback: value => {
					this.flock.members.forEach(m => { m.flocking[k] = value; });
				}
			});
		}
	}
}

