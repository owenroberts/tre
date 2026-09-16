import * as THREE from 'three';
import { SketchExample } from './sketch-example';
import { SceneBuilder } from './scene-builder';
import { CameraController } from '../fauna/camera-controller';

export class CameraAnimatorExample extends SketchExample {
	constructor(sceneParams) {
		super(sceneParams);

		sceneParams.controls.enabled = false;

		const builder = new SceneBuilder(this.scene);
		builder.addGround();
		builder.addLights();

		this.cube = builder.addCube();
		const sphere = builder.addSphere({ x: 2, s: 0.5 });

		this.cc = new CameraController({
			camera: this.camera,
		// 	offset: new THREE.Vector3(0, 0, 8),
		});

		this.cc.addAnimation();
	}

	render(timeElapsedInSeconds) {
		this.cc.update(timeElapsedInSeconds);
		this.cc.camera.lookAt(this.cube.position);
	}

	setupParams(panel) {
		super.setupParams(panel);

		panel.addButton({
			text: "add animation",
			callback: () => {
				this.cc.addAnimation();
			},
		});
	}
}