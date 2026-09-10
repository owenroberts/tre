import * as THREE from 'three';
import { map, random } from '@b/cool';
import { mat, addLine } from '../utils';
import { Animator, Joint, Easings } from '../tre';

// *** needs some work with resetting but mostly there

const AnimStates = {
	IDLE: 0,
	WALK: 1,
};

export class GeoPig {

	constructor({ scene }) {

		this.model = new THREE.Object3D();
		scene.add(this.model);

		this.state = AnimStates.IDLE;

		this.size = 0.75;
		this.tailSegNum = 20;
		this.bodyHeight = this.size * 1.75;
		this.body = new Joint();
		this.head = new Joint();
		this.tail = [];
		this.legs = [];
		
		this.create();

		this.animators = [
			{
				state: AnimStates.IDLE,
				animator: new Animator({
					easing: Easings.SINE_IN_OUT,
					start: -0.5,
					end: 0.5,
					step: 0.2,
					callback: value => {
						this.head.setRotation({ z: value });
					},
				}),
			},
			{
				state: AnimStates.IDLE,
				animator: new Animator({
					easing: Easings.SINE_IN_OUT,
					start: 0.1,
					end: 0.5,
					// step: 0.01,
					frameCount: 8,
					callback: value => {
						for (let i = 0; i < this.tail.length; i++) {
							this.tail[i].setRotation({ z: value + i * 0.05 * Math.sign(value) });
						}
					},
				}),
			},
			{
				state: AnimStates.WALK,
				animator: new Animator({
					easing: Easings.SINE_OUT,
					start: -0.1,
					end: 0,
					callback: value => {
						for (let i = 0; i < this.tail.length; i++) {
							this.tail[i].setRotation({ x: value + i * 0.05 * Math.sign(value) });
						}
					},

				}),
			},
			{
				state: AnimStates.WALK,
				animator: new Animator({
					duration: 0.125,
					easing: Easings.SINE_IN,
					start: -0.25,
					end: 0.25,
					callback: value => {
						for (let i = 0; i < this.legs.length; i++) {
							let offset = (i === 1 || i === 2) ? 1 : -1;
							this.legs[i].joint.setRotation({ x: value * offset  });
						}
					},
				}),
			},
			{
				state: AnimStates.WALK,
				animator: new Animator({
					duration: 0.5,
					easing: Easings.SINE_IN,
					start: -0.25,
					end: 0.25,
					callback: value => {
						this.body.setPosition({ y: this.bodyHeight + value * 0.25 });
						this.head.setPosition({ y: this.bodyHeight - value * 0.125 });
					},
				}),
			},
		];
	}

