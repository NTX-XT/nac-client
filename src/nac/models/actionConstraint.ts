/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { dataType } from './dataType';

export type actionConstraint = {
	constraintType: dataType;
	data: {
field: string;
filterType?: Array<string>;
choices?: Array<any>;
};
};
