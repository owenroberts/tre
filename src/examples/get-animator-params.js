import { Easings } from '../animator';

/**
 * get common ui parameters for adjusting an animation
 * @param  {[type]} ui       [description]
 * @param  {[type]} animator [description]
 * @return {[type]}          [description]
 */
export function getAnimatorParams(ui, animator) {
	
	ui.addButton({
		obj: animator,
		ref: 'reset'
	});

	ui.addBreak();

	ui.addRef({
		obj: animator,
		ref: 'duration', 
		min: 0.1, 
		max: 24,
		step: 0.1,
	});

	ui.addRef({
		obj: animator,
		ref: 'easing', 
		options: Easings,
		callback: value => {
			// cast select string value to number
			animator.easing = +value;
		}
	});

	ui.addRef({
		obj: animator,
		ref: 'clamp'
	});

	ui.addRef({
		obj: animator,
		ref: 'loop'
	});

	ui.addRef({
		obj: animator,
		ref: 'mirror'
	});

	ui.addRef({
		obj: animator,
		ref: 'randomize'
	});

	ui.addRef({
		obj: animator,
		ref: 'step', 
		min: 0.0, 
		max: 0.2, 
		step: 0.01
	});

	ui.addRef({
		obj: animator,
		ref: 'frameCount', 
		min: 1, 
		max: 24, 
	});
}