/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { action } from './action';
import type { settings } from './settings';
import type { variable } from './variable';
import type { xtensionUsage } from './xtensionUsage';

export type workflowDefinition = {
	state: {
modified: boolean;
};
	settings: settings;
	variables: Array<variable>;
	inUseXtensions: Record<string, xtensionUsage>;
	forms: any;
	formVersions: any;
	actions: action;
};