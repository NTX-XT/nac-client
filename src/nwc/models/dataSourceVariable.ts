/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { dataSourceVariableMethod } from './dataSourceVariableMethod';

export type dataSourceVariable = {
	dataSourceId: string;
	config: {
schema: {
type: string;
'x-ntx-variables': boolean;
required: Array<string>;
};
value: Record<string, dataSourceVariableMethod>;
};
};