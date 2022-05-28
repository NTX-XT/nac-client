/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { tag } from './tag';
import type { user } from './user';
import type { workflowPermission } from './workflowPermission';
import type { workflowStartEvent } from './workflowStartEvent';

export type updateWorkflowPayload = {
	author?: user;
	businessOwners?: Array<workflowPermission>;
	datasources: string;
	engineName: string;
	permissions: Array<workflowPermission>;
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