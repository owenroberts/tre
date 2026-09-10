import * as THREE from 'three';
import { random, randInt } from '@b/cool';
import { addRandomLine } from '../utils';

// need more control here ***

export function addClouds({ scene, position, normal, radius }) {

	const n = randInt(4, 8);
	const d = randInt(20, 40);
	const p = position.clone().addScaledVector(normal, d);

	for (let i = 0; i < n; i++) {

		const o = new THREE.Object3D();
		o.position.copy(p);
		o.lookAt(p.clone().add(normal));
		const o2 = o.clone();
		
		const xs = random(2, 20); // x spread
		const ys = random(2, 20); // y spread
		const zs = random(2, 4); // z spread

		o.translateX(random(-1, 1) * xs);
		o.translateY(random(-1, 1) * ys);
		o.translateZ(random(-1, 1) * zs);

		o2.translateX(random(-1, 1) * xs);
		o2.translateY(random(-1, 1) * ys);
		o2.translateZ(random(-1, 1) * zs);

		scene.add(addRandomLine(o.position, o2.position, radius));
	}

}