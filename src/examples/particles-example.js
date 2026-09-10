import * as THREE from 'three';
import { SketchExample } from './sketch-example';
import { SceneBuilder } from './scene-builder';
import { Particles } from '../fauna/dumb-particles';

export class ParticlesExample extends SketchExample {
	constructor(sceneParams) {
		super(sceneParams);

		const builder = new SceneBuilder(this.scene);
		builder.addGround();
		builder.addLights();
		builder.addSphere();

		this.particles = new Particles({
			scene: this.scene,
			radius: 8,
			origin: new THREE.Vector3(0, 4, 0), 
		});
	}

	render() {
		this.particles.update();
	}
}