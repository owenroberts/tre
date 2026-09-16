import * as THREE from 'three';
import { random, randInt, choice, Sequencer } from '@b/cool';
import { Joint } from '../joint';
import { Animator } from '../animator';

/**
 * lerp camera to target
 * does not look at!
 * move camera before render to avoid weird snapping (or not....)
 */
export class CameraController {

	/**
	 * create camera controller
	 * @param  {object}  options.camera              - three js camera
	 * @param  {boolean} options.isFocusActive       - actively focusing on object
	 * @param  {boolean} options.isRemoveGoalOnReach - remove the focus goal once it arrives
	 */
	constructor({ camera, offset, isFocusActive=false, isRemoveGoalOnReach=true }) {

		this.camera = camera;
		if (offset) this.camera.position.copy(offset);

		this.temp = new THREE.Vector3;
		this.goal = new THREE.Object3D;
		this.goal.position.copy(this.camera.position);

		this.isRemoveGoalOnReach = isRemoveGoalOnReach;
		this.isFocusActive = isFocusActive;

		this.pivot = new Joint();
		this.camJoint = new Joint();

		this.pivot.setOrigins();
		this.pivot.add(this.camJoint);

		this.camJoint.add(this.camera);
		this.camJoint.setOrigins();

		// this.sequencer = new Sequencer();

	}

	addAnimation() {
		const animType = choice(["translate", 'rotate']);
		if (animType === "translate") {
			this.animator = new Animator({
				duration: random(3, 8),
				frameCount: randInt(3, 6),
				start: 0,
				end: random(-2, 2),
				mirror: false,
				loop: false,
				callback: value => {
					this.camJoint.setPosition({ z: value });
				},
			});
		}
		if (animType === "rotate") {
			this.animator = new Animator({
				duration: random(3, 8),
				frameCount: randInt(3, 6),
				start: 0,
				end: random(-2, 2),
				mirror: false,
				loop: false,
				callback: value => {
					this.camJoint.setRotation({ y: value });
				}
			});
		}
	}

	/**
	 * set focus of camera
	 * @param  {object} target    - three js object
	 * @param  {number} distance  - distance from the object
	 * @param  {number} direction - direction to offset distance
	 */
	focus(target, distance, direction) {

		this.isFocusActive = true;
		
		const targetPosition = new THREE.Vector3();
  		target.getWorldPosition(targetPosition);
		
		const offset = direction.clone().normalize().multiplyScalar(distance);

		this.goal.position.copy(targetPosition).add(offset);
		this.goal.updateMatrixWorld();
	}

	/**
	 * update camera position
	 */
	update(timeElapsedInSeconds) {


		if (this.isFocusActive) {
			this.temp.setFromMatrixPosition(this.goal.matrixWorld);
			const dist = this.camera.position.distanceTo(this.temp);
			if (dist > 1) {
				this.camera.position.lerp(this.temp, 0.02);
			} else if (dist > 0.1) {
				this.camera.position.lerp(this.temp, 0.04);
			} else {
				this.camera.position.copy(this.temp);
				if (this.isRemoveGoalOnReach) {
					this.isFocusActive = false;
				}
			}
			return;
		}

		if (this.animator) {
			this.animator.update(timeElapsedInSeconds);
		}

	}
}