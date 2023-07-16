/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { user } from './user';

export type settings = {
	id: string;
	title: string;
	description: string;
	type: string;
	author: user;
	_metaData: Array<string>;
	datasources: Record<string, {
sources: Array<{
id: string;
}>;
type: string;
}>;
	overwriteExistingWorkflow: boolean;
	isPublishing: boolean;
	isActive: boolean;
	workflowMetaData?: {
lastModified?: string;
lastPublished?: string;
isMigrated?: boolean;
isDeactivatedInO365?: boolean;
workflowName?: string;
workflowDesignVersion?: string;
tags?: Array<string>;
};
};
