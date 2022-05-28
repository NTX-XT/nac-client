/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { draftWorkflowDetails } from './draftWorkflowDetails';
import type { publishedWorkflowDetails } from './publishedWorkflowDetails';
import type { workflowPermission } from './workflowPermission';

export type workflowDesign = {
	id: string;
	draft?: draftWorkflowDetails;
	published?: publishedWorkflowDetails;
	lastModified?: string;
	name: string;
	businessOwners: Array<workflowPermission>;
	tags?: Array<any>;
	engine: string;
	publishRequestedBy?: string;
};