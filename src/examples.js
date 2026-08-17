import { UIPanel } from '@b/oi';
import { alphabet } from '@b/cool';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';

import { Default } from './examples/default';
import { PostSketchy } from './examples/post-sketchy';
import { PostTeddy } from './examples/post-teddy';
import { PostBandSky } from './examples/post-band-sky';
import { AnimatorExample } from './examples/animator-example';
import { JointExample } from './examples/joint-example';
import { JointAnimatorExample } from './examples/joint-animator-example';
import { BirdExample } from './examples/bird-example';
import { BirdFlock } from './examples/bird-flock';

const exampleList = [
	Default,
	PostSketchy,
	PostTeddy,
	PostBandSky,
	AnimatorExample,
	JointExample,
	JointAnimatorExample,
	BirdExample,
	BirdFlock,
];

export class ExamplesPanel extends UIPanel {
	constructor(ui) {
		super({ id: "examples", ui });

		this.isSceneLoaded = false;

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.camera.position.z = 5;

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);


		for (let i = 0; i < exampleList.length; i++) {
			const ex = exampleList[i];
			this.addButton({
				text: `${alphabet[i]} ~ ${ex.name}`,
				key: alphabet[i],
				callback: () => {
					this.load(ex);
				}
			});
			// this.addBreak();
		}
	}

	load(ex) {
		if (this.isSceneLoaded) {
			this.renderer.setAnimationLoop(null);
			this.dispose(this.scene);
			this.renderer.clear();
			this.ui.panels.params.clear();
		}
		const exampleScene = new ex(this);
		this.renderer.setAnimationLoop(time => {
			exampleScene.animate(time);
		});
		if (exampleScene.setupParams) {
			exampleScene.setupParams(this.ui.panels.params);
		}
		this.isSceneLoaded = true;
	}

	dispose(obj) {
		if (obj === null) return;

		for (let i = obj.children.length - 1; i >= 0; i--) {
			this.dispose(obj.children[i]);
		}

		if (obj.isScene) return;
		this.scene.remove(obj);

		if (obj.geometry) {
			obj.geometry.dispose();
			obj.geometry = undefined;
		}

		if (obj.material) {

			if (obj.material.map) {
				obj.material.map.dispose();
				obj.material.map = undefined;	
			}

			obj.material.dispose();
			obj.material = undefined;
		}

		obj = undefined;
	}
}