import './css/staging.scss';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';

import { Interface, Settings } from '@b/oi';

import { ExamplesPanel } from './panels/examples.js';
import { ParamsPanel } from './panels/params.js';

// import defaultWorkspace from '../workspaces/default.json';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

const ui = new Interface({ 
	name: 'tre',
});

ui.addPanel(new ExamplesPanel(ui, { scene, camera, renderer, controls }));
ui.addPanel(new ParamsPanel(ui, { scene, camera, renderer, controls }));

ui.settings.load();
console.log({ ui });