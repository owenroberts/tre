import * as THREE from 'three';
import { random } from '@b/cool';
import { X_AXIS, Z_AXIS, addRandomLine } from '../utils';

export function addForkTree({ scene, position, normal, length, radius, randomize, forkOnly=false }) {
	
	length = length - randomize * length + random(randomize) * length * 2;

	const o = new THREE.Object3D();
	o.position.copy(position);
	o.lookAt(position.clone().add(normal));
	o.rotateOnAxis(Z_AXIS, random(Math.PI * 2));
	o.rotateOnAxis(X_AXIS, random(0.2, 0.6));
	o.translateZ(length / 2);
	if (!forkOnly) {
		scene.add(addRandomLine(position, o.position, radius));
	}

	const oo = o.clone();
	oo.lookAt(o.position.clone().add(normal));
	oo.translateZ(length / 2);
	if (!forkOnly) {
		scene.add(addRandomLine(o.position, oo.position, radius));
	}

	const len2 = length * random(0.25, 1.5);
	const no = oo.clone();
	no.translateX(len2);
	const o2 = oo.clone();
	o2.translateX(-len2);
	if (!forkOnly) {
		scene.add(addRandomLine(no.position, o2.position, radius));
	}
	
	for (let i = 0; i < 5; i++) {
		const o3 = forkOnly ? o.clone() : no.clone();
		o3.translateX(i * -len2 / 2);
		const o4 = o3.clone();
		o4.translateZ(random(2, 6));
		scene.add(addRandomLine(o3.position, o4.position, radius));
	}
}