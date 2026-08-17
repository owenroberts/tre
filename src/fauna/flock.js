import * as THREE from 'three';
import { random } from '@b/cool';
import { FlockMember } from './flock-member';

export class Flock {

	constructor(params, memberParams) {

		this.reachedTarget = false;
		this.members = [];
		this.target = params.target ?? new THREE.Object3D();

		this.boundaries = {}; // params.boundaries ... 

		const count = random(3, 8); // params? always random?
		for (let i = 0; i < count; i++) {
			this.members.push(new FlockMember({ 
				type: params.type, 
				boundaries: this.boundaries, 
			}, memberParams));
		}
	}

	setup(start, target) {
		for (let i = 0; i < this.members.length; i++) {
			this.members[i].setup(start, target);
		}
		this.target = target;
	}

	update(timeElapsedInSeconds) {
		for (let i = 0; i < this.members.length; i++) {
			this.members[i].update(timeElapsedInSeconds, this.members, this.target);
			if (this.members[i].isTargetReached()) {
				this.reachedTarget = true;
			}
		}
	}

	isTargetReached() {
		if (this.reachedTarget) {
			this.reachedTarget = false;
			return true;
		} else {
			return false;
		}
	}

}