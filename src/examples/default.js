import * as THREE from 'three';
import { getDefaultScene } from './get-default-scene';

export class Default {
	constructor(sceneParams) {

		this.scene = sceneParams.scene;
		this.camera = sceneParams.camera;
		this.renderer = sceneParams.renderer;
		getDefaultScene(this.scene);

	}

	animate() {
		this.renderer.render(this.scene, this.camera);
		this.scene.cube.rotation.x += 0.01;
		this.scene.cube.rotation.y += 0.01;
	}
}