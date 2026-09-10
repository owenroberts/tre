import * as THREE from 'three';
import { SketchExample } from './sketch-example';
import { SceneBuilder } from './scene-builder';
import { Y_AXIS, setLineMaterialResolution } from '../utils';
import { addBranchingTree } from '../fauna/tree-branch';
import { addAnglyBush } from '../fauna/bush';
import { addForkTree } from '../fauna/tree-fork';
import { addClouds } from '../fauna/clouds';

export class SceneryExample extends SketchExample {

	constructor(sceneParams) {
		super(sceneParams);

		const size = new THREE.Vector2();
		this.renderer.getSize(size);
		setLineMaterialResolution(size.x, size.y);

		this.camera.position.x = 5;
		this.camera.position.z = 8;
		this.camera.position.y = 5;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));

		const builder = new SceneBuilder(this.scene);
		builder.addGround({ y: 0, w: 50, h: 60 });
		builder.addLights();
		// builder.addSphere({ x: 2 });
		// builder.addCube({ x: -2 });
		

		for (let x = -20; x < 20; x += 5) {

			addBranchingTree({
				scene: this.scene,
				position: new THREE.Vector3(x, 0, 0),
				normal: Y_AXIS,
				length: 3,
				cutoff: 0.1,
				radius: 0.02,
			});

			addAnglyBush({
				scene: this.scene,
				position: new THREE.Vector3(x, 0, 10),
				normal: Y_AXIS,
				length: 5,
				radius: 0.02,
			});

			addForkTree({
				scene: this.scene,
				position: new THREE.Vector3(x, 0, -10),
				normal: new THREE.Vector3(0, 1, 0),
				length: 1,
				randomize: 0.5,
				radius: 0.02,
			});

			addForkTree({
				scene: this.scene,
				position: new THREE.Vector3(x, 0, -20),
				normal: new THREE.Vector3(0, 1, 0),
				length: 1,
				randomize: 0.5,
				radius: 0.02,
				forkOnly: true,
			});

			addClouds({
				scene: this.scene,
				position: new THREE.Vector3(x, 0, 30),
				normal: Y_AXIS,
				radius: 0.02,
			});
		}
	}

	render() {}

	setupParams(panel) {
		super.setupParams(panel);
	}
}