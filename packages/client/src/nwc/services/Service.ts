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
import { BaseHttpRequest } from '../core/BaseHttpRequest';
import { Cacheable } from "../../cache";
import { ApiError } from "../core/ApiError";
import { getTenantConnectorsResponseType, getDatasourceTokenResponseType, getWorkflowsResponseType, getWorkflowDesignDetailsResponseType, exportWorkflowResponseType, importWorkflowResponseType } from "../models/additionalTypes";

export class Service {
    private httpRequest: BaseHttpRequest;

    constructor(httpRequest: BaseHttpRequest) {
        this.httpRequest = httpRequest;
    }

    private getTokenCancelable(
        request: {
            client_id: string;
            client_secret: string;
            grant_type: 'client_credentials';
        },
    ): CancelablePromise<tokenResponse> {
        return this.httpRequest.request({
            method: 'POST',
            path: `/authentication/v1/token`,
            body: request,
            errors: {
                400: `Failed`,
            },
        });
    }

    private getTenantConfigurationCancelable(): CancelablePromise<tenantConfiguration> {
        return this.httpRequest.request({
            method: 'GET',
            path: `/designer_/api/uxappconfig/`,
        });
    }

    private getTenantInfoCancelable(
        tenantId: string,
    ): CancelablePromise<tenantInfo> {
        return this.httpRequest.request({
            method: 'GET',
            path: `/designer_/api/tenant/${tenantId}`,
            errors: {
                400: `Failed`,
            },
        });
    }

    private getTenantTagsCancelable(): CancelablePromise<tagResponse> {
        return this.httpRequest.request({
            method: 'GET',
            path: `/designer_/api/tags`,
            errors: {
                400: `Failed`,
            },
        });
    }

    private getTenantConnectorsCancelable(): CancelablePromise<getTenantConnectorsResponseType> {
        return this.httpRequest.request({
            method: 'GET',
            path: `/workflows/v1/connectors`,
        });
    }

    private getTenantConnectionsCancelable(): CancelablePromise<Array<connection>> {
        return this.httpRequest.request({
            method: 'GET',
            path: `/designer_/api/connection/api/connections`,
        });
    }

    private getDatasourceTokenCancelable(): CancelablePromise<getDatasourceTokenResponseType> {
        return this.httpRequest.request({
            method: 'GET',
            path: `/designer_/datasources/get-datasource-token`,
        });
    }

    private getTenantDatasourcesCancelable(): CancelablePromise<Array<datasource>> {
        return this.httpRequest.request({
            method: 'GET',
            path: `/connection/api/datasources`,
        });
    }

    private getTenantContractsCancelable(
        includePublic: boolean = true,
    ): CancelablePromise<Array<contract>> {
        return this.httpRequest.request({
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

    private getWorkflowsCancelable(
        limit: number = 2000,
    ): CancelablePromise<getWorkflowsResponseType> {
        return this.httpRequest.request({
            method: 'GET',
            path: `/workflows/v1/designs`,
            query: {
                'limit': limit,
            },
        });
    }

    private getWorkflowDesignDetailsCancelable(
        workflowId: string,
    ): CancelablePromise<getWorkflowDesignDetailsResponseType> {
        return this.httpRequest.request({
            method: 'GET',
            path: `/workflows/v1/designs/${workflowId}`,
        });
    }

    private exportWorkflowCancelable(
        workflowId: string,
        request: {
            isNonExpiring: boolean;
        },
    ): CancelablePromise<exportWorkflowResponseType> {
        return this.httpRequest.request({
            method: 'POST',
            path: `/workflows/v1/designs/${workflowId}/published/export`,
            body: request,
        });
    }

    private importWorkflowCancelable(
        request: {
            name: string;
            key: string;
        },
    ): CancelablePromise<importWorkflowResponseType> {
        return this.httpRequest.request({
            method: 'POST',
            path: `/workflows/v1/designs/import`,
            body: request,
        });
    }

    private getWorkflowSourceCancelable(
        workflowId: string,
    ): CancelablePromise<workflowSource> {
        return this.httpRequest.request({
            method: 'GET',
            path: `/designer_/api/workflows/${workflowId}`,
        });
    }

    private checkWorkflowNameCancelable(
        workflowName: string,
    ): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            path: `/designer_/api/workflows/${workflowName}/checkname`,
        });
    }

    private publishWorkflowCancelable(
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
        return this.httpRequest.request({
            method: 'POST',
            path: `/designer_/api/workflows/${workflowId}/published`,
            body: payload,
        });
    }

    /**
     * Retrieve authenitcation token
     * @param request
     * @returns tokenResponse Ok
     * @throws ApiError
     */
    @Cacheable()
    public getToken(request: {
            client_id: string;
            client_secret: string;
            grant_type: 'client_credentials';
        }): Promise<tokenResponse> {
        return this.getTokenCancelable(request).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get tenant configuration
     * @returns tenantConfiguration Ok
     * @throws ApiError
     */
    @Cacheable()
    public getTenantConfiguration(): Promise<tenantConfiguration> {
        return this.getTenantConfigurationCancelable().then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get tenant info
     * @param tenantId The tenant Id
     * @returns tenantInfo Ok
     * @throws ApiError
     */
    @Cacheable()
    public getTenantInfo(tenantId: string): Promise<tenantInfo> {
        return this.getTenantInfoCancelable(tenantId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get tenant tags
     * @returns tagResponse Ok
     * @throws ApiError
     */
    @Cacheable()
    public getTenantTags(): Promise<tagResponse> {
        return this.getTenantTagsCancelable().then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get tenant connectors
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public getTenantConnectors(): Promise<getTenantConnectorsResponseType> {
        return this.getTenantConnectorsCancelable().then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get tenant connections
     * @returns connection Ok
     * @throws ApiError
     */
    @Cacheable()
    public getTenantConnections(): Promise<Array<connection>> {
        return this.getTenantConnectionsCancelable().then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get datasource token
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public getDatasourceToken(): Promise<getDatasourceTokenResponseType> {
        return this.getDatasourceTokenCancelable().then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get tenant datasources
     * @returns datasource Ok
     * @throws ApiError
     */
    @Cacheable()
    public getTenantDatasources(): Promise<Array<datasource>> {
        return this.getTenantDatasourcesCancelable().then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get tenant contracts
     * @param includePublic Include public contracts
     * @returns contract Ok
     * @throws ApiError
     */
    @Cacheable()
    public getTenantContracts(includePublic: boolean = true): Promise<Array<contract>> {
        return this.getTenantContractsCancelable(includePublic).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get workflows
     * @param limit Total number of workflows to retrieve
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public getWorkflows(limit: number = 2000): Promise<getWorkflowsResponseType> {
        return this.getWorkflowsCancelable(limit).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get workflow design details
     * @param workflowId Id of the workflow design
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public getWorkflowDesignDetails(workflowId: string): Promise<getWorkflowDesignDetailsResponseType> {
        return this.getWorkflowDesignDetailsCancelable(workflowId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Export workflow
     * @param workflowId Id of the workflow design
     * @param request
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public exportWorkflow(workflowId: string, request: {
            isNonExpiring: boolean;
        }): Promise<exportWorkflowResponseType> {
        return this.exportWorkflowCancelable(workflowId, request).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Import workflow
     * @param request
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public importWorkflow(request: {
            name: string;
            key: string;
        }): Promise<importWorkflowResponseType> {
        return this.importWorkflowCancelable(request).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get workflow source
     * @param workflowId Id of the workflow
     * @returns workflowSource Ok
     * @throws ApiError
     */
    @Cacheable()
    public getWorkflowSource(workflowId: string): Promise<workflowSource> {
        return this.getWorkflowSourceCancelable(workflowId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Check if workflow exists
     * @param workflowName Name of the workflow
     * @returns string Ok
     * @throws ApiError
     */
    @Cacheable()
    public checkWorkflowName(workflowName: string): Promise<string> {
        return this.checkWorkflowNameCancelable(workflowName).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Publish workflow
     * @param workflowId Id of the workflow
     * @param payload
     * @returns workflowSource Ok
     * @throws ApiError
     */
    @Cacheable()
    public publishWorkflow(workflowId: string, payload: {
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
        }): Promise<workflowSource> {
        return this.publishWorkflowCancelable(workflowId, payload).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }
}