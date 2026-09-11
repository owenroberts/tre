import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { Animator, Easings } from '../animator';
import { Joint } from '../joint';

export class Singer {

	constructor({ scene }) {

		this.obj = new Joint();
		this.obj.setPosition({ y: 2 });
		scene.add(this.obj.obj); // woops ***

		this.loaded = { top: false, bottom: false };
		this.isLoaded = false;

		const bottom = new Joint();
		this.obj.add(bottom);
		
		const loader = new GLTFLoader();
		loader.load("./models/piggy_top.glb", gltf => {

			this.loaded.top = true;
			if (this.loaded.bottom) this.isLoaded = true;

			const top = clone(gltf.scene);
			this.addMaterial(top);
			this.obj.add(top);
		});

		loader.load("./models/piggy_bottom.glb", gltf => {

			this.loaded.bottom = true;
			if (this.loaded.top) this.isLoaded = true;

			const b = clone(gltf.scene);
			this.addMaterial(b);
			
			bottom.add(b);
			bottom.setOrigins();
			
		});

		this.anim = new Animator({
			// increment: 100,
			// randomRange: [-0.1, 0.1],
			start: 0.3,
			end: 0.5,
			clamp: true,
			randomize: true,
			randomFactor: 0.5,
			duration: 0.5,
			frameCount: 4,
			callback: value => {
				// console.log(params.timeElapsedInSeconds, value, Math.sin(value));
				// const x1 = Math.cos(value * 0.02);
				// const x2 = Math.cos(value * 0.01);
				// const v = ((x1 > x2 ? x1 : x2) + x1) / 2;
				// const r = Cool.map(v, -1, 1, 0.3, 0.5, true);
				// bottom.setTargetRotation({ x: r });
				// bottom.rotate(params.timeElapsedInSeconds);

				bottom.setRotation({ x: value });
			}
		});

	}

	update(timeElapsedInSeconds, isSinging) {
		if (isSinging) {
			this.anim.update(timeElapsedInSeconds);
		}
	}

	addMaterial(model) {
		model.traverse(child => {
			if (child.isMesh) {
				child.material = new THREE.MeshStandardMaterial({
					color: 0xffffff, 
					// wireframe: true,
				});
				child.castShadow = true;
			}
		});
	}
}