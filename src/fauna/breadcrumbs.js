import * as THREE from 'three';
import { random, randInt } from '@b/cool';
import { Animator } from '../tre';
import { mat } from '../utils';

/**
 * adds little shapes following follower
 * kind of specific to four comps / two but might be useful ...
 */
export class Breadcrumbs {

	/**
	 * creates breadcrumbs thing, kind of a particle system i guess
	 * @param  {Scene} options.scene    three js scene
	 * @param  {Object3D} options.target   three js object where crumbs originate from
	 * @param  {object} options.lifetime { min: number, max: number } life time of crumb 
	 */
	constructor({ scene, target, lifetime }) {
		this.target = target;
		this.scene = scene;
		this.crumbs = [];
		this.lifetime = lifetime ?? { min: 10, max: 20 };

		this.animator = new Animator({
			frameCount: 36,
			randomize: true,
			callback: value => {
				this.add();
				for (let i = this.crumbs.length - 1; i >= 0; i--) {
					if (this.crumbs[i].count > this.crumbs[i].lifetime) {
						this.remove(this.crumbs[i]);
						this.crumbs.splice(i, 1);
					}
					this.crumbs[i].count++;
				}
			},
		});
	}

	remove(crumb) {
		this.scene.remove(crumb);
		crumb.geometry.dispose();
		crumb.material.dispose();
		crumb = null;
	}

	add() {
		const geo = new THREE.IcosahedronGeometry(random(0.01, 0.05), 1);
		const crumb = new THREE.Mesh(geo, mat);
		crumb.position.copy(this.target.position);
		crumb.quaternion.copy(this.target.quaternion);
		crumb.translateX(random(-0.8, 0.8));
		crumb.translateZ(random(1));

		crumb.lifetime = randInt(this.lifetime.min, this.lifetime.max);
		crumb.count = 0;

		this.crumbs.push(crumb);
		this.scene.add(crumb);
	}

	update(timeElapsedInSeconds, isActive) {
		if (!isActive) return;
		this.animator.update(timeElapsedInSeconds);
	}
}