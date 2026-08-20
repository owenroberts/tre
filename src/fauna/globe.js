import * as THREE from 'three';
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { choice, random, randInt } from '@b/cool';

/**
 * globe with points for adding scenery and objects
 */
export class Globe {

	constructor(params={}) {

		this.scene = params.scene;
		this.worldRadius = params.worldRadius;

		this.globe = new THREE.Mesh(
			// new THREE.SphereGeometry(worldRadius, 32, 16),
			new THREE.IcosahedronGeometry(this.worldRadius, 3),
			// new THREE.MeshStandardMaterial(),
			new THREE.MeshStandardMaterial({ 
				color: 0x00ffff, 
				// wireframe: true,
			}),
		);

		this.scene.add(this.globe);

		this.globe.castShadow = false;
		this.globe.receiveShadow = true;

		const indexedGlobe = BufferGeometryUtils.mergeVertices(this.globe.geometry);
		this.globePosition = indexedGlobe.getAttribute('position');
		this.globeNormal = indexedGlobe.getAttribute('normal');
		this.segmentLength = this.worldRadius * 4 / Math.sqrt((10 + 2 * Math.sqrt(5)));
	}

	// this should be like globe vertext or globe area or something?
	getGlobeVertex(index) {
		return {
			position: new THREE.Vector3().fromBufferAttribute(this.globePosition, index),
			normal: new THREE.Vector3().fromBufferAttribute(this.globeNormal, index),
			index: index,
		};
	}

	getClosestNeighbors(position, indexes) {
		const neighbors = [];
		if (!indexes) indexes = Array.from(Array(this.globePosition.count).keys());
		const v = new THREE.Vector3();
		for (let i = 0; i < indexes.length; i++) {
			const index = indexes[i];
			v.fromBufferAttribute(this.globePosition, index);
			// console.log(v);
			const d = v.distanceTo(position);
			if (d > 0 && d < this.segmentLength / 3) {
				neighbors.push(this.getGlobeVertex(index));
			}
		}
		return neighbors;
	}

	getNext(position) {
		const neighbors = this.getClosestNeighbors(position);
		const choice = choice(neighbors);
		const indexes = neighbors.filter(n => n.index != choice.index).map(n => n.index);
		const nextDoor = random(this.getClosestNeighbors(choice.position, indexes));
		if (nextDoor && chance(0.5)) {

			const o = new THREE.Object3D();
			o.position.copy(choice.position);
			o.up.copy(choice.normal);
			o.lookAt(nextDoor.position);
			o.translateZ(choice.position.distanceTo(nextDoor.position) / 2);

			const avgNormal = new THREE.Vector3().copy(choice.normal)
				.add(nextDoor.normal)
				.divideScalar(2);

			// addHelper({ position: o.position, normal: avgNormal }, false);
			return { position: o.position, normal: avgNormal };
		}
		return choice;
	}

	getRandomVertex() {
		return this.getGlobeVertex(randInt(this.globePosition.count - 1));
	}

	addHelper(obj, addAxes=true) {
		this.scene.add(new THREE.ArrowHelper(obj.normal, obj.position, 2, 0xff00ff));
		const axesHelper = new THREE.AxesHelper( 5 );
		axesHelper.position.copy(obj.position);
		// axesHelper.lookAt(globe.position);
		// axesHelper.rotation.copy(obj.normal);
		if (addAxes) this.scene.add( axesHelper );
		return { axes: axesHelper };
	}
}