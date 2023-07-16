/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { permissionItem } from './permissionItem';
import type { tag } from './tag';
import type { user } from './user';
import type { workflowStartEvent } from './workflowStartEvent';

export type workflow = {
	workflowId: string;
	isActive: boolean;
	author?: user;
	eventType?: string;
	isPublished: boolean;
	created?: string;
	creator?: user;
	datasources?: string;
	engineName: string;
	eventConfiguration?: string;
	hasPermissions?: boolean;
	isDeleted: boolean;
	lastEdited?: string;
	lastModified?: string;
	lastPublished?: string;
	latestId: string;
	publishedId?: string;
	status: string;
	version: number;
	workflowDescription?: string;
	workflowName: string;
	workflowVersionComments?: string;
	publishAuthor?: user;
	workflowType: string;
	workflowDefinition: string;
	startEvents?: Array<workflowStartEvent>;
	permissions?: Array<permissionItem>;
	workflowDesignVersion?: string;
	isLatest?: boolean;
	publishRequestedBy?: user;
	tags?: Array<tag>;
};
