/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type permissionItem = {
	id: string;
	name: string;
	type: string;
	email?: string;
	subtext?: string;
	scope?: {
own?: boolean;
use?: boolean;
owner?: boolean;
user?: boolean;
};
};