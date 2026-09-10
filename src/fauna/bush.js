import * as THREE from 'three';
import { random, randInt } from '@b/cool';
import { X_AXIS, Z_AXIS, addRandomLine } from '../utils';

export function addAnglyBush({ scene, position, normal, length, radius, cutoff=1 }) {

	addBush(position, normal, length);

	function addBush(position, normal, length) {

		const z_angle = random(Math.PI * 2);
		const x_angle = random(0.2, 0.6);

		const o = new THREE.Object3D();
		o.position.copy(position);
		o.lookAt(position.clone().add(normal));
		o.rotateOnAxis(Z_AXIS, z_angle);
		o.rotateOnAxis(X_AXIS, x_angle);
		o.translateZ(length);
		scene.add(addRandomLine(position, o.position, radius));

		const o2 = new THREE.Object3D();
		o2.position.copy(o.position);
		o2.lookAt(position);
		o2.rotateOnAxis(Z_AXIS, -z_angle);
		o2.rotateOnAxis(X_AXIS, x_angle * 2);
		o2.translateZ(length);
		scene.add(addRandomLine(o.position, o2.position, radius));

		length -= random(1, 2);
		if (length > 1) {
			addBush(o2.position, normal, length);
		}
	}

}