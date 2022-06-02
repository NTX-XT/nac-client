/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { permissionItem } from './permissionItem';
import type { tag } from './tag';
import type { user } from './user';
import type { workflowStartEvent } from './workflowStartEvent';

export type updateWorkflowPayload = {
	author?: user;
	businessOwners?: Array<permissionItem>;
	datasources: string;
	engineName: string;
	permissions: Array<permissionItem>;
	startEvents?: Array<workflowStartEvent>;
	tags?: Array<tag>;
	version?: number;
	workflowDefinition: string;
	workflowDescription?: string;
	workflowDesignParentVersion?: string;
	workflowName: string;
	workflowType?: string;
	workflowVersionComments?: string;
};