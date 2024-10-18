/*
	joint for procedural cat
*/

import * as THREE from 'three';
import * as Cool from '../cool/cool.js';

export function Joint() {

	const obj = new THREE.Object3D();
	const oQ = new THREE.Quaternion(); // original quat
	const tQ = new THREE.Quaternion(); // target quat
	const tE = new THREE.Euler(); // target euler for copying
	const oP = new THREE.Vector3(); // original position
	const tP = new THREE.Vector3(); // target position

	// save original value for easy math
	let xR = 0, yR = 0, zR = 0;
	let xP = 0, yP = 0, zP = 0;

	let rotateSpeed = 1;
	let lerpSpeed = 1;

	return {
		get: () => { return obj; },
		getPosition: () => { return obj.position; },
		getRotation: () => { return obj.rotation; },
		setRotateSpeed: value => { rotateSpeed = value; },
		setLerpSpeed: value => { lerpSpeed = value; },
		setPosition: (x, y, z) => { obj.position.set(x, y, z); },
		add: child => {
			if (child.isMesh || child.isObject3D) obj.add(child); 
			else obj.add(child.get());
		},
		copy: o => {
			if (o.isVector3) obj.position.copy(o);
			if (o.isQuaternion) obj.quaternion.copy(o);
		},
		setTargetRotation: params => {
			// console.log(params); // idk abt performance here .. 
			// tE.setFromQuaternion(oQ);
			tE.x = params.x !== undefined ? params.x : xR;
			tE.y = params.y !== undefined ? params.y : yR;
			tE.z = params.z !== undefined ? params.z : zR;
			// tE.set(x, y, z);
			tQ.setFromEuler(tE);
		},
		rotate: timeElapsed => {
			if (obj.quaternion.equals(tQ)) return;
			obj.quaternion.rotateTowards(tQ, timeElapsed * rotateSpeed);
		},
		unrotate: timeElapsed => {
			if (obj.quaternion.equals(oQ)) return;
			obj.quaternion.rotateTowards(oQ, timeElapsed * rotateSpeed);
		},
		setTargetPosition: params => {
			tP.x = params.x !== undefined ? params.x : xP;
			tP.y = params.y !== undefined ? params.y : yP;
			tP.z = params.z !== undefined ? params.z : zP;
			// tP.set(x, y, z);
		},
		lerp: timeElapsed => { 
			obj.position.lerp(tP, timeElapsed * lerpSpeed); 
		},
		unlerp: timeElapsed => {
			obj.position.lerp(oP, timeElapsed * lerpSpeed);
		},
		setOrigins: () => {
			oQ.copy(obj.quaternion);
			oP.copy(obj.position);

			const oE = new THREE.Euler().setFromQuaternion(oQ);
			xR = oE.x;
			yR = oE.y;
			zR = oE.z;

			xP = oP.x;
			yP = oP.y;
			zP = oP.z;
		},
		isAtOrigin: () => {
			if (obj.position.distanceTo(oP) < 0.01) {
				obj.position.copy(oP);
			}
			return obj.position.equals(oP) && obj.quaternion.equals(oQ);
		},
		addPosition: (x, y, z) => {
			obj.position.add(new THREE.Vector3(x, y, z));
		},
		rotateX: a => { obj.rotateX(a); },
		rotateY: a => { obj.rotateY(a); },
		rotateZ: a => { obj.rotateZ(a); },
		rotateOnAxis: (axis, a) => {
			if (axis === 'x') obj.rotateX(a);
			if (axis === 'y') obj.rotateY(a);
			if (axis === 'z') obj.rotateZ(a);
		},
		translateX: v => { obj.translateX(v); },
		translateY: v => { obj.translateY(v); },
		translateZ: v => { obj.translateZ(v); },
		translateOnAxis: (axis, v) => {
			if (axis === 'x') obj.translateX(v);
			if (axis === 'y') obj.translateY(v);
			if (axis === 'z') obj.translateZ(v);
		},
		randomRotation: () => {
			for (let i = 0; i < obj.children.length; i++) {
				if (obj.children[i].isMesh) {
					const r = new THREE.Euler(
						Cool.random(0, Math.PI * 2),
						Cool.random(0, Math.PI * 2),
						Cool.random(0, Math.PI * 2),
					);
					obj.children[i].quaternion.setFromEuler(r);
				}
			}
		}
	};
}