import * as THREE from 'three';
import { random } from '../../../cool/cool.js';
import { getAxesHelper } from '../helpers.js';

export class Follower {

	constructor(rider) {

		this.target = new THREE.Object3D();
		this.rider = rider; // rider is the animation/flock/obj moving w follower

		this.nextCount = 0;
		this.speed = 0.004;
		this.nextPosition = new THREE.Vector3();
		// this.nextNormal = new THREE.Vector3();
		this.prevDistance = 1_000_000; // start off bigger than ever will be
		this.reachedTarget = false;

	}

	setup(start, next) {
		this.target.position.set(start.position.x, start.position.y, start.position.z);
		// this.target.up.copy(start.normal);
		// this.target.lookAt(next.position);
		this.nextPosition.copy(next.position);
		// this.nextNormal.copy(next.normal);
		
		target.add(getAxesHelper()); // debug
	}

	setTarget(next) {
		this.nextCount++;
		this.reachedNext = false;
		this.prevDistance = 1_000_000;
		
		// this.target.up.copy(this.nextNormal);
		this.nextPosition.copy(next.position) ;
		// this.nextNormal.copy(next.normal); // why does follower need normal?
		
		this.target.lookAt(this.nextPosition);
	}

	update(timeElapsedInSeconds) {

		if (isNaN(timeElapsedInSeconds)) return; // init error?

		this.rider.update(timeElapsedInSeconds, this.target);

		// actually maybe forget the whole reached target tracking in flock guys ... 
		if (this.rider.reachedTarget) {
			this.reachedTarget = true;
		}

		// handle in rider, not here
		// if (flock) {
		// 	flock.update(timeElapsed, target);
		// 	if (flock.reachedTarget()) {
		// 		reachedNext = true;
		// 	}
		// } else {
		// 	if (isWalking) {
		// 		const walkDistance = target.position.distanceTo(nextPosition);
		// 		if (walkDistance > 0.1 && (prevDistance - walkDistance) > 0) {
		// 			target.translateZ(speed * timeElapsed);
		// 			prevDistance = walkDistance;
		// 		} else {
		// 			reachedNext = true;
		// 		}
		// 	}

		// 	if (animation) {
		// 		animation.update(timeElapsed, isWalking);
		// 	}
		// }
	}

}