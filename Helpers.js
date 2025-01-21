/*
	three js helpers, for debugging, etc
*/

import * as THREE from 'three';

// debug

function getTestCube(x, y, z, size=0.5) {
	var box = new THREE.Mesh(
		new THREE.BoxGeometry(size, size, size), 
		new THREE.MeshBasicMaterial({ color: "red", wireframe: true })
	);
	box.position.set(x, y, z);
	return box;
}

function getArrowHelper(pos) {
	return new THREE.ArrowHelper(pos.normal, pos.position, 1, 0xff00ff);
}

function getAxesHelper(pos) {
	const a = new THREE.AxesHelper(5);
	a.position.copy(pos ?? new THREE.Vector3(0, 0, 0));
	return a;
}

export { getTestCube, getArrowHelper, getAxesHelper };