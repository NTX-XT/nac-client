/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { xtensionInfo } from './xtensionInfo';

export type xtension = {
	swagger: string;
	info: xtensionInfo;
	host: string;
	basePath: string;
	schemes: Array<string>;
	produces: Array<string>;
	paths: any;
	definitions: any;
	parameters: any;
	responses: any;
	securityDefinitions: any;
	security: Array<any>;
	'x-ntx-render-version'?: number;
	'x-ntx-host'?: string;
	'x-ntx-contract-id'?: string;
	'x-ntx-xtension-id'?: string;
	'x-ntx-xtension-app-id'?: string;
};