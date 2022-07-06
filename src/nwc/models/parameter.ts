/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { actionConstraint } from './actionConstraint';
import type { dataType } from './dataType';
import type { formatValue } from './formatValue';
import type { valueType } from './valueType';

export type parameter = {
	name: string;
	label: string;
	description: string;
	required: boolean;
	dataType: dataType;
	constraints: Array<actionConstraint>;
	direction: string;
	properties: any;
	value: {
primitiveValue: {
valueType: valueType;
formatValues: Array<formatValue>;
};
variable: {
valueType: string;
};
};
	placeholder: string;
	valueType?: string;
	hidden?: boolean;
	originalRequired?: boolean;
	helpText?: string;
	designerType?: string;
	dependentOn?: string;
	defaultValue?: any;
	renderData?: any;
};