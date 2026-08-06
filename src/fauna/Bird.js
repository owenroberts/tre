import * as THREE from 'three';
import { random } from "../../../cool/cool.js";
import { Joint, Animator, Easings } from "../tre.js";
import { addLine } from "../geometries.js";

/**
 * little animated triangle bird
 */
export class Bird {

	/**
	 * constructs bird
	 * @param  {object} [params={}]
	 * @param  {number} [params.size] - size of bird
	 */
	constructor(params={}) {
		
		const size = params.size ?? random(0.5, 2);

		// fauna have flocking params for flock class inclusion
		this.speed = 0.4;
		this.flocking = {
			radius: 10,
			align: 1,
			center: 1,
			separation: 1,
			seek: 2,
			boundary: 1,
		};

		// this prob more dependent on the project ... maybe get params from flock
		this.flockDistribution = {
			x: [-5, 5],
			y: [0, 5],
			z: [-5, 5],
		};
		
		this.model = new THREE.Object3D();
		this.lines = { left: [], right: [], };
		this.joints = [];
	
		for (let i = 0; i < 3; i++) {
			const p1 = new THREE.Vector3(0, 0, 0);
			const p2 = new THREE.Vector3(-size / 2, 0, -size);
			const p3 = new THREE.Vector3(size / 2, 0, -size);

			const joint = new Joint();
			joint.addPosition(0, 0, size * 1/3 * i);

			const l1 = addLine(p1, p2);
			const l2 = addLine(p1, p3); 
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