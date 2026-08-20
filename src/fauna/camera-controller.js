import * as THREE from 'three';

/**
 * lerp camera to target
 * does not look at!
 * move camera before render to avoid weird snapping (or not....)
 */
export class CameraController {

	/**
	 * create camera controller
	 * @param  {Camera}  camera   three js camera
	 * @param  {boolean} isActive
	 */
	constructor(camera, isActive, isRemoveGoalOnReach) {

		this.camera = camera;

		this.temp = new THREE.Vector3;
		this.goal = new THREE.Object3D;
		this.goal.position.copy(this.camera.position);

		this.isRemoveGoalOnReach = isRemoveGoalOnReach ?? true;
		this.isActive = isActive ?? true;

	}

	/**
	 * set focus of camera
	 * @param  {object} target    - three js object
	 * @param  {number} distance  - distance from the object
	 * @param  {number} direction - direction to offset distance
	 */
	focus(target, distance, direction) {

		this.isActive = true;
		
		const targetPosition = new THREE.Vector3();
  		target.getWorldPosition(targetPosition);
		
		const offset = direction.clone().normalize().multiplyScalar(distance);

		this.goal.position.copy(targetPosition).add(offset);
		this.goal.updateMatrixWorld();
	}

	/**
	 * update camera position
	 */
	update() {
		if (!this.isActive) return;

		this.temp.setFromMatrixPosition(this.goal.matrixWorld);
		const dist = this.camera.position.distanceTo(this.temp);
		if (dist > 1) {
			this.camera.position.lerp(this.temp, 0.02);
		} else if (dist > 0.1) {
			this.camera.position.lerp(this.temp, 0.03);
		} else {
			this.camera.position.copy(this.temp);
			if (this.isRemoveGoalOnReach) {
				this.isActive = false;
			}
		}
	}

}