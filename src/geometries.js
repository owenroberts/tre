/**
 * common geometries used for flora and fauna construction
 */

import * as THREE from 'three';

// default material
const mat = new THREE.MeshStandardMaterial({ 
	color: 0x3d3d3d,
	side: THREE.DoubleSide,
	// wireframe: true,
});

function addLine(pos, pos2, radius=.08) {
	const line = new THREE.LineCurve3(pos, pos2);
	const tube = new THREE.TubeGeometry(line, 1, radius, 3);
	const mesh = new THREE.Mesh(tube, mat);
	mesh.castShadow = true;
	return mesh;
}

export { addLine };