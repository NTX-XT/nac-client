/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { dataType } from './dataType';

export type variable = {
	source: string;
	name: string;
	displayName: string;
	dataType: dataType;
	schema?: any;
	properties?: Array<{
dataType: dataType;
name: string;
rawName: string;
displayName: string;
}>;
	scopeId?: string;
	outputId?: string;
	usedInActions: Array<string>;
	isInUse: boolean;
	isUsedInActions: boolean;
	configuration?: {
description?: string;
defaultValue: string;
};
	output?: boolean;
	initiate?: boolean;
	isHidden?: boolean;
	'x-ntx-flagged': boolean;
};