/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { connection } from '../models/connection';
import type { connector } from '../models/connector';
import type { contract } from '../models/contract';
import type { datasource } from '../models/datasource';
import type { exportWorkflowResponse } from '../models/exportWorkflowResponse';
import type { importWorkflowResponse } from '../models/importWorkflowResponse';
import type { tag } from '../models/tag';
import type { tagResponse } from '../models/tagResponse';
import type { tenantConfiguration } from '../models/tenantConfiguration';
import type { tenantInfo } from '../models/tenantInfo';
import type { tokenResponse } from '../models/tokenResponse';
import type { workflow } from '../models/workflow';
import type { workflowDesign } from '../models/workflowDesign';
import type { workflowPermission } from '../models/workflowPermission';
import type { workflowSource } from '../models/workflowSource';
import type { workflowStartEvent } from '../models/workflowStartEvent';
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class ServiceNWC {

    /**
     * Retrieve authenitcation token
     * @param request 
     * @returns tokenResponse Ok
     * @throws ApiError
     */
    public static getToken(
request: {
client_id: string;
client_secret: string;
grant_type: 'client_credentials';
},
): CancelablePromise<tokenResponse> {
        return __request({
            method: 'POST',
            path: `/authentication/v1/token`,
            body: request,
            errors: {
                400: `Failed`,
            },
        });
    }

    /**
     * Get tenant configuration
     * @returns tenantConfiguration Ok
     * @throws ApiError
     */
    public static getTenantConfiguration(): CancelablePromise<tenantConfiguration> {
        return __request({
            method: 'GET',
            path: `/designer_/api/uxappconfig/`,
        });
    }

    /**
     * Get tenant info
     * @param tenantId The tenant Id
     * @returns tenantInfo Ok
     * @throws ApiError
     */
    public static getTenantInfo(
tenantId: string,
): CancelablePromise<tenantInfo> {
        return __request({
            method: 'GET',
            path: `/designer_/api/tenant/${tenantId}`,
            errors: {
                400: `Failed`,
            },
        });
    }

    /**
     * Get tenant tags
     * @returns tagResponse Ok
     * @throws ApiError
     */
    public static getTenantTags(): CancelablePromise<tagResponse> {
        return __request({
            method: 'GET',
            path: `/designer_/api/tags`,
            errors: {
                400: `Failed`,
            },
        });
    }

    /**
     * Get tenant connectors
     * @returns any Ok
     * @throws ApiError
     */
    public static getTenantConnectors(): CancelablePromise<{
connectors?: Array<connector>;
}> {
        return __request({
            method: 'GET',
            path: `/workflows/v1/connectors`,
        });
    }

    /**
     * Get tenant connections
     * @returns connection Ok
     * @throws ApiError
     */
    public static getTenantConnections(): CancelablePromise<Array<connection>> {
        return __request({
            method: 'GET',
            path: `/designer_/api/connection/api/connections`,
        });
    }

    /**
     * Get datasource token
     * @returns any Ok
     * @throws ApiError
     */
    public static getDatasourceToken(): CancelablePromise<{
token?: string;
}> {
        return __request({
            method: 'GET',
            path: `/designer_/datasources/get-datasource-token`,
        });
    }

    /**
     * Get tenant datasources
     * @returns datasource Ok
     * @throws ApiError
     */
    public static getTenantDatasources(): CancelablePromise<Array<datasource>> {
        return __request({
            method: 'GET',
            path: `/connection/api/datasources`,
        });
    }

    /**
     * Get tenant contracts
     * @param includePublic Include public contracts
     * @returns contract Ok
     * @throws ApiError
     */
    public static getTenantContracts(
includePublic: boolean = true,
): CancelablePromise<Array<contract>> {
        return __request({
            method: 'GET',
            path: `/connection/api/datasources/contracts`,
            query: {
                'includePublic': includePublic,
            },
            errors: {
                400: `Failed`,
            },
        });
    }

    /**
     * Get workflows
     * @param limit Total number of workflows to retrieve
     * @returns any Ok
     * @throws ApiError
     */
    public static getWorkflows(
limit: number = 2000,
): CancelablePromise<{
workflows?: Array<workflow>;
}> {
        return __request({
            method: 'GET',
            path: `/workflows/v1/designs`,
            query: {
                'limit': limit,
            },
        });
    }

    /**
     * Get workflow design details
     * @param workflowId Id of the workflow design
     * @returns any Ok
     * @throws ApiError
     */
    public static getWorkflowDesignDetails(
workflowId: string,
): CancelablePromise<{
workflow?: workflowDesign;
}> {
        return __request({
            method: 'GET',
            path: `/workflows/v1/designs/${workflowId}`,
        });
    }

    /**
     * Export workflow
     * @param workflowId Id of the workflow design
     * @param request 
     * @returns any Ok
     * @throws ApiError
     */
    public static exportWorkflow(
workflowId: string,
request: {
isNonExpiring: boolean;
},
): CancelablePromise<{
workflow?: exportWorkflowResponse;
}> {
        return __request({
            method: 'POST',
            path: `/workflows/v1/designs/${workflowId}/published/export`,
            body: request,
        });
    }

    /**
     * Import workflow
     * @param request 
     * @returns any Ok
     * @throws ApiError
     */
    public static importWorkflow(
request: {
name: string;
key: string;
},
): CancelablePromise<{
workflow?: importWorkflowResponse;
}> {
        return __request({
            method: 'POST',
            path: `/workflows/v1/designs/import`,
            body: request,
        });
    }

    /**
     * Get workflow source
     * @param workflowId Id of the workflow
     * @returns workflowSource Ok
     * @throws ApiError
     */
    public static getWorkflowSource(
workflowId: string,
): CancelablePromise<workflowSource> {
        return __request({
            method: 'GET',
            path: `/designer_/api/workflows/${workflowId}`,
        });
    }

    /**
     * Check if workflow exists
     * @param workflowName Name of the workflow
     * @returns string Ok
     * @throws ApiError
     */
    public static checkWorkflowName(
workflowName: string,
): CancelablePromise<string> {
        return __request({
            method: 'GET',
            path: `/designer_/api/workflows/${workflowName}/checkname`,
        });
    }

    /**
     * Publish workflow
     * @param workflowId Id of the workflow
     * @param payload 
     * @returns workflowSource Ok
     * @throws ApiError
     */
    public static publishWorkflow(
workflowId: string,
payload: {
workflowName?: string;
workflowDescription?: string;
workflowType?: string;
workflowDefinition?: string;
startEvents?: Array<workflowStartEvent>;
datasources?: string;
permissions?: Array<workflowPermission>;
workflowVersionComments?: string;
workflowDesignParentVersion?: string;
tags?: Array<tag>;
version?: number;
engineName?: string;
},
): CancelablePromise<workflowSource> {
        return __request({
            method: 'POST',
            path: `/designer_/api/workflows/${workflowId}/published`,
            body: payload,
        });
    }

}