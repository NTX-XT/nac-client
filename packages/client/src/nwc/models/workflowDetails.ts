/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { eventConfiguration } from './eventConfiguration';
import type { eventType } from './eventType';
import type { urls } from './urls';
import type { user } from './user';

export type workflowDetails = {
	id?: string;
	author?: user;
	description?: string;
	created?: string;
	eventType?: eventType;
	eventConfiguration?: eventConfiguration;
	urls?: urls;
};