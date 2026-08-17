import * as THREE from 'three';
import { UITree } from '@b/oi';

import { SceneBuilder } from './scene-builder';
import { getAnimatorParams } from './get-animator-params';
import { Joint, Easings, Animator } from '../tre';

export class JointAnimatorExample {
	constructor(sceneParams) {

		this.scene = sceneParams.scene;
		this.camera = sceneParams.camera;
		this.renderer = sceneParams.renderer;

		this.debug = false;
		this.isActive = false;

		const builder = new SceneBuilder(this.scene);
		builder.addGround();
		builder.addLights();

		const j = new Joint();
		j.debug(this.scene);
		j.setPosition(0, 0.3, 0);
		j.rotateY(Math.PI * -0.25);
		this.scene.add(j.obj);

		const top = builder.addCube();
		top.position.set(0, 0.5, 0.5);
		j.add(top);

		const bottom = new Joint();
		const m = builder.addCube();
		bottom.add(m);
		m.position.set(0, -0.5, 0.5);
		bottom.rotateX(Math.PI * 0.1);
		bottom.setOrigins();
		j.add(bottom);

		this.bottomAnim = new Animator({
			start: Math.PI * 0.0125,
			end: Math.PI * 0.25,
			duration: 1,
			// randomize: true,
			randomFactor: 0.5,
			callback: value => {
				// console.log(value);
				if (this.isActive) {
					bottom.setTargetRotation({ x: value });
					bottom.rotate();
				} else {
					bottom.unrotate();
				}
			}
		});
	}

	animate(time) {
		if (!this.prevTime) this.prevTime = time;
		const timeElapsed = time - this.prevTime;
		this.prevTime = time;
		const timeElapsedInSeconds = timeElapsed / 1000;

		this.renderer.render(this.scene, this.camera);
		this.bottomAnim.update(timeElapsedInSeconds);
	}

	setupParams(panel) {

		panel.addRef({ obj: this, ref: "debug", });
		panel.addRef({ obj: this, ref: "isActive", });
		panel.addBreak();
		const af = panel.addTree("animation");

		getAnimatorParams(af, this.bottomAnim);


	}
}