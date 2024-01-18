/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { connection } from '../models/connection';
import type { connectionSchema } from '../models/connectionSchema';
import type { connector } from '../models/connector';
import type { contract } from '../models/contract';
import type { datasource } from '../models/datasource';
import type { datasourcePayload } from '../models/datasourcePayload';
import type { exportWorkflowResponse } from '../models/exportWorkflowResponse';
import type { importWorkflowResponse } from '../models/importWorkflowResponse';
import type { permissionItem } from '../models/permissionItem';
import type { saveWorkflowResponse } from '../models/saveWorkflowResponse';
import type { startWorkflowResponse } from '../models/startWorkflowResponse';
import type { tagResponse } from '../models/tagResponse';
import type { tenantConfiguration } from '../models/tenantConfiguration';
import type { tenantInfo } from '../models/tenantInfo';
import type { tokenResponse } from '../models/tokenResponse';
import type { updateWorkflowPayload } from '../models/updateWorkflowPayload';
import type { user } from '../models/user';
import type { workflow } from '../models/workflow';
import type { workflowDesign } from '../models/workflowDesign';
import type { workflowEndpoints } from '../models/workflowEndpoints';
import type { workflowInstance } from '../models/workflowInstance';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
import { Cacheable } from "@type-cacheable/core";
import { ApiError } from "../core/ApiError";
import { getTokenOptions, getTenantConnectorsResponseType, getTenantConnectionsResponseType, getTenantConnectionSchemaResponseType, getDatasourceTokenResponseType, getTenantDatasourcesResponseType, createDatasourcePayload, createConnectionProperties, getWorkflowDesignsResponseType, exportWorkflowOptions, importWorkflowOptions, saveWorkflowPayload, publishWorkflowPayload, scheduleWorkflowPayload, getTenantUsersResponseType, getWorkflowOwnersResponseType, updateWorkflowOwnersPermissions, getWorkflowBusinessOwnersResponseType, updateWorkflowBusinessOwnersBusinessOwners, getConnectionPermissionsResponseType, updateConnectionPermissionsPermissions, getDatasourcePermissionsResponseType, updateDatasourcePermissionsPermissions } from "../models/additionalTypes";

export class DefaultService {

	constructor(public readonly httpRequest: BaseHttpRequest) {}

