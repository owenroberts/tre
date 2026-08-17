import * as THREE from 'three';
import { assert, random } from '../../cool/cool.js';
import { getAxesHelper } from '../src/helpers.js';

/**
 * joint class
 * used for animating and building procedurally
 * idk, idk
 */
export class Joint {

	constructor({ rotateStep=0.01 }={}) {

		Object.assign(this, { rotateStep });

		this.isJoint = true;
		this.obj = new THREE.Object3D(); //  * just extend Object3D?
		
		this.oQ = new THREE.Quaternion(); // original quat
		this.tQ = new THREE.Quaternion(); // target quat
		this.tE = new THREE.Euler(); // target euler for copying
		this.oP = new THREE.Vector3(); // original position
		this.tP = new THREE.Vector3(); // target position

		// need this ?? 
		// save original value for easy math
		let xR = 0, yR = 0, zR = 0;
		let xP = 0, yP = 0, zP = 0;
	}

	add(child) {
		assert(child.isMesh || child.isObject3D || child.isJoint, `child must be mesh, object3d or join)`);

		if (child.isMesh || child.isObject3D) this.obj.add(child);
		if (child.isJoint) this.obj.add(child.obj);
	}

	setPosition(x, y, z) {
		this.obj.position.set(x, y, z);
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

	rotate() {
		if (this.obj.quaternion.equals(this.tQ)) return;
		this.obj.quaternion.rotateTowards(this.tQ, this.rotateStep);
	}

	unrotate() {
		if (this.obj.quaternion.equals(this.oQ)) return;
		this.obj.quaternion.rotateTowards(this.oQ, this.rotateStep);
	}

	rotateX(a) { this.obj.rotateX(a); }
	rotateY(a) { this.obj.rotateY(a); }
	rotateZ(a) { this.obj.rotateZ(a); }

	setRotation(r) {
		if (r.hasOwnProperty('x')) this.tE.x = r.x;
		if (r.hasOwnProperty('y')) this.tE.y = r.y;
		if (r.hasOwnProperty('z')) this.tE.z = r.z;
		this.obj.quaternion.setFromEuler(this.tE);
	}

	setOrigins() {
		this.oP.copy(this.obj.position);
		this.oQ.copy(this.obj.quaternion);

		// const oE = new THREE.Euler().setFromQuaternion(oQ);
		// xR = oE.x;
		// yR = oE.y;
		// zR = oE.z;

		// xP = oP.x;
		// yP = oP.y;
		// zP = oP.z;
	}

	debug() {
		this.obj.add(getAxesHelper(this.obj.position, this.obj.normal));
	}

}
