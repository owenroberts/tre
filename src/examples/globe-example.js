import * as THREE from 'three';
import { SketchExample } from './sketch-example';
import { SceneBuilder } from './scene-builder';
import { Globe } from '../fauna/globe';
import { CameraController } from '../fauna/camera-controller';
import { Animator } from '../tre';

export class GlobeExample extends SketchExample {
	constructor(sceneParams) {
		super(sceneParams);

		this.camera.position.x = 256;
		this.camera.position.z = 256;
		this.camera.position.y = 50;

		this.origin = new THREE.Vector3(0, 0, 0);
		this.localY = new THREE.Vector3(0, 1, 0);

		this.camera.lookAt(this.origin);

		this.builder = new SceneBuilder(this.scene);
		this.builder.addLights();

		this.globe = new Globe({ worldRadius: 128, scene: this.scene });
		this.elements = [];
		this.cc = new CameraController({ camera: this.camera });
	}

	render(timeElapsedInSeconds) {

		this.cc.update(timeElapsedInSeconds);
		this.camera.lookAt(this.origin);

		for (let i = 0; i < this.elements.length; i++) {
			if (this.elements[i].animator) {
				this.elements[i].animator.update(timeElapsedInSeconds);
			}
		}
	}

	addCube(vertex, size, addAnimator) {

		const cube = this.builder.addCube({ 
			size, 
			x: vertex.position.x, 
			y: vertex.position.y,
			z: vertex.position.z,
		});

		cube.quaternion.setFromUnitVectors(this.localY, vertex.normal);
		this.elements.push(cube);
		
		if (!addAnimator) return;

		cube.animator = new Animator({
			end: Math.PI * 2,
			duration: 5,
			mirror: false,
			callback: value => {
				cube.rotation.y = value;
				cube.rotation.x = value;
			}
		});

	}

	setupParams(panel) {
		super.setupParams(panel);

		panel.addBreak();
		panel.addButton({
			text: "add random cube",
			callback: () => {
				const v = this.globe.getRandomVertex();
				this.addCube(v, 16, true);
			}
		});

		panel.addButton({
			text: "focus last cube",
			callback: () => {
				const obj = this.elements.at(-1);
				this.cc.focus(obj, this.camera.position.distanceTo(this.origin), obj.position);
			}
		});

		panel.addButton({
			text: "add neighbors",
			callback: () => {
				if (this.elements.length < 1) return;

				const obj = this.elements.at(-1);
				this.globe.getClosestNeighbors(obj.position).forEach(n => {
					this.addCube(n, 8, false);
				});
			}
		});
		
	}
}