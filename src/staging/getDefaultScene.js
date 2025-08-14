import * as THREE from 'three';

/**
 * generate some default geometry to use in staging scenes
 */
export function getDefaultScene(scene) {

	const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	const cube = new THREE.Mesh( geometry, material );
	cube.castShadow = true;
	scene.add( cube );
	scene.cube = cube;

	function addSphere() {
		const geometry = new THREE.SphereGeometry( 1, 32, 16 ); 
		const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 
		const sphere = new THREE.Mesh( geometry, material ); 
		sphere.castShadow = true;
		sphere.position.set(2, 0, 0);
		scene.add( sphere );
	}
	addSphere();

	function addTorus() {
		const geometry = new THREE.TorusKnotGeometry(.5, 0.2, 200, 32);
		const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
		const torus = new THREE.Mesh(geometry, material);
		torus.castShadow = true;
		torus.rotation.y = Math.PI / 4;
		torus.position.set(-2, 0, 0);
		scene.add(torus);
	}
	addTorus();

	function addPlane() {
		const plane = new THREE.Mesh(
			new THREE.PlaneGeometry(10, 10),
			new THREE.MeshStandardMaterial({ color: 0xffffff })
		);
		plane.rotation.x = -Math.PI / 2;
		plane.position.y = -1;
		plane.receiveShadow = true;
		scene.add(plane);
	}
	addPlane();

	function addLight() {
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.castShadow = true;
		directionalLight.position.set(2, 2, 2);
		directionalLight.shadow.mapSize.width = 2048;
		directionalLight.shadow.mapSize.height = 2048;
		scene.add(directionalLight);

		const hemisphereLight = new THREE.HemisphereLight(0x7a3114, 0x48c3ff, 0.5);
		scene.add(hemisphereLight);
	}
	addLight();
}