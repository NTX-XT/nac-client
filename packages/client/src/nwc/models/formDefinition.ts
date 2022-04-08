/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { formVariable } from './formVariable';

export type formDefinition = {
	id?: string;
	name?: string;
	ruleGroups: Array<any>;
	theme: any;
	pageSettings: any;
	version: number;
	formType: string;
	contract: any;
	variableContext: {
variables: Array<formVariable>;
};
	settings: any;
	rows: Array<any>;
	dataSourceContext: Record<string, {
id: string;
}>;
	submissionConfig: any;
};