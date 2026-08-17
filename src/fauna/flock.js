import * as THREE from 'three';
import { random } from '@b/cool';
import { FlockMember } from './flock-member';

export const BIRD_FLOCK_CONFIG = {
	speed: 0.2,
	flocking: {
		radius: 10,
		align: 0.5,
		center: 0.5,
		separation: 2.5,
		seek: 1.8,
		boundary: 1,
	},
	distribution: {
		x: [-5, 5],
		y: [0, 5],
		z: [-5, 5],
	},
};

export class Flock {

	constructor(params) {

		this.members = [];
		this.boundaries = {}; // params.boundaries ... 

		const count = params.count ?? random(3, 8); // params? always random?
		for (let i = 0; i < count; i++) {
			this.members.push(new FlockMember(params));
		}
	}

	update(timeElapsedInSeconds) {
		for (let i = 0; i < this.members.length; i++) {
			this.members[i].update(timeElapsedInSeconds, this.members);
		}
	}
}