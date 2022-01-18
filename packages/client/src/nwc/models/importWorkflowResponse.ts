/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { user } from './user';

export type importWorkflowResponse = {
    workflowId?: {
        workflowId?: string;
        workflowDesignVersion?: string;
    };
    isActive?: boolean;
    author?: user;
    eventType?: string;
    isPublished?: boolean;
    created?: string;
    isDeleted?: boolean;
    lastModified?: string;
    workflowDescription?: string;
    workflowName?: string;
    publishAuthor?: user;
    publishedId?: string;
    lastPublished?: string;
    workflowType?: string;
    saveAuthor?: user;
    lastEdited?: string;
    status?: string;
}
