import { SketchExample } from './sketch-example';
import { SceneBuilder } from './scene-builder';
import { Worm } from '../tre';

export class WormExample extends SketchExample {
	constructor(sceneParams) {
		super(sceneParams);

		const builder = new SceneBuilder(this.scene);
		builder.addGround({ y: 0 });
		builder.addLights();

		this.worm = new Worm({ scene: this.scene });
		this.scene.add(this.worm.model);
	}

	render(timeElapsedInSeconds) {
		this.worm.update(timeElapsedInSeconds);
	}
}