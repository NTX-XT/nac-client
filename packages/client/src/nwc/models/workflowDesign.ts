/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { draftWorkflowDetails } from './draftWorkflowDetails';
import type { permissionItem } from './permissionItem';
import type { publishedWorkflowDetails } from './publishedWorkflowDetails';

export type workflowDesign = {
	id: string;
	draft?: draftWorkflowDetails;
	published?: publishedWorkflowDetails;
	lastModified?: string;
	name: string;
	businessOwners: Array<permissionItem>;
	tags?: Array<any>;
	engine: string;
	publishRequestedBy?: string;
};