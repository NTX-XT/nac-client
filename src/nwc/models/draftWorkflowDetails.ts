/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { workflowDetails } from './workflowDetails';

export type draftWorkflowDetails = (workflowDetails & {
lastModified?: string;
});