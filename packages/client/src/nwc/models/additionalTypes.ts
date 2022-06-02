/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { connection } from "./connection";
import { connector } from "./connector";
import { datasource } from "./datasource";
import { datasourcePayload } from "./datasourcePayload";
import { permissionItem } from "./permissionItem";
import { updateWorkflowPayload } from "./updateWorkflowPayload";
import { user } from "./user";
import { workflowDesign } from "./workflowDesign";

export type getTokenOptions = {
    client_id: string;
    client_secret: string;
    grant_type: 'client_credentials';
    };
export type getTenantConnectorsResponseType = {connectors: Array<connector>;
    };
export type getTenantConnectionsResponseType = {connections: Array<connection>;
    };
export type getDatasourceTokenResponseType = {token?: string;
    };
export type getTenantDatasourcesResponseType = {datasources: Array<datasource>;
    };
export type createDatasourcePayload = datasourcePayload;
export type createConnectionProperties = Record<string, string>;
export type getWorkflowDesignsResponseType = {workflows: Array<workflowDesign>;
    };
export type exportWorkflowOptions = {
    isNonExpiring: boolean;
    };
export type importWorkflowOptions = {
    name: string;
    key: string;
    overwriteExisting?: boolean;
    };
export type saveWorkflowPayload = updateWorkflowPayload;
export type publishWorkflowPayload = updateWorkflowPayload;
export type getTenantUsersResponseType = {users: Array<user>;
    };
export type getWorkflowOwnersResponseType = {permissions: Array<permissionItem>;
    };
export type updateWorkflowOwnersPermissions = {
    permissions?: Array<permissionItem>;
    };
export type getWorkflowBusinessOwnersResponseType = {businessOwners: Array<permissionItem>;
    };
export type updateWorkflowBusinessOwnersBusinessOwners = {
    businessOwners?: Array<permissionItem>;
    };
export type getConnectionPermissionsResponseType = {permissions: Array<permissionItem>;
    };
export type updateConnectionPermissionsPermissions = {
    permissions?: Array<permissionItem>;
    };
export type getDatasourcePermissionsResponseType = {permissions?: Array<permissionItem>;
    };
export type updateDatasourcePermissionsPermissions = {
    permissions?: Array<permissionItem>;
    };