	private getTokenCancelable(
options: getTokenOptions,
): CancelablePromise<tokenResponse> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/authentication/v1/token',
			body: options,
			errors: {
				400: `Failed`,
			},
		});
	}

	private getTenantConfigurationCancelable(): CancelablePromise<tenantConfiguration> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/designer_/api/uxappconfig/',
		});
	}

	private getTenantInfoCancelable(
tenantId: string,
): CancelablePromise<tenantInfo> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/designer_/api/tenant/{tenantId}',
			path: {
				'tenantId': tenantId,
			},
			errors: {
				400: `Failed`,
			},
		});
	}

	private getTenantTagsCancelable(): CancelablePromise<tagResponse> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/designer_/api/tags',
			errors: {
				400: `Failed`,
			},
		});
	}

	private getTenantConnectorsCancelable(): CancelablePromise<getTenantConnectorsResponseType> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/workflows/v1/connectors',
		});
	}

	private getTenantConnectionsCancelable(): CancelablePromise<getTenantConnectionsResponseType> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/workflows/v1/connections',
		});
	}

	private getTenantConnectionSchemaCancelable(
connectionId: string,
): CancelablePromise<getTenantConnectionSchemaResponseType> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/connection/api/v2/connections/{connectionId}/schema',
			path: {
				'connectionId': connectionId,
			},
		});
	}

	private getDatasourceTokenCancelable(): CancelablePromise<getDatasourceTokenResponseType> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/designer_/datasources/get-datasource-token',
		});
	}

	private getTenantDatasourcesCancelable(): CancelablePromise<getTenantDatasourcesResponseType> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/workflows/v1/datasources',
		});
	}

	private getDatasourceCancelable(
datasourceId: string,
): CancelablePromise<datasource> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/connection/api/datasources/{datasourceId}',
			path: {
				'datasourceId': datasourceId,
			},
		});
	}

	private createDatasourceCancelable(
payload: createDatasourcePayload,
): CancelablePromise<string> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/connection/api/datasources',
			body: payload,
		});
	}

	private getTenantContractsCancelable(
includePublic: boolean = true,
): CancelablePromise<Array<contract>> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/connection/api/contracts',
			query: {
				'includePublic': includePublic,
			},
			errors: {
				400: `Failed`,
			},
		});
	}

	private getTenantContractSchemaCancelable(
contractId: string,
): CancelablePromise<any> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/connection/api/v2/contracts/{contractId}',
			path: {
				'contractId': contractId,
			},
			errors: {
				400: `Failed`,
			},
		});
	}

	private createConnectionCancelable(
appId: string,
properties: createConnectionProperties,
): CancelablePromise<string> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/connection/api/v1/connections',
			query: {
				'appId': appId,
			},
			body: properties,
		});
	}

	private getWorkflowDesignsCancelable(
limit: number = 2000,
): CancelablePromise<getWorkflowDesignsResponseType> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/workflows/v1/designs',
			query: {
				'limit': limit,
			},
		});
	}

	private startWorkflowCancelable(
workflowId: string,
startData?: any,
): CancelablePromise<startWorkflowResponse> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/workflows/v1/designs/{workflowId}/instances',
			path: {
				'workflowId': workflowId,
			},
			body: startData,
		});
	}

	private getWorkflowInstanceCancelable(
instanceId: string,
): CancelablePromise<workflowInstance> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/workflows/v2/instances/{instanceId}',
			path: {
				'instanceId': instanceId,
			},
		});
	}

	private exportWorkflowCancelable(
workflowId: string,
options: exportWorkflowOptions,
): CancelablePromise<exportWorkflowResponse> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/workflows/v1/designs/{workflowId}/published/export',
			path: {
				'workflowId': workflowId,
			},
			body: options,
		});
	}

	private importWorkflowCancelable(
options: importWorkflowOptions,
): CancelablePromise<importWorkflowResponse> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/designer_/api/import',
			body: options,
		});
	}

	private getWorkflowCancelable(
workflowId: string,
): CancelablePromise<workflow> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/designer_/api/workflows/{workflowId}',
			path: {
				'workflowId': workflowId,
			},
		});
	}

	private deleteDraftWorkflowCancelable(
workflowId: string,
): CancelablePromise<any> {
		return this.httpRequest.request({
			method: 'DELETE',
			url: '/designer_/api/workflows/{workflowId}',
			path: {
				'workflowId': workflowId,
			},
		});
	}

	private saveWorkflowCancelable(
workflowId: string,
payload: saveWorkflowPayload,
): CancelablePromise<saveWorkflowResponse> {
		return this.httpRequest.request({
			method: 'PUT',
			url: '/designer_/api/workflows/{workflowId}',
			path: {
				'workflowId': workflowId,
			},
			body: payload,
		});
	}

	private publishWorkflowCancelable(
workflowId: string,
payload: publishWorkflowPayload,
): CancelablePromise<workflow> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/designer_/api/workflows/{workflowId}/published',
			path: {
				'workflowId': workflowId,
			},
			body: payload,
		});
	}

	private deletePublishedWorkflowCancelable(
workflowId: string,
): CancelablePromise<any> {
		return this.httpRequest.request({
			method: 'DELETE',
			url: '/designer_/api/workflows/{workflowId}/published',
			path: {
				'workflowId': workflowId,
			},
		});
	}

	private scheduleWorkflowCancelable(
workflowId: string,
payload: scheduleWorkflowPayload,
): CancelablePromise<workflow> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/designer_/api/workflows/{workflowId}/published/schedule',
			path: {
				'workflowId': workflowId,
			},
			body: payload,
		});
	}

	private getWorkflowEndpointsCancelable(
workflowId: string,
): CancelablePromise<workflowEndpoints> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/designer_/api/v1/workflow/{workflowId}/url',
			path: {
				'workflowId': workflowId,
			},
		});
	}

	private getTenantUsersCancelable(): CancelablePromise<getTenantUsersResponseType> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/designer_/api/users',
		});
	}

	private getWorkflowOwnersCancelable(
workflowId: string,
): CancelablePromise<getWorkflowOwnersResponseType> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/designer_/api/workflows/{workflowId}/permissions',
			path: {
				'workflowId': workflowId,
			},
		});
	}

	private updateWorkflowOwnersCancelable(
workflowId: string,
permissions: updateWorkflowOwnersPermissions,
): CancelablePromise<any> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/designer_/api/workflows/{workflowId}/permissions',
			path: {
				'workflowId': workflowId,
			},
			body: permissions,
		});
	}

	private getWorkflowBusinessOwnersCancelable(
workflowId: string,
): CancelablePromise<getWorkflowBusinessOwnersResponseType> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/designer_/api/workflows/{workflowId}/owners/business',
			path: {
				'workflowId': workflowId,
			},
		});
	}

	private updateWorkflowBusinessOwnersCancelable(
workflowId: string,
businessOwners: updateWorkflowBusinessOwnersBusinessOwners,
): CancelablePromise<any> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/designer_/api/workflows/{workflowId}/owners/business',
			path: {
				'workflowId': workflowId,
			},
			body: businessOwners,
		});
	}

	private getConnectionPermissionsCancelable(
connectionId: string,
): CancelablePromise<getConnectionPermissionsResponseType> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/designer_/api/connections/{connectionId}/permissions',
			path: {
				'connectionId': connectionId,
			},
		});
	}

	private updateConnectionPermissionsCancelable(
connectionId: string,
permissions: updateConnectionPermissionsPermissions,
): CancelablePromise<any> {
		return this.httpRequest.request({
			method: 'POST',
			url: '/designer_/api/connections/{connectionId}/permissions',
			path: {
				'connectionId': connectionId,
			},
			body: permissions,
		});
	}

	private getDatasourcePermissionsCancelable(
datasourceId: string,
): CancelablePromise<getDatasourcePermissionsResponseType> {
		return this.httpRequest.request({
			method: 'GET',
			url: '/connection/api/datasources/{datasourceId}/permissions',
			path: {
				'datasourceId': datasourceId,
			},
		});
	}

	private updateDatasourcePermissionsCancelable(
datasourceId: string,
permissions: updateDatasourcePermissionsPermissions,
): CancelablePromise<any> {
		return this.httpRequest.request({
			method: 'PUT',
			url: '/connection/api/datasources/{datasourceId}/permissions',
			path: {
				'datasourceId': datasourceId,
			},
			body: permissions,
		});
	}

    /**
     * Retrieve authentication token
     * @param options
     * @returns tokenResponse Ok
     * @throws ApiError
     */
    @Cacheable()
    public getToken(options: getTokenOptions): Promise<tokenResponse> {
        return this.getTokenCancelable(options).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
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
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public getTenantConnections(): Promise<getTenantConnectionsResponseType> {
        return this.getTenantConnectionsCancelable().then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get tenant connection schema
     * @param connectionId The connection Id
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public getTenantConnectionSchema(connectionId: string): Promise<getTenantConnectionSchemaResponseType> {
        return this.getTenantConnectionSchemaCancelable(connectionId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
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
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public getTenantDatasources(): Promise<getTenantDatasourcesResponseType> {
        return this.getTenantDatasourcesCancelable().then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get datasource
     * @param datasourceId Datasource Id
     * @returns datasource Ok
     * @throws ApiError
     */
    @Cacheable()
    public getDatasource(datasourceId: string): Promise<datasource> {
        return this.getDatasourceCancelable(datasourceId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Create datasource
     * @param payload Datasource payload
     * @returns string Ok
     * @throws ApiError
     */
    @Cacheable()
    public createDatasource(payload: createDatasourcePayload): Promise<string> {
        return this.createDatasourceCancelable(payload).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
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
     * Get tenant contract schema
     * @param contractId The contract Id
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public getTenantContractSchema(contractId: string): Promise<any> {
        return this.getTenantContractSchemaCancelable(contractId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Create connection
     * @param appId The app id of the contract the connection is using
     * @param properties
     * @returns string Ok
     * @throws ApiError
     */
    @Cacheable()
    public createConnection(appId: string, properties: createConnectionProperties): Promise<string> {
        return this.createConnectionCancelable(appId, properties).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get workflow designs
     * @param limit Total number of workflow designs to retrieve
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public getWorkflowDesigns(limit: number = 2000): Promise<getWorkflowDesignsResponseType> {
        return this.getWorkflowDesignsCancelable(limit).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Start a workflow
     * @param workflowId The workflow id
     * @param startData Start Data
     * @returns startWorkflowResponse Ok
     * @throws ApiError
     */
    @Cacheable()
    public startWorkflow(workflowId: string, startData?: any): Promise<startWorkflowResponse> {
        return this.startWorkflowCancelable(workflowId, startData).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get workflow instance
     * @param instanceId The instance id
     * @returns workflowInstance Ok
     * @throws ApiError
     */
    @Cacheable()
    public getWorkflowInstance(instanceId: string): Promise<workflowInstance> {
        return this.getWorkflowInstanceCancelable(instanceId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Export workflow
     * @param workflowId Id of the workflow design
     * @param options
     * @returns exportWorkflowResponse Ok
     * @throws ApiError
     */
    @Cacheable()
    public exportWorkflow(workflowId: string, options: exportWorkflowOptions): Promise<exportWorkflowResponse> {
        return this.exportWorkflowCancelable(workflowId, options).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Import workflow
     * @param options
     * @returns importWorkflowResponse Ok
     * @throws ApiError
     */
    @Cacheable()
    public importWorkflow(options: importWorkflowOptions): Promise<importWorkflowResponse> {
        return this.importWorkflowCancelable(options).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get workflow
     * @param workflowId Id of the workflow
     * @returns workflow Ok
     * @throws ApiError
     */
    @Cacheable()
    public getWorkflow(workflowId: string): Promise<workflow> {
        return this.getWorkflowCancelable(workflowId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Delete draft workflow
     * @param workflowId Id of the workflow
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public deleteDraftWorkflow(workflowId: string): Promise<any> {
        return this.deleteDraftWorkflowCancelable(workflowId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Save workflow
     * @param workflowId Id of the workflow
     * @param payload
     * @returns saveWorkflowResponse Ok
     * @throws ApiError
     */
    @Cacheable()
    public saveWorkflow(workflowId: string, payload: saveWorkflowPayload): Promise<saveWorkflowResponse> {
        return this.saveWorkflowCancelable(workflowId, payload).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Publish workflow
     * @param workflowId Id of the workflow
     * @param payload
     * @returns workflow Ok
     * @throws ApiError
     */
    @Cacheable()
    public publishWorkflow(workflowId: string, payload: publishWorkflowPayload): Promise<workflow> {
        return this.publishWorkflowCancelable(workflowId, payload).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Delete published workflow
     * @param workflowId Id of the workflow
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public deletePublishedWorkflow(workflowId: string): Promise<any> {
        return this.deletePublishedWorkflowCancelable(workflowId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Schedule workflow
     * @param workflowId Id of the workflow
     * @param payload
     * @returns workflow Ok
     * @throws ApiError
     */
    @Cacheable()
    public scheduleWorkflow(workflowId: string, payload: scheduleWorkflowPayload): Promise<workflow> {
        return this.scheduleWorkflowCancelable(workflowId, payload).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get workflow endpoints
     * @param workflowId Id of the workflow
     * @returns workflowEndpoints Ok
     * @throws ApiError
     */
    @Cacheable()
    public getWorkflowEndpoints(workflowId: string): Promise<workflowEndpoints> {
        return this.getWorkflowEndpointsCancelable(workflowId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get tenant users
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public getTenantUsers(): Promise<getTenantUsersResponseType> {
        return this.getTenantUsersCancelable().then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get workflow owners
     * @param workflowId Id of the workflow
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public getWorkflowOwners(workflowId: string): Promise<getWorkflowOwnersResponseType> {
        return this.getWorkflowOwnersCancelable(workflowId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Update workflow owners
     * @param workflowId Id of the workflow
     * @param permissions
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public updateWorkflowOwners(workflowId: string, permissions: updateWorkflowOwnersPermissions): Promise<any> {
        return this.updateWorkflowOwnersCancelable(workflowId, permissions).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get workflow business owners
     * @param workflowId Id of the workflow
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public getWorkflowBusinessOwners(workflowId: string): Promise<getWorkflowBusinessOwnersResponseType> {
        return this.getWorkflowBusinessOwnersCancelable(workflowId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Update workflow business owners
     * @param workflowId Id of the workflow
     * @param businessOwners
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public updateWorkflowBusinessOwners(workflowId: string, businessOwners: updateWorkflowBusinessOwnersBusinessOwners): Promise<any> {
        return this.updateWorkflowBusinessOwnersCancelable(workflowId, businessOwners).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get connection permissions
     * @param connectionId The connection Id
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public getConnectionPermissions(connectionId: string): Promise<getConnectionPermissionsResponseType> {
        return this.getConnectionPermissionsCancelable(connectionId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Update connection permissions
     * @param connectionId The connection Id
     * @param permissions
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public updateConnectionPermissions(connectionId: string, permissions: updateConnectionPermissionsPermissions): Promise<any> {
        return this.updateConnectionPermissionsCancelable(connectionId, permissions).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Get datasource permissions
     * @param datasourceId The datasource Id
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public getDatasourcePermissions(datasourceId: string): Promise<getDatasourcePermissionsResponseType> {
        return this.getDatasourcePermissionsCancelable(datasourceId).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }

    /**
     * Update datasource permissions
     * @param datasourceId The datasource Id
     * @param permissions
     * @returns any Ok
     * @throws ApiError
     */
    @Cacheable()
    public updateDatasourcePermissions(datasourceId: string, permissions: updateDatasourcePermissionsPermissions): Promise<any> {
        return this.updateDatasourcePermissionsCancelable(datasourceId, permissions).then((response) => Promise.resolve(response)).catch((error: ApiError) => Promise.reject(error))
    }
}
