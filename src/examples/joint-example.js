import * as THREE from 'three';
import { UITree } from '@b/oi';

import { SceneBuilder } from './scene-builder';
import { Joint } from '../tre';

export class JointExample {
	constructor(sceneParams) {

		this.scene = sceneParams.scene;
		this.camera = sceneParams.camera;
		this.renderer = sceneParams.renderer;

		this.debug = false;

		const builder = new SceneBuilder(this.scene);
		builder.addGround();
		builder.addLights();

		this.j = new Joint();
		this.j.debug(this.scene);
		this.j.setPosition(0, 0.2, 0);
		this.scene.add(this.j.obj);

		const top = builder.addCube();
		top.position.set(0, 0.5, 0.5);
		this.j.add(top);

		this.b = new Joint();
		const m = builder.addCube();
		this.b.add(m);
		m.position.set(0, -0.5, 0.5);
		this.b.rotateX(Math.PI * 0.1);
		this.j.add(this.b);
	}

	animate(time) {
		if (!this.prevTime) this.prevTime = time;
		const timeElapsed = time - this.prevTime;
		this.prevTime = time;
		const timeElapsedInSeconds = timeElapsed / 1000;

		this.renderer.render( this.scene, this.camera );

	}

	setupParams(panel) {

		panel.addRef({ obj: this, ref: "debug", });
		panel.addBreak();

		// const jfm = panel.add(new UITree({ title: "main joint", ui: panel.ui }));
		const jfm = panel.addTree("main joint");

		jfm.addParam('position x', {
			obj: this.j.obj.position, 
			ref: 'x', 
			min: -10,
			max: 10,
			step: 0.1,
		});
			
		jfm.addParam('position y', {
			obj: this.j.obj.position, 
			ref: 'y', 
			min: -10, 
			max: 10,
			step: 0.1,
		});
			
		jfm.addParam('position z', {
			obj: this.j.obj.position, 
			ref: 'z', 
			min: -10, 
			max: 10,
			step: 0.1,
		});
			
		jfm.addParam('rotation x', {
			obj: this.j.obj.rotation, 
			ref: 'x', 
			min: -Math.PI, 
			max: Math.PI,
			step: 0.1,
		});

		jfm.addParam('rotation y', {
			obj: this.j.obj.rotation, 
			ref: 'y', 
			min: -Math.PI, 
			max: Math.PI,
			step: 0.1,
		});

		jfm.addParam('rotation z', {
			obj: this.j.obj.rotation, 
			ref: 'z', 
			min: -Math.PI, 
			max: Math.PI,
			step: 0.1,
		});

		panel.addBreak();
		const jfb = panel.addTree("bottom joint");

		jfb.addParam('position x', {
			obj: this.b.obj.position, 
			ref: 'x', 
			min: -10, 
			max: 10,
			step: 0.1,
		});
			
		jfb.addParam('position y', {
			obj: this.b.obj.position, 
			ref: 'y', 
			min: -10, 
			max: 10,
		});
			
		jfb.addParam('position z', {
			obj: this.b.obj.position, 
			ref: 'z', 
			min: -10, 
			max: 10,
		});
			
		jfb.addParam('rotation x', {
			obj: this.b.obj.rotation, 
			ref: 'x', 
			min: -Math.PI, 
			max: Math.PI,
			step: 0.1,
		});

		jfb.addParam('rotation y', {
			obj: this.b.obj.rotation, 
			ref: 'y', 
			min: -Math.PI, 
			max: Math.PI,
			step: 0.1,
		});

		jfb.addParam('rotation z', {
			obj: this.b.obj.rotation, 
			ref: 'z', 
			min: -Math.PI, 
			max: Math.PI,
			step: 0.1,
		});

	}
}