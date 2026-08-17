import './css/staging.scss';

import { Interface, Settings } from '@b/oi';

import { ExamplesPanel } from './examples.js';
import { ParamsPanel } from './params.js';

// import defaultWorkspace from '../workspaces/default.json';

const ui = new Interface({ 
	name: 'tre',
});

ui.addPanel(new ExamplesPanel(ui));
ui.addPanel(new ParamsPanel(ui));

ui.settings.load();
console.log({ ui });