/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { workflowDetails } from './workflowDetails';

export type publishedWorkflowDetails = (workflowDetails & {
publishedType: publishedWorkflowDetails.publishedType;
isActive: boolean;
lastPublished?: string;
});

export namespace publishedWorkflowDetails {

	export enum publishedType {
		PRODUCTION = 'Production',
		DEVELOPMENT = 'Development',
	}


}
