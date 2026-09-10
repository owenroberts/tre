import * as THREE from 'three';
import { balancedRandom, random, randInt, choice } from '@b/cool';
import { Joint, Animator, Easings } from '../tre';
import { addTubeLine, mat } from '../utils';

export class Worm {

	constructor({ scene, size=0.1, randomize=0.05 }) {

		size = balancedRandom(size, randomize);

		this.animators = [];
		this.model = new THREE.Object3D();
		scene.add(this.model);

		const coord = choice(['x', 'y']);
		const jointCount = randInt(3, 6);
		const joints = [];

		for (let i = 0; i < jointCount; i++) {
			
			const joint = new Joint();
			if (i > 0) joint.translateZ(size * -4 * i);
			// if (i > 0) joint.translateZ(s * -4);
			const geo = new THREE.CapsuleGeometry(size, size * 2, 1, 5);
			const mesh = new THREE.Mesh(geo, mat);
			mesh.translateZ(size * -2);
			mesh.rotateX(Math.PI / 2);
			mesh.castShadow = true;
			joint.add(mesh);

			this.animators.push(new Animator({
				easing: Easings.SINE_IN_OUT,
				start: -0.1,
				end: 0.1,
				progress: i / jointCount,
				callback: value => {
					const p = {};
					p[coord] = value;
					joint.setPosition(p);
				}
			}));

			// antennae
			if (i === 0) {
				const p1 = mesh.position.clone();
				p1.add(new THREE.Vector3(0, 0, random(size, size * 1.5)));
				const p2 = p1.clone();
				const p3 = p1.clone();
				p2.add(new THREE.Vector3(
					random(size * 2, -size),
					random(size, size * 2),
					0, // Cool.random(-s * 2, s),
				));

				p3.add(new THREE.Vector3(
					random(size * 2, size),
					random(size, size * 2),
					0, // Cool.random(-s * 2, s),
				));

				joint.add(addTubeLine(p1, p2, size * 0.1));
				joint.add(addTubeLine(p1, p3, size * 0.1));
			}

			joint.setOrigins();
			
			this.model.add(joint.obj);
			joints.push(joint);
		}
	}

	update(timeElapsedInSeconds) {
		for (let i = 0; i < this.animators.length; i++) {
			this.animators[i].update(timeElapsedInSeconds);
		}
	}

}
