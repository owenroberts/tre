import { map, random } from '../../cool/cool.js';

/**
 * easing types, from https://easings.net/
 * https://github.com/ai/easings.net/blob/master/src/easings/easingsFunctions.ts
 * @enum {number}
 */
export const Easings = {
	LINEAR: 0,
	SINE_IN: 1,
	SINE_OUT: 2,
	SINE_IN_OUT: 3,
	CUBIC_IN: 4,
	CUBIC_OUT: 5,
	CUBIC_IN_OUT: 6,
	BACK_IN: 7,
	BACK_OUT: 8,
	BACK_IN_OUT: 9,
	ELASTIC_IN: 10,
	ELASTIC_OUT: 11,
	ELASTIC_IN_OUT: 12,
	BOUNCE_IN: 13,
	BOUNCE_OUT: 14,
	BOUNCE_IN_OUT: 15,
};

const EaseConsts = {
	C1: 1.70158,
	C2: 1.70158 * 1.525,
	C3: 1.70158 + 1,
	C4: (2 * Math.PI) / 3,
	C5: (2 * Math.PI) / 4.5,
};

/**
 * animator class
 * takes start and end value and animates
 * randomize option (clamp?)
 * update in animate, callback fn so anim is described when created
 */
export class Animator {

	/**
	 * creates animator
	 * @param  {number}   options.start=0           - start value
	 * @param  {number}   options.end=1             - end value
	 * @param  {number}   options.duration=1        - in seconds     
	 * @param  {boolean}  options.randomize=false   - change end value, glitchy/jittery effect
	 * @param  {number}   options.randomFactor=0.1  - multiply randomness
	 * @param  {boolean}  options.clamp=true        - clamp value to start/end
	 * @param  {boolean}  options.loop=true         - 
	 * @param  {boolean}  options.mirror=true       - play backwards after first complete
	 * @param  {Easings}  options.easing=LINEAR     - interpolation
	 * @param  {function} options.callback     
	 */
	constructor({ 
		start=0, 
		end=1,
		progress=0, // start mid animation
		duration=1, // in seconds
		randomize=false,
		randomFactor=0.1,
		clamp=true, 
		loop=true,
		mirror=true,
		step=0, // step interpolation on top of whatever, 0 - 1
		frameCount=0, // wait n frames to update anim .. 
		easing=Easings.LINEAR,
		callback 
	}) {

		Object.assign(this, { start, end, progress, duration, randomize, randomFactor, clamp, loop, mirror, easing, step, frameCount, callback });
		
		this.dir = 1; // for mirroring
		this.isDone = false;
		this.setRandoms();
		this.original = {
			start, end, duration
		};

		this.count = 0;
	}

	/**
	 * applies easing to progress 
	 * @return {number} - 0-1 % progress
	 */
	getEasingValue() {
		let x = this.progress / this.duration; // 0 - 1 progress of animation

		if (this.easing === Easings.LINEAR) return x;

		if (this.easing === Easings.SINE_IN) {
			return 1 - Math.cos((x * Math.PI) / 2);
		}

		if (this.easing === Easings.SINE_OUT) {
			return Math.sin((x * Math.PI) / 2);
		}

		if (this.easing === Easings.SINE_IN_OUT) {
			return -(Math.cos(Math.PI * x) - 1) / 2;
		}
		
		if (this.easing === Easings.CUBIC_IN) {
			return x * x * x;
		}

		if (this.easing === Easings.CUBIC_OUT) {
			return 1 - Math.pow(1 - x, 3);
		}

		if (this.easing === Easings.CUBIC_IN_OUT) {
			return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
		}

		if (this.easing === Easings.BACK_IN) {
			return EaseConsts.C3 * x * x * x - EaseConsts.C1 * x * x;
		}

		if (this.easing === Easings.BACK_OUT) {
			return 1 + EaseConsts.C3 * Math.pow(x - 1, 3) + EaseConsts.C1 * Math.pow(x - 1, 2);
		}

		if (this.easing === Easings.BACK_IN_OUT) {
			return x < 0.5
				? (Math.pow(2 * x, 2) * ((EaseConsts.C2 + 1) * 2 * x - EaseConsts.C2)) / 2
				: (Math.pow(2 * x - 2, 2) * ((EaseConsts.C2 + 1) * (x * 2 - 2) + EaseConsts.C2) + 2) / 2;
		}

		if (this.easing === Easings.ELASTIC_IN) {
			return x === 0
				? 0
				: x === 1
				? 1
				: -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * EaseConsts.C4);
		}

		if (this.easing === Easings.ELASTIC_OUT) {
			return x === 0
				? 0
				: x === 1
				? 1
				: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * EaseConsts.C4) + 1;
		}

		if (this.easing === Easings.ELASTIC_IN_OUT) {
			return x === 0
				? 0
				: x === 1
				? 1
				: x < 0.5
				? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * EaseConsts.C5)) / 2
				: (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * EaseConsts.C5)) / 2 + 1;
		}

		if (this.easing === Easings.BOUNCE_IN) {
			return 1 - this.bounceOut(1 - x);
		}

		if (this.easing === Easings.BOUNCE_OUT) {
			return this.bounceOut(x);
		}

		if (this.easing === Easings.BOUNCE_IN_OUT) {
			return x < 0.5
				? (1 - this.bounceOut(1 - 2 * x)) / 2
				: (1 + this.bounceOut(2 * x - 1)) / 2;
		}
	}

	bounceOut(x) {
		const n1 = 7.5625;
		const d1 = 2.75;
		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	}

	setRandoms() {
		let v = Math.abs((this.end - this.start) * this.randomFactor); 
		let d = Math.abs(this.duration * this.randomFactor);
		this.randoms = {
			values: [-v, v],
			duration: [-d, d],
		};
	}

	randomizer() {
		this.start += random(this.randoms.values[0], this.randoms.values[1]);
		this.end += random(this.randoms.values[0], this.randoms.values[1]);
		this.duration += random(this.randoms.duration[0], this.randoms.duration[1]);

		if (this.clamp) {
			if (this.start < this.original.start) {
				this.start = this.original.start;
			}

			if (this.start > this.original.end) {
				this.start = this.original.end;
			}

			if (this.end < this.original.start) {
				this.end = this.original.start;
			}

			if (this.end > this.original.end) {
				this.end = this.original.end;
			}
		}
	}

	/**
	 * update in animation loop
	 * calls callback
	 * @param  {number} timeElapsedInSeconds - delta time from prev frame
	 */
	update(timeElapsedInSeconds) {

		if (this.isDone) return;

		this.progress += timeElapsedInSeconds * this.dir;
		// console.log(this.progress);
		let value = map(this.getEasingValue(), 0, 1, this.start, this.end, this.clamp);

		if (this.progress >= this.duration && this.dir === 1) {
			if (this.mirror) {
				this.dir = -1;
			} else if (this.loop) {
				this.progress = 0;
				if (this.randomize) this.randomizer();
			} else {
				this.isDone = true;
			}
		}

		if (this.progress <= 0 && this.dir === -1) {
			if (this.loop) {
				this.dir = 1;
				this.progress = 0;
				if (this.randomize) this.randomizer();
			} else {
				this.isDone = true;
			}
		}

		if (this.step > 0) {
			value = Math.floor(value / this.step) * this.step;
		}

		if (this.frameCount > 0) {
			this.count++;
			if (this.count < this.frameCount) {
				return; // no callback
			} else {
				this.count = 0;
			}
		}
		// console.log(value)
		this.callback(value);
	}

	/**
	 * set back to 0
	 */
	reset() {
		this.progress = 0;
		this.dir = 1;
		this.isDone = false;
		this.count = 0;
		if (this.randomize) this.randomizer();
	}
}