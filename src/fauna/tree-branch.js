import * as THREE from 'three';
import { random, randInt } from '@b/cool';
import { addRandomLine } from '../utils';

export function addBranchingTree({ scene, position, normal, length, radius, cutoff=1 }) {
	
	// recusively adds branchs
	branch(position, normal, length, cutoff);

	function branch(position, normal, length, cutoff) {
		
		const pos2 = position.clone().addScaledVector(normal, length);
		const br = addRandomLine(position, pos2, radius);
		scene.add(br);

		if (length > 1) {
			length--;

			const b = randInt(1, 3);
			for (let i = 0; i < b; i++) {
				const p = pos2.clone().addScaledVector(normal, random(-1, 0));
				const n = normal.clone();
				n.x = n.x + random(-0.5, 0.5);
				n.y = n.y + random(-0.5, 0.5);
				n.z = n.z + random(-0.5, 0.5);
				branch(p, n, length, cutoff);
			}
		}
	}
}