import * as THREE from 'three';
import { assert, random } from '../../cool/cool.js';
import { getAxesHelper } from '../src/helpers.js';

/**
 * joint class
 * used for animating and building procedurally
 * idk, idk
 */
export class Joint {

	constructor({ rotateStep=2, lerpStep=2 }={}) {

		Object.assign(this, { rotateStep }); // wtf? ***
		Object.assign(this, { lerpStep });

		this.isJoint = true;
		this.obj = new THREE.Object3D(); //  * just extend Object3D?
		
		this.oQ = new THREE.Quaternion(); // original quat
		this.tQ = new THREE.Quaternion(); // target quat
		this.tE = new THREE.Euler(); // target euler for copying
		this.oP = new THREE.Vector3(); // original position
		this.tP = new THREE.Vector3(); // target position
	}

	add(child) {
		assert(child.isMesh || child.isObject3D || child.isJoint, `child must be mesh, object3d or join)`);

		if (child.isMesh || child.isObject3D) this.obj.add(child);
		if (child.isJoint) this.obj.add(child.obj);
	}

	setPosition(v) {
		if (v.hasOwnProperty('x')) this.obj.position.x = v.x;
		if (v.hasOwnProperty('y')) this.obj.position.y = v.y;
		if (v.hasOwnProperty('z')) this.obj.position.z = v.z;
	}

	addPosition(x, y, z) {
		this.obj.position.x += x;
		this.obj.position.y += y;
		this.obj.position.z += z;
	}

	setTargetRotation(r) {
		if (r.hasOwnProperty('x')) this.tE.x = r.x;
		if (r.hasOwnProperty('y')) this.tE.y = r.y;
		if (r.hasOwnProperty('z')) this.tE.z = r.z;
		this.tQ.setFromEuler(this.tE);
	}

	// animator uses time 
	rotate() {
		if (this.obj.quaternion.equals(this.tQ)) return;
		this.obj.quaternion.rotateTowards(this.tQ, this.rotateStep);
	}

	// needs time from anim loop to reset
	unrotate(timeElapsedInSeconds) {
		if (this.obj.quaternion.equals(this.oQ)) return;
		this.obj.quaternion.rotateTowards(this.oQ, this.rotateStep * timeElapsedInSeconds);
	}

	setTargetPosition(v) {
		this.tP.x = v.hasOwnProperty('x') ? v.x : xP;
		this.tP.y = v.hasOwnProperty('y') ? v.y : yP;
		this.tP.z = v.hasOwnProperty('z') ? v.z : zP;
	}

	// animator uses time 
	lerp() {
		this.obj.position.lerp(this.tP, this.lerpStep); 
	}

	// needs time from anim loop to reset
	unlerp(timeElapsedInSeconds) {
		this.obj.position.lerp(this.oP, timeElapsedInSeconds * this.lerpStep);
	}

	rotateX(a) { this.obj.rotateX(a); }
	rotateY(a) { this.obj.rotateY(a); }
	rotateZ(a) { this.obj.rotateZ(a); }

	translateX(v) { this.obj.translateX(v); }
	translateY(v) { this.obj.translateY(v); }
	translateZ(v) { this.obj.translateZ(v); }

	setRotation(r) {
		if (r.hasOwnProperty('x')) this.tE.x = r.x;
		if (r.hasOwnProperty('y')) this.tE.y = r.y;
		if (r.hasOwnProperty('z')) this.tE.z = r.z;
		this.obj.quaternion.setFromEuler(this.tE);
	}

	setOrigins() {
		this.oP.copy(this.obj.position);
		this.oQ.copy(this.obj.quaternion);

		this.tE.setFromQuaternion(this.oQ);
	}

	isAtOrigin() {
		if (this.obj.position.distanceTo(this.oP) < 0.01) {
			this.obj.position.copy(this.oP);
		}
		return this.obj.position.equals(this.oP) && this.obj.quaternion.equals(this.oQ);
	}

	setRandomRotations() {
		for (let i = 0; i < this.obj.children.length; i++) {
			if (this.obj.children[i].isMesh) {
				const r = new THREE.Euler(
					random(0, Math.PI * 2),
					random(0, Math.PI * 2),
					random(0, Math.PI * 2),
				);
				this.obj.children[i].quaternion.setFromEuler(r);
			}
		}
	}

	copy(obj) {
		if (obj.isVector3) this.obj.position.copy(obj);
		if (obj.isQuaternion) this.obj.quaternion.copy(obj);
	}

	debug() {
		this.obj.add(getAxesHelper(this.obj.position, this.obj.normal));
	}

	getPosition() {
		return this.obj.position;
	}

}
