import * as THREE from 'three';

/**
 * add some random crap to the scene for testing
 */
export class SceneBuilder {

	constructor(scene) {
		this.scene = scene;
	}

	addCube({ w=1, h=1, d=1, x=0, y=0, z=0, castShadow=true }={}) {
		const geometry = new THREE.BoxGeometry( w, h, d );
		const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(x, y, z);
		cube.castShadow = castShadow;
		this.scene.add( cube );
		return cube;
	}

	addSphere({ s=1, x=0, y=0, z=0, castShadow=true }={}) {
		const geometry = new THREE.SphereGeometry( s, 32, 16 ); 
		const material = new THREE.MeshStandardMaterial( { color: 0xffff00 } ); 
		const sphere = new THREE.Mesh( geometry, material ); 
		sphere.castShadow = castShadow;
		sphere.position.set(x, y ,z);
		this.scene.add( sphere );
		return sphere;
	}

	addTorus({ r=0.5, t=0.25, x=0, y=0, z=0, castShadow=true }={}) {
		const geometry = new THREE.TorusKnotGeometry(r, t, 200, 32);
		const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
		const torus = new THREE.Mesh(geometry, material);
		torus.castShadow = castShadow;
		torus.rotation.y = Math.PI / 4;
		torus.position.set(x, y, z);
		this.scene.add(torus);
		return torus;
	}

	addGround({ w=10, h=10, y=-1, receiveShadow=true }={}) {
		const plane = new THREE.Mesh(
			new THREE.PlaneGeometry(w, h),
			new THREE.MeshStandardMaterial({ color: 0xffffff })
		);
		plane.rotation.x = -Math.PI / 2;
		plane.position.y = y;
		plane.receiveShadow = receiveShadow;
		this.scene.add(plane);
		return plane;
	}

	addLights() {
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.castShadow = true;
		directionalLight.position.set(2, 2, 2);
		directionalLight.shadow.mapSize.width = 2048;
		directionalLight.shadow.mapSize.height = 2048;
		this.scene.add(directionalLight);

		const hemisphereLight = new THREE.HemisphereLight(0x7a3114, 0x48c3ff, 0.5);
		this.scene.add(hemisphereLight);
	}
}