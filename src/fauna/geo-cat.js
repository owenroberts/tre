import * as THREE from 'three';
import { map } from '@b/cool';
import { mat, addLine } from '../utils';
import { Animator, Joint, Easings } from '../tre';

// *** needs some work with resetting but mostly there

const AnimStates = {
	IDLE: 0,
	WALK: 1,
};

export class GeoCat {

	constructor({ scene }) {

		this.model = new THREE.Object3D();
		scene.add(this.model);

		this.state = AnimStates.WALK;

		this.size = 0.5;
		this.body = new Joint();
		this.head = new Joint();
		this.tail = [];
		this.legs = [];
		this.fa = 0.6; // front leg angle
		this.ba = 0.3; // back leg angle, def better way to do this ... 
		this.bodyHeight = this.size * 2.2;
		this.headHeight = this.size * 5;
		this.tailRotateSpeed = 3
		this.legRotateSpeed = 4;	
		this.tailSegNum = 7;

		this.create();

		this.animators = [
			{
				state: AnimStates.IDLE,
				animator: new Animator({
					easing: Easings.SINE_IN_OUT,
					start: -Math.PI / 4,
					end: Math.PI / 4,
					// progress: 0,
					duration: 3,
					randomize: true,
					step: 0.1,
					callback: value => {
						this.head.setRotation({ y: value });
					},
				}),
			},
			{
				state: AnimStates.IDLE,
				animator: new Animator({
					easing: Easings.SINE_OUT,
					start: -Math.PI / 8,
					end: Math.PI / 8,
					randomize: true,
					randomFactor: 0.1,
					step: 0.08,
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
					start: -Math.PI / 8,
					end: Math.PI / 4,
					randomize: true,
					randomFactor: 0.1,
					step: 0.08,
					callback: value => {
						for (let i = 0; i < this.tail.length; i++) {
							this.tail[i].setRotation({ x: value + i * 0.05 });
						}
					},

				})
			},
			{
				state: AnimStates.WALK,
				animator: new Animator({
					duration: 0.5,
					easing: Easings.SINE_IN,
					start: -Math.PI / 2,
					end: Math.PI / 4,
					callback: value => {
						for (let i = 0; i < this.legs.length; i++) {

							const a1 = value + i * Math.PI / 4;
							const a2 = value;

							this.legs[i].joints[0].setRotation({ x: a1 });
							this.legs[i].joints[1].setRotation({ x: a2 });
						}
					},
				}),
			},
			{
				state: AnimStates.WALK,
				animator: new Animator({
					duration: 0.4,
					easing: Easings.SINE_IN,
					randomize: true,
					callback: value => {
						this.body.setPosition({ y: this.bodyHeight + value * 0.25 });
						this.head.setPosition({ y: this.headHeight - value * 0.25 });
					},
				}),
			}
		];
	}

	create() {
		const bodyGeo = new THREE.CapsuleGeometry(this.size, this.size * 2, 2, 5); 
		const bodyMesh = new THREE.Mesh(bodyGeo, mat);
		bodyMesh.castShadow = true;
		this.body.add(bodyMesh);
		this.body.setPosition({ x: 0, y: this.bodyHeight, z: 0 });
		this.body.rotateX(Math.PI * 0.5); 
		this.body.setOrigins();
		this.model.add(this.body.obj);

		const headGeo = new THREE.IcosahedronGeometry(this.size * 1.5, 1);
		const headMesh = new THREE.Mesh(headGeo, mat);
		headMesh.castShadow = true;
		this.head.add(headMesh);
		this.head.setPosition({ x: 0, y: this.headHeight, z: this.size * 2 });
		this.head.setRandomRotations();
		this.head.setOrigins();
		this.model.add(this.head.obj);

		const earGeo = new THREE.ConeGeometry(this.size * 1, this.size * 1, 3);
		const earMesh = new THREE.Mesh(earGeo, mat);
		earMesh.castShadow = true;
		const earLeft = new Joint();
		earLeft.add(earMesh);
		earLeft.addPosition(this.size * -1, this.size * 1.5, 0);
		earLeft.setRandomRotations();
		this.head.add(earLeft.obj);

		const earRight = new Joint();
		earRight.add(earMesh.clone());
		earRight.addPosition(this.size * 1, this.size * 1.5, 0);
		earRight.setRandomRotations();
		this.head.add(earRight.obj);

		for (let i = 0; i < this.tailSegNum; i++) {
			const j = new Joint();
			const h = this.size * 0.6;
			if (i === 0) {
				j.copy(this.body.obj.position);
				j.addPosition(0, this.size * 1.2, -this.size * 1.2);
				j.rotateX(-Math.PI * 0.2);
				this.model.add(j.obj);
			} else {
				j.addPosition(0, h, 0);
				this.tail[i - 1].add(j);
			}
			j.rotateX(i * Math.PI * 0.02);
			const l = addLine(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, h, 0));
			// model.add(l);
			j.add(l);
			j.setOrigins();
			// j.setRotateSpeed(this.tailRotateSpeed);
			this.tail.push(j);
		}

		// legs
		for (let i = 0; i < 4; i++) {
			const j1 = new Joint();
			const j2 = new Joint();
			const h = this.size * 1;
			const a = 0.2;
			const p1 = new THREE.Vector3(0, 0, 0);
			const p2 = new THREE.Vector3(0, -h, 0);

			j1.copy(this.body.getPosition());
			j1.addPosition(0, this.size * -0.5, 0);
			j1.rotateX(Math.PI * a);
			j1.setOrigins();
			// j1.setRotateSpeed(this.legRotateSpeed);
			const l1 = addLine(p1, p2);
			// model.add(l1);
			j1.add(l1);

			j2.setPosition({ x: 0, y: -h, z: 0 });
			j2.rotateX(Math.PI * -a * 2);
			const l2 = addLine(p1, p2);
			// model.add(l2);
			j2.add(l2);
			// j2.setRotateSpeed(this.legRotateSpeed);
			
			this.model.add(j1.obj);
			j1.add(j2);
			this.legs.push({ joints: [j1, j2] });
		}

		const ls = this.size * 0.6;

		this.legs[0].joints[0].addPosition(ls, 0, ls);
		this.legs[2].joints[0].addPosition(ls, 0, -ls);
		this.legs[1].joints[0].addPosition(-ls, 0, ls);
		this.legs[3].joints[0].addPosition(-ls, 0, -ls);

		this.legs[0].joints[0].rotateY(this.fa);
		this.legs[1].joints[0].rotateY(-this.fa);
		this.legs[2].joints[0].rotateY(-this.ba);
		this.legs[3].joints[0].rotateY(this.ba);

		this.legs.forEach(l => l.joints.forEach(j => j.setOrigins()));
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
			this.legs[i].joints[0].unrotate(timeElapsedInSeconds);
			this.legs[i].joints[1].unrotate(timeElapsedInSeconds);
		}

		this.body.unlerp(timeElapsedInSeconds);
	}
}