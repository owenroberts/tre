import * as THREE from 'three';

import { Sky } from 'three/addons/objects/Sky.js';

// render stuff
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import { BandShader } from '../post/band-shader.js';

import { getDefaultScene } from './get-default-scene.js';

export class PostBandSky {
	constructor(sceneParams) {

		this.scene = sceneParams.scene;
		this.camera = sceneParams.camera;
		this.renderer = sceneParams.renderer;

		getDefaultScene(this.scene);
		this.debug = false;

		const sky = new Sky();
		const sun = new THREE.Vector3();
		sky.scale.setScalar(10);
		this.scene.add(sky);
		const phi = THREE.MathUtils.degToRad(15);
		const theta = THREE.MathUtils.degToRad(15);
		sun.setFromSphericalCoords( 1, phi, theta );
		sky.material.uniforms['sunPosition'].value.copy(sun);
		sky.material.uniforms['turbidity'].value = 0.5;
		sky.material.uniforms['rayleigh'].value = 0.25;


		const skyPass = new RenderPass(this.scene,this. camera);
		const outputPass = new OutputPass();
		
		this.bandEffect = new ShaderPass(BandShader);
		
		this.composer = new EffectComposer(this.renderer);
		this.composer.renderToScreen = true;
		this.composer.addPass(skyPass);
		// this.composer.addPass(renderPixelatedPass);
		this.composer.addPass(this.bandEffect);
		this.composer.addPass(outputPass);
	}

	animate() {
		if (this.debug) this.renderer.render(this.scene, this.camera);
		else this.composer.render();
		this.scene.cube.rotation.x += 0.01;
		this.scene.cube.rotation.y += 0.01;
	}

	setupParams(panel) {

		panel.addRef({ obj: this, ref: "debug", });

		panel.addRef({
			value: this.bandEffect.uniforms.bandSize.value,
			label: 'bandSize', 
			min: 1, 
			max: 64,
			callback: value => {
				this.bandEffect.uniforms.bandSize.value = value;
			},
		});

		panel.addRef({
			value: this.bandEffect.uniforms.noiseBlend.value,
			label: 'noiseBlend', 
			min: 0.0,
			max: 1.0,
			step: 0.1,
			callback: value => {
				this.bandEffect.uniforms.noiseBlend.value = value;
			},
		});
	}
}

