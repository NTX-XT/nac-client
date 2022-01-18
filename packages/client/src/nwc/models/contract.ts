/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type contract = {
    id?: string;
    name?: string;
    description?: string;
    appId?: string;
    createdByUserId?: string;
    timeStamp?: string;
    createdDate?: string;
    icon?: string;
    operations?: Array<{
        operationId?: string;
        name?: string;
        type?: string;
        apps?: Array<string>;
    }>;
    allowedHosts?: Array<string>;
    latestVersion?: string;
    latestScheme?: string;
}
