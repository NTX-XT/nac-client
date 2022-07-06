/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { actionConfiguration } from './actionConfiguration';

export type action = {
	id: string;
	configuration: actionConfiguration;
	className: string;
	renderOptions: {
type: string;
branchMenuCommands: any;
};
	requiredZone: any;
	invalidZone: any;
	requiredZoneErrorMessage: any;
	definesZone: any;
	_metaData?: Array<string>;
	children: Array<action>;
	next: action;
	previous: string;
	parent: string;
};