	create() {

		const bodyGeo = new THREE.CylinderGeometry(this.size, this.size * 0.75, this.size * 3, 5);
		const bodyMesh = new THREE.Mesh(bodyGeo, mat);
		this.body.add(bodyMesh);
		bodyMesh.castShadow = true;
		this.body.setPosition({ x: 0, y: this.bodyHeight, z: -this.size });
		this.body.rotateX(Math.PI * 0.5);
		this.body.setOrigins();
		this.model.add(this.body.obj);

		const headGeo = new THREE.CylinderGeometry(this.size * 0.75, this.size * 0.5, this.size, 5);
		const headMesh = new THREE.Mesh(headGeo, mat);
		headMesh.castShadow = true;
		this.head.add(headMesh);
		this.head.setPosition({ x: 0, y: this.bodyHeight, z: this.size * 1.5 });
		this.head.rotateX(Math.PI * -0.5);
		this.head.rotateZ(random(-Math.PI * 0.125, Math.PI * 0.125));
		this.head.rotateY(random(-Math.PI * 0.125, Math.PI * 0.125));
		this.head.setOrigins();
		this.model.add(this.head.obj);

		const noseGeo = new THREE.IcosahedronGeometry(this.size * 0.125, 0);
		const noseMesh = new THREE.Mesh(noseGeo, mat);
		noseMesh.castShadow = true;
		const noseLeft = new Joint();
		noseLeft.add(noseMesh);
		noseLeft.setRandomRotations();
		noseLeft.addPosition(random(0.125, 0.25), -this.size * 0.5, random(-0.25, 0.25));
		this.head.add(noseLeft.obj);

		const noseRight = new Joint();
		noseRight.add(noseMesh.clone());
		noseRight.setRandomRotations();
		noseRight.addPosition(random(0.125, 0.25) * -1, -this.size * 0.5, random(-0.25, 0.25));
		this.head.add(noseRight.obj);

		const earGeo = new THREE.ConeGeometry(this.size * 0.4, this.size * 0.4, 3);
		const earMesh = new THREE.Mesh(earGeo, mat);
		earMesh.castShadow = true;
		const earLeft = new Joint();
		earLeft.add(earMesh);
		earLeft.rotateZ(random(Math.PI * -0.25, Math.PI * 0.25));
		earLeft.rotateX(random(Math.PI * -0.25, Math.PI * 0.25));
		earLeft.addPosition(this.size * 0.5, 0, this.size * 0.5);
		this.head.add(earLeft.obj);

		const earRight = new Joint();
		earRight.add(earMesh.clone());
		earRight.rotateZ(random(Math.PI * -0.25, Math.PI * 0.25));
		earRight.rotateX(random(Math.PI * -0.25, Math.PI * 0.25));
		earRight.addPosition(this.size * -0.5, 0, this.size * 0.5);
		this.head.add(earRight.obj);

		for (let i = 0; i < this.tailSegNum; i++) {
			const j = new Joint();
			const h = this.size * 0.1;
			if (i === 0) {
				j.copy(this.body.getPosition());
				j.addPosition(0, this.size * 0.75, -this.size * 1.2);
				j.rotateX(-Math.PI * 0.005);
				j.rotateY(-Math.PI * 0.05);
				this.model.add(j.obj);
			} else {
				j.addPosition(0, h, 0);
				this.tail[i - 1].add(j);
			}
			j.rotateX(i * Math.PI * 0.01);
			j.rotateZ(i * Math.PI * 0.02);
			const l = addLine(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, h, 0), .04);
			j.add(l);
			j.setOrigins();
			this.tail.push(j);
		}

		// legs
		for (let i = 0; i < 4; i++) {
			const j1 = new Joint();
			const j2 = new Joint();
			const h = this.size * 1;
			const p1 = new THREE.Vector3(0, 0, 0);
			const p2 = new THREE.Vector3(0, -h, 0);
			const p3 = new THREE.Vector3(0, -h * 0.25, 0);

			j1.copy(this.body.getPosition());
			j1.addPosition(0, this.size * -0.5, 0);
			j1.setOrigins();
			const l1 = addLine(p1, p2);
			j1.add(l1);

			j2.setPosition({ x: 0, y: -h, z: 0 });
			j2.rotateX(Math.PI * -0.5);
			
			const l2 = addLine(p1, p3);
			j2.add(l2);
			
			this.model.add(j1.obj);
			j1.add(j2);
			this.legs.push({ joint: j1, phase: i * 2 });
		}
		
		const ls = this.size * 0.6;

		this.legs[0].joint.addPosition(ls, 0, ls);
		this.legs[1].joint.addPosition(-ls, 0, ls);
		this.legs[2].joint.addPosition(ls, 0, -ls);
		this.legs[3].joint.addPosition(-ls, 0, -ls);

		this.legs.forEach(l => l.joint.setOrigins());
	}

	update(timeElapsedInSeconds, isWalking) {

		const animState = isWalking ? AnimStates.WALK : AnimStates.IDLE;

		if (animState !== AnimStates.WALK && !this.body.isAtOrigin()) {
			this.reset(timeElapsedInSeconds);
			return;
		}

		for (let i = 0; i < this.animators.length; i++) {
			if (this.animators[i].state !== animState) continue;
			this.animators[i].animator.update(timeElapsedInSeconds);
		}
	}

	reset(timeElapsedInSeconds) {
		for (let i = 1; i < this.tail.length; i++) {
			this.tail[i].unrotate(timeElapsedInSeconds);
		}

		for (let i = 0; i < this.legs.length; i++) {
			this.legs[i].joint.unrotate(timeElapsedInSeconds);
		}

		this.body.unlerp(timeElapsedInSeconds);
		this.head.unlerp(timeElapsedInSeconds);
	}
}