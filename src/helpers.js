/*
	three js helpers, for debugging, etc
*/

import * as THREE from 'three';

// debug

export function getTestCube(x, y, z, size=0.5) {
	var box = new THREE.Mesh(
		new THREE.BoxGeometry(size, size, size), 
		new THREE.MeshBasicMaterial({ color: "red", wireframe: true })
	);
	box.position.set(x, y, z);
	return box;
}

export function getArrowHelper(obj) {
	return new THREE.ArrowHelper(obj.normal, obj.position, 1, 0xff00ff);
}

export function getAxesHelper(position, normal, size=2) {
	const a = new THREE.AxesHelper(size);
	a.position.copy(position ?? new THREE.Vector3(0, 0, 0));
	if (normal) a.up.copy(normal);
	return a;
}

// default material
export const mat = new THREE.MeshStandardMaterial({ 
	color: 0x3d3d3d,
	side: THREE.DoubleSide,
	// wireframe: true,
});

/**
 * common geometries used for flora and fauna construction
 */

export function addLine(pos, pos2, radius=.08) {
	const line = new THREE.LineCurve3(pos, pos2);
	const tube = new THREE.TubeGeometry(line, 1, radius, 3);
	const mesh = new THREE.Mesh(tube, mat);
	mesh.castShadow = true;
	return mesh;
}