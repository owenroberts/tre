import * as THREE from 'three';
import { random } from '@b/cool';
import { getAxesHelper } from '../helpers';

export class Follower {

	constructor({ scene, targets, children=[], isCyclic=true, }) {

		this.isActive = true;
		this.isCyclic = isCyclic;

		this.obj = new THREE.Object3D();
		scene.add(this.obj);

		this.updaters = [];

		this.obj.add(getAxesHelper());

		for (let i = 0; i < children.length; i++) {
			this.addChild(children[i]);
		}
		
		this.targets = targets;
		this.targetIndex = 0;
		this.target = new THREE.Vector3();
		this.target.copy(targets[0]);

		this.nextCount = 0;
		this.speed = 4;
		this.prevDistance = 1_000_000; // start off bigger than ever will be
		this.reachedTarget = false;

		// this.obj.position.copy(this.target);
		this.obj.lookAt(this.target);

	}

	addChild(obj) {
		this.obj.add(obj); // lol
		if (obj.update) {
			this.updaters.push(obj);
		}
	}

	setTarget(target) {
		this.target.copy(target);
		this.obj.lookAt(target);
	}

	addTarget(target) {
		this.targets.push(target);
	}

	update(timeElapsedInSeconds) {
		if (!this.isActive) return;
		if (isNaN(timeElapsedInSeconds)) return; // init error?

		for (let i = 0; i < this.updaters.length; i++) {
			this.updaters[i].update(timeElapsedInSeconds, this.target);
		}

		const dist = this.obj.position.distanceTo(this.target);
		// if (dist > 0.1 && (this.prevDistance - dist) > 0) {
		if (dist > 0.1) {
			this.obj.translateZ(this.speed * timeElapsedInSeconds);
			// this.prevDistance = dist;
		} else {
			if (this.isCyclic) {
				this.targetIndex = (this.targetIndex + 1) % this.targets.length;
				this.target.copy(this.targets[this.targetIndex]);
				this.obj.lookAt(this.target);
			} else {
				this.isActive = false;
			}
		}
	}
}