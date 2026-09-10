import * as THREE from 'three';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { random } from '@b/cool';

// default material
export const mat = new THREE.MeshStandardMaterial({ 
	color: 0x3d3d3d,
	side: THREE.DoubleSide,
	// wireframe: true,
});

export const X_AXIS = new THREE.Vector3(1, 0, 0);
export const Y_AXIS = new THREE.Vector3(0, 1, 0);
export const Z_AXIS = new THREE.Vector3(0, 0, 1);

const lineMaterial = new LineMaterial({
	color: 0xffffff,
	linewidth: 3,
});

// https://discourse.threejs.org/t/linematerial-linewidth-affected-by-aspect-ratio/61520/2
// can be resolution w / h, 1 
export function setLineMaterialResolution(w, h) {
	lineMaterial.resolution.set(w, h);
}

// common geometries used for flora and fauna construction

export function addLine(pos, pos2, radius=.08) {
	const geometry = new LineGeometry();
	geometry.setPositions([
		pos.x, pos.y, pos.z,
		pos2.x, pos2.y, pos2.z,
	]);
	const line = new Line2(geometry, lineMaterial);
	line.castShadow = true;
	line.layers.set(1);
	return line;
}

export function addTubeLine(pos, pos2, radius=.08) {
	const line = new THREE.LineCurve3(pos, pos2);
	const tube = new THREE.TubeGeometry(line, 1, radius, 3);
	const mesh = new THREE.Mesh(tube, mat);
	mesh.castShadow = true;
	return mesh;
}

export function addRandomLine(pos, pos2, radius=0.8) {
	const lineFunc = random([addLine, addTubeLine]);
	return lineFunc(pos, pos2, radius);
}