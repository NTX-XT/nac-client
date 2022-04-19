/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { connector } from "./connector";
import { tag } from "./tag";
import { tenantUser } from "./tenantUser";
import { user } from "./user";
import { workflowDesign } from "./workflowDesign";
import { workflowPermission } from "./workflowPermission";
import { workflowStartEvent } from "./workflowStartEvent";

export type getTokenOptions = {
    client_id: string;
    client_secret: string;
    grant_type: 'client_credentials';
    };
export type getTenantConnectorsResponseType = {connectors?: Array<connector>;
    };
export type getDatasourceTokenResponseType = {token?: string;
    };
export type getWorkflowDesignsResponseType = {workflows?: Array<workflowDesign>;
    };
export type exportWorkflowOptions = {
    isNonExpiring: boolean;
    };
export type importWorkflowOptions = {
    name: string;
    key: string;
    overwriteExisting?: boolean;
    };
export type publishWorkflowPayload = {
    author?: user;
    datasources?: string;
    engineName?: string;
    permissions?: Array<workflowPermission>;
    startEvents?: Array<workflowStartEvent>;
    tags?: Array<tag>;
    version?: number;
    workflowDefinition?: string;
    workflowDescription?: string;
    workflowDesignParentVersion?: string;
    workflowName?: string;
    workflowType?: string;
    workflowVersionComments?: string;
    };
export type getTenantUsersResponseType = {users?: Array<tenantUser>;
    };
