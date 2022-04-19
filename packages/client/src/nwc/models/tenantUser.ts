/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type tenantUser = {
	id: string;
	email: string;
	first_name?: string;
	last_name?: string;
	vibranium_enabled?: boolean;
	is_guest?: boolean;
	organization_id?: string;
	legacy_id?: string;
	roles?: Array<string>;
};