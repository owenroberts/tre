import * as THREE from 'three';
import { SketchExample } from './sketch-example';
import { getDefaultScene } from './get-default-scene';
import { SceneBuilder } from './scene-builder';


export class PostSketchy extends SketchExample {
	constructor(sceneParams) {
		super(sceneParams, true);
		getDefaultScene(this.scene);
	}

	render() {
		this.scene.cube.rotation.x += 0.01;
		this.scene.cube.rotation.y += 0.01;
	}
}