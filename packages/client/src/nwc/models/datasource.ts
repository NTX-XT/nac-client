/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type datasource = {
	id: string;
	name: string;
	description?: string;
	contractId: string;
	operationId?: string;
	connectionId: string;
	createdByUserId?: string;
	createdDate?: string;
	modifiedByUserId?: string;
	modifiedDate?: string;
	isInvalid?: boolean;
	isEditable?: boolean;
};