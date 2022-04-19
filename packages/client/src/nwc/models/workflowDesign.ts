/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { businessOwner } from './businessOwner';
import type { draftWorkflowDetails } from './draftWorkflowDetails';
import type { publishedWorkflowDetails } from './publishedWorkflowDetails';

export type workflowDesign = {
	id: string;
	draft?: draftWorkflowDetails;
	published?: publishedWorkflowDetails;
	lastModified?: string;
	name: string;
	businessOwners?: Array<businessOwner>;
	tags?: Array<any>;
	engine: string;
	publishRequestedBy?: string;
};