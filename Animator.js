/*
	this should be a Prop/Mod thing maybe?
	animate a value over time ...
	works with joint
*/

import * as Cool from '../cool/cool.js';

export function Animator(params) {

	let value = params.value ?? 0;
	let increment = params.increment ?? 1;
	let func = params.func ?? ((value) => { return value; });

	let counter = 0;
	let count = params.count ?? 0;

	// random range randomizes the increment
	let range = params.randomRange ?? [0, 0];
	let randomize = Math.abs(range[0]) + Math.abs(range[1]) !== 0;

	// clamp range clamps the increment
	let min = params.clampRange ? increment + params.clampRange[0] : 0;
	let max = params.clampRange ? increment + params.clampRange[1] : 1;

	let valueClamp = params.valueClamp ?? false;

	// console.log(value, increment, randomize, range, min, max);

	function update(timeElapsedInSeconds=1, params={}) {
		
		params.isCount = false;
		params.timeElapsedInSeconds = timeElapsedInSeconds;

		if (counter === count) {
			value += increment * timeElapsedInSeconds;
			if (randomize) {
				increment = (increment + Cool.random(...range)).clamp(min, max);
			}
			counter = 0;
			params.isCount = true;
		} else {
			counter++;
		}

		if (valueClamp) {
			value = value.clamp(...valueClamp);
		}
		
		return func(value, params);
	}

	return { update };
}