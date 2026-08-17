import * as THREE from 'three';
import { random } from '@b/cool'
import { Bird } from './bird';

export class FlockMember {

	constructor(params) {

		// need to redefine boundaries a bit -- longies flock based on spherical world setup
		this.boundaries = params.boundaries; 
		this.config = params.config;
		this.obj = new THREE.Object3D(); // need better name for this like origin or pivot or something
		this.id = this.obj.id;
		params.scene.add(this.obj);

		this.member = new params.type(params.memberParams);

		this.obj.add(this.member.model);
		this.speed = this.config.speed;
		this.flocking = this.config.flocking;
		this.distribution = this.config.distribution;

		this.targetIndex = 0;
		this.targets = params.targets;
		this.target = new THREE.Vector3().copy(params.targets[0])
		this.threshold = 1.5;

		this.velocity = new THREE.Vector3(0, 0, 0);
		this.acceleration = new THREE.Vector3(0, 0, 0);
		this.maxForce =  0.1 * this.speed; // same?

		this._alignment = new THREE.Vector3(); // flock velocity
		this._separation = new THREE.Vector3();
		this._center = new THREE.Vector3();
		this._diff = new THREE.Vector3();
		this._lookTarget = new THREE.Vector3();

		this.obj.position.copy(params.start ?? new THREE.Vector3(0, 0, 0));
		this.obj.position.add(new THREE.Vector3(
			random(this.distribution.x[0], this.distribution.x[1]),
			random(this.distribution.y[0], this.distribution.y[1]),
			random(this.distribution.z[0], this.distribution.z[1]),
		));

		this.obj.lookAt(this.target);
		this.target.copy(this.target);

	}

	flock(others) {
		this._alignment.set(0, 0, 0);
		this._separation.set(0, 0, 0);
		this._center.set(0, 0, 0);
		this._diff.set(0, 0, 0);
		let count = 0;
		
		for (let i = 0; i < others.length; i++) {
			if (this.id === others[i].id) continue;
			const other = others[i];

			const distance = this.obj.position.distanceTo(other.obj.position);
			if (distance < this.flocking.radius) {
				count++;
				this._center.add(other.obj.position);
				this._alignment.add(other.velocity);

				this._diff.subVectors(this.obj.position, other.obj.position);
				this._diff.normalize();
				this._diff.divideScalar(distance);
				this._separation.add(this._diff);
			}
		}

		if (count > 0) {
			this._separation.normalize();
			this._separation.multiplyScalar(this.speed).sub(this.velocity);
			this._separation.clampLength(0, this.maxForce);
			this.applyForce(this._separation.multiplyScalar(this.flocking.separation));

			this._alignment.divideScalar(count);
			this._alignment.normalize();
			this._alignment.sub(this.velocity);
			this._alignment.multiplyScalar(this.speed).sub(this.velocity);
			this._alignment.clampLength(0, this.maxForce);
			this.applyForce(this._alignment.multiplyScalar(this.flocking.align));

			this._center.divideScalar(count);
			this.seek(this._center);
		}
	}

	seek(targetPosition) {
		const desired = targetPosition.clone().sub(this.obj.position);
		desired.normalize().multiplyScalar(this.speed);
		const steer = desired.sub(this.velocity);
		steer.clampLength(0, this.maxForce);
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

	update(timeElapsedInSeconds, others) {

		this.member.update(timeElapsedInSeconds);

		this.flock(others);

		if (this.target) {
			this.seek(this.target);

			const dist = this.obj.position.distanceTo(this.target);

			if (dist < this.threshold) { 
				this.targetIndex = (this.targetIndex + 1) % this.targets.length;
				this.target.copy(this.targets[this.targetIndex]);
			}
		}
		// this.boundary();
		
		this.velocity.add(this.acceleration);
		this.velocity.clampScalar(-this.speed, this.speed);
		this.obj.position.add(this.velocity);
		this.acceleration.multiplyScalar(0);

		if (this.velocity.lengthSq() > 0.00001) {
			this._lookTarget.copy(this.obj.position).add(this.velocity);
			this.obj.lookAt(this._lookTarget);
		}
		
	}
}