/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { xtension } from './xtension';

export type xtensionUsage = {
	xtension: xtension;
	usedByActionIds: Array<string>;
	usedByEventIds: Array<string>;
};
