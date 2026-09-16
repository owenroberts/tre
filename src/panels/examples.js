import { UIPanel } from '@b/oi';
import { alphabet } from '@b/cool';

import { PostSketchy } from '../examples/post-sketchy';
import { DoublePostSketchy } from '../examples/double-post-sketchy';
import { SketchyAnimator } from '../examples/sketchy-animator';
import { PostTeddy } from '../examples/post-teddy';
import { PostBandSky } from '../examples/post-band-sky';
import { AnimatorExample } from '../examples/animator-example';
import { JointExample } from '../examples/joint-example';
import { JointAnimatorExample } from '../examples/joint-animator-example';
import { BirdExample } from '../examples/bird-example';
import { BirdFlock } from '../examples/bird-flock-example';
import { GlobeExample } from '../examples/globe-example';
import { FollowerExample } from '../examples/follower-example';
import { GeoCatExample } from '../examples/geo-cat-example';
import { ModelCatExample } from '../examples/model-cat-example';
import { GeoPigExample } from '../examples/geo-pig-example';
import { BreadcrumbsExample } from '../examples/breadcrumbs-example';
import { SceneryExample } from '../examples/scenery-example';
import { ParticlesExample } from '../examples/particles-example';
import { WormExample } from '../examples/worm-example';
import { WormFlockExample } from '../examples/worm-flock-example';
import { SingerExample } from '../examples/singer-example';
import { CameraAnimatorExample } from '../examples/camera-anim-example';

const exampleList = [
	PostSketchy,
	DoublePostSketchy,
	SketchyAnimator,
	PostTeddy,
	PostBandSky,
	AnimatorExample,
	JointExample,
	JointAnimatorExample,
	BirdExample,
	BirdFlock,
	GlobeExample,
	FollowerExample,
	GeoCatExample,
	ModelCatExample,
	GeoPigExample,
	BreadcrumbsExample,
	SceneryExample,
	ParticlesExample,
	WormExample,
	WormFlockExample,
	SingerExample,
	CameraAnimatorExample,
];

export class ExamplesPanel extends UIPanel {
	constructor(ui, threeObjs) {
		super({ id: "examples", ui });

		this.isSceneLoaded = false;
		this.renderer = threeObjs.renderer;
		this.scene = threeObjs.scene;

		this.addRef({
			label: "camera controls",
			ref: "enabled",
			obj: threeObjs.controls,
		});

		this.addBreak();

		for (let i = 0; i < exampleList.length; i++) {
			const ex = exampleList[i];
			this.addButton({
				text: `${alphabet[i]} ~ ${ex.name}`,
				key: alphabet[i],
				callback: () => {
					this.load(ex, threeObjs);
				}
			});
		}
	}

	load(ex, threeObjs) {
		if (this.isSceneLoaded) {
			this.renderer.setAnimationLoop(null);
			this.dispose(this.scene);
			this.renderer.clear();
			this.ui.panels.params.clear();
		}
		const exampleScene = new ex(threeObjs);
		this.renderer.setAnimationLoop(time => {
			exampleScene.animate(time);
		});
		if (exampleScene.setupParams) {
			exampleScene.setupParams(this.ui.panels.params);
		}
		this.isSceneLoaded = true;
	}

	dispose(obj) {
		if (obj === null) return;

		for (let i = obj.children.length - 1; i >= 0; i--) {
			this.dispose(obj.children[i]);
		}

		if (obj.isScene) return;
		this.scene.remove(obj);

		if (obj.geometry) {
			obj.geometry.dispose();
			obj.geometry = undefined;
		}

		if (obj.material) {

			if (obj.material.map) {
				obj.material.map.dispose();
				obj.material.map = undefined;	
			}

			obj.material.dispose();
			obj.material = undefined;
		}

		obj = undefined;
	}
}