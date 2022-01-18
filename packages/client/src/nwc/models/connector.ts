/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { actionDefinition } from './actionDefinition';

export type connector = {
    id?: string;
    name?: string;
    enabled?: boolean;
    events?: Array<actionDefinition>;
    actions?: Array<actionDefinition>;
}
