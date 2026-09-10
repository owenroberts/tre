import * as THREE from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class ModelCat {
	
	constructor({ scene }) {

		this.animations = {};
		this.isLoaded = false;

		const loader = new GLTFLoader();
		loader.load("./models/cat_1.glb", gltf => {
			this.model = clone(gltf.scene);
			scene.add(this.model);

			this.model.traverse(obj => {
				if (obj.isMesh) {
					obj.castShadow = true;
				}
			});

			this.mixer = new THREE.AnimationMixer(this.model);
			gltf.animations.forEach(a => {
				this.animations[a.name] = a;
			});
			this.mixer.clipAction(this.animations['Idle_1']).play();

			this.isLoaded = true;
		});
	}

	update(timeElapsedInSeconds, isWalking) {
		if (!this.isLoaded) return;

		this.mixer.update(timeElapsedInSeconds);

		if (isWalking) {
			this.mixer.clipAction(this.animations['Idle_1']).stop();
			this.mixer.clipAction(this.animations['Walk1']).play();
		} else {
			this.mixer.clipAction(this.animations['Walk1']).stop();
			this.mixer.clipAction(this.animations['Idle_1']).play();
		}
	}
}