import * as THREE from 'three';
import { SketchExample } from './sketch-example';
import { SceneBuilder } from './scene-builder';
import { Singer } from '../tre';

export class SingerExample extends SketchExample {
	constructor(sceneParams) {
		super(sceneParams);

		this.camera.position.x = 5;
		this.camera.position.z = 8;
		this.camera.position.y = 5;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		this.isSinging = true;

		const builder = new SceneBuilder(this.scene);
		builder.addGround({ y: 0 });
		builder.addLights();

		this.singer = new Singer({ scene: this.scene });

	}

	render(timeElapsedInSeconds) {
		this.singer.update(timeElapsedInSeconds, this.isSinging);
	}

	setupParams(panel) {
		super.setupParams(panel);
		panel.addRef({ obj: this, ref: "isSinging" });
	}
}