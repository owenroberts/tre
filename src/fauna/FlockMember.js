import * as THREE from 'three';
import { random } from '../../../cool/cool.js';
import { Bird } from './Bird.js';

export class FlockMember {

	constructor(params) {

		// this.type = params.type;

		// need to redefine boundaries a bit -- longies flock based on spherical world setup
		this.boundaries = params.boundaries; 

		this.obj = new THREE.Object3D(); // need better name for this like origin or pivot or something
		this.id = this.obj.id;

		this.member = new params.type(); // flock.members.member, awkard

		this.obj.add(this.member.model);
		this.speed = this.member.speed;
		this.flocking = this.member.flocking;
		this.flockDistribution = this.member.flockDistribution;

		this.reachedTarget = false;
		this.velocity = new THREE.Vector3(0, 0, 0);
		this.acceleration = new THREE.Vector3(0, 0, 0);
		this.maxForce =  0.1 * this.speed; // same?

	}

	setup(start, target) {
		this.obj.position.copy(start.position);
		// this.obj.up.copy(start.normal);
		this.obj.lookAt(target.position);

		this.obj.position.add(new THREE.Vector3(
			random(this.flockDistribution.x[0], this.flockDistribution.x[1]),
			random(this.flockDistribution.y[0], this.flockDistribution.y[1]),
			random(this.flockDistribution.z[0], this.flockDistribution.z[1]),
		));

		// hmm, this is a bit different ... 
		// if (type.name === 'Worm') {
		// 	obj.translateX(Cool.random(-3, 3));
		// 	obj.translateZ(Cool.random(-2, 2));
		// 	model.get().up.copy(obj.up);
		// 	model.setup(obj.position);
		// }
	}

	flock(others, target) {
		const alignment = new THREE.Vector3(); // flock velocity
		const separation = new THREE.Vector3();
		const center = new THREE.Vector3();
		let count = 0;
		
		for (let i = 0; i < others.length; i++) {
			if (this.id === others[i].id) continue;
			const other = others[i];

			const distance = this.obj.position.distanceTo(other.obj.position);
			if (distance < this.flocking.radius) {
				count++;
				center.add(other.obj.position);
				alignment.add(other.velocity);

				separation.copy(this.obj.position).sub(other.obj.position);
				separation.normalize();
				separation.divideScalar(distance);
				separation.multiplyScalar((this.flocking.radius - distance));
			}
		}

		if (count > 0) {
			separation.normalize();
			separation.sub(this.velocity);
			separation.multiplyScalar(this.flocking.separation);
			separation.multiplyScalar(this.speed);
			separation.clampScalar(-this.maxForce, this.maxForce);
			this.applyForce(separation);

			alignment.divideScalar(count);
			alignment.normalize();
			alignment.sub(this.velocity);
			alignment.multiplyScalar(this.flocking.align);
			alignment.multiplyScalar(this.speed);
			alignment.clampScalar(-this.maxForce, this.maxForce);
			this.applyForce(alignment);

			// test thiese
			// center.divideScalar(count);
			// this.seek(center);
		}
	}

	seek(target) {
		const desired = target.position.clone().sub(this.obj.position);
		desired.multiplyScalar(this.speed);
		const steer = desired.sub(this.velocity);
		steer.clampScalar(-this.maxForce, this.maxForce);
		steer.multiplyScalar(this.flocking.seek);
		this.applyForce(steer);
	}

	boundary() {
		// loop through boundaries?
		const d = obj.position.distanceTo(earthCenter);
		if (d < boundaries[0]) { 
			// console.log('bottom')
			const direction = obj.position.clone().sub(earthCenter);
			direction.normalize();
			direction.multiplyScalar(flocking.boundary);
			direction.multiplyScalar(speed).sub(velocity);
			direction.clampScalar(-maxForce, maxForce);
			applyForce(direction);
		}

		if (d > boundaries[1]) { 
			// console.log('top')
			const direction = earthCenter.clone().sub(obj.position);
			direction.normalize();
			direction.multiplyScalar(flocking.boundary);
			direction.multiplyScalar(speed).sub(velocity);
			direction.clampScalar(-maxForce, maxForce);
			applyForce(direction);
		}
	}

	applyForce(force) {
		this.acceleration.add(force);
	}

	update(timeElapsedInSeconds, others, target) {

		this.member.update(timeElapsedInSeconds);
		this.flock(others);
		this.seek(target);
		// // this.boundary();
		
		this.velocity.add(this.acceleration);
		this.velocity.clampScalar(-this.speed, this.speed);
		this.obj.position.add(this.velocity);
		this.acceleration.multiplyScalar(0);
		this.obj.lookAt(this.obj.position.clone().add(this.velocity));

		if (this.obj.position.distanceTo(target.position) < 1) { 
			this.reachedTarget = true;
		}
	}

	// seems weird to have this logic, needed?? should be flock right?
	isTargetReached() {
		if (this.reachedTarget) {
			this.reachedTarget = false;
			return true;
		} else {
			return false;
		}
	}

}