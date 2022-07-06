/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { dataType } from './dataType';

export type valueType = {
	type: dataType;
	data: {
value: any;
};
	validators: Array<any>;
};