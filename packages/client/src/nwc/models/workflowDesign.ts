/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { startData } from './startData';
import type { user } from './user';

export type workflowDesign = {
	id?: string;
	name?: string;
	description?: string;
	lastModified?: string;
	author?: user;
	creator?: user;
	created?: string;
	startData?: startData;
};