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

function getArrowHelper(obj) {
	return new THREE.ArrowHelper(obj.normal, obj.position, 1, 0xff00ff);
}

function getAxesHelper(position, normal) {
	const a = new THREE.AxesHelper(5);
	a.position.copy(position ?? new THREE.Vector3(0, 0, 0));
	if (normal) a.up.copy(normal);
	return a;
}

export { getTestCube, getArrowHelper, getAxesHelper };