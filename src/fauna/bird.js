import * as THREE from 'three';
import { random, balancedRandom } from '@b/cool';
import { Joint, Animator, Easings, addTubeLine } from '../tre';

/**
 * little animated triangle bird
 */
export class Bird {

	/**
	 * constructs bird
	 * @params {object} params
	 * @param  {number} [params.size] - size of bird
	 * @param  {number} [params.randomize] - balanced random size
	 */
	constructor({ scene, size=1, randomize=0 }) {
		
		size = balancedRandom(size, randomize);

		this.model = new THREE.Object3D();
		scene.add(this.model);
		
		this.lines = { left: [], right: [], };
		this.joints = [];
	
		for (let i = 0; i < 3; i++) {
			const p1 = new THREE.Vector3(0, 0, 0);
			const p2 = new THREE.Vector3(-size / 2, 0, -size);
			const p3 = new THREE.Vector3(size / 2, 0, -size);

			const joint = new Joint();
			joint.addPosition(0, 0, size * 1/3 * i);

			const l1 = addTubeLine(p1, p2);
			const l2 = addTubeLine(p1, p3); 
			joint.add(l1);
			joint.add(l2);
			joint.setOrigins();
			this.model.add(joint.obj);

			let r = random(1);
			
			joint.animator = new Animator({
				start: Math.PI * -0.125,
				end: Math.PI * 0.125,
				duration: 1,
				progress: (r + i * 0.33) % 1,
				easing: Easings.SINE_OUT,
				callback: value => {
					joint.setRotation({ x: value });
				}	
			});

			this.joints.push(joint);
		}
	}


	/**
	 * update bird animation
	 * @param  {number} timeElapsedInSeconds - time from render loop
	 */
	update(timeElapsedInSeconds) {
		for (let i = 0; i < this.joints.length; i++) {
			this.joints[i].animator.update(timeElapsedInSeconds);
		}
	}
}