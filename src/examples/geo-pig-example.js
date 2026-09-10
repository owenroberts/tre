import * as THREE from 'three';
import { SceneBuilder } from './scene-builder';
import { GeoPig } from '../tre';
import { SketchExample } from './sketch-example';

export class GeoPigExample extends SketchExample {

	constructor(sceneParams) {
		super(sceneParams);

		this.camera.position.x = 5;
		this.camera.position.z = 8;
		this.camera.position.y = 5;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		this.isWalking = true;

		const builder = new SceneBuilder(this.scene);
		builder.addGround({ y: 0 });
		builder.addLights();

		this.pig = new GeoPig({ scene: this.scene });
	}

	render(timeElapsedInSeconds) {
		this.pig.update(timeElapsedInSeconds, this.isWalking);
	}

	setupParams(panel) {
		super.setupParams(panel);
		panel.addRef({ obj: this, ref: "isWalking" });
	}
}