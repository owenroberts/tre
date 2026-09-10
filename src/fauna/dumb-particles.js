import * as THREE from 'three';
import { random, balancedRandom } from '@b/cool';

/**
 * "dumb" because its just one mesh rotating in one direction
 * but gets the vibe right
 * prob randomize rotation a bit
 * all particles are same size ... 
 */
export class Particles {

	constructor({ scene, radius, origin, count=128, size=0.1, randomize=1, speed=0.0001 }) {

		this.speed = speed;

		size = balancedRandom(size, randomize);

		const geo = new THREE.PlaneGeometry(size, size);
		const mat = new THREE.MeshStandardMaterial({
			side: THREE.DoubleSide,
		});
		
		this.mesh = new THREE.InstancedMesh(geo, mat, count);
		// this.mesh.layers.set(1);
		this.mesh.castShadow = false;
		scene.add(this.mesh);

		const dumby = new THREE.Object3D();
		for (let i = 0; i < count; i++) {
			
			const angle = random(Math.PI * 2);
			dumby.position.copy(origin);

			dumby.position.x += Math.sin(random(Math.PI * 2)) * radius;
			dumby.position.y += Math.cos(random(Math.PI * 2)) * radius;
			dumby.position.z += Math.sin(random(Math.PI * 2)) * Math.cos(random(Math.PI * 2)) * radius;

			dumby.rotation.x = random(Math.PI * 2);
			dumby.rotation.y = random(Math.PI * 2);
			dumby.rotation.z = random(Math.PI * 2);
			dumby.updateMatrix();
			this.mesh.setMatrixAt(i, dumby.matrix);
		}

	}

	update() {
		this.mesh.rotation.x += this.speed * random(1);
		this.mesh.rotation.y += this.speed * random(1);
	}
}
