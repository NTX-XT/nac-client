/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { dataSourceVariable } from './dataSourceVariable';

export type formVariable = {
	id: string;
	connectedVariableId: string;
	displayName: string;
	dataType: {
type: string;
format: string;
};
	formula?: {
raw: string;
compiled: string;
usedVariableIds: string;
};
	formModes?: Array<number>;
	formScopes?: Array<any>;
	config?: dataSourceVariable;
};