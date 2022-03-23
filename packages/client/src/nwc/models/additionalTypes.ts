/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { connector, workflow, workflowDesign, user, workflowPermission, workflowStartEvent, tag } from "..";

export type getTokenOptions = {
    client_id: string;
    client_secret: string;
    grant_type: 'client_credentials';
    };
export type getTenantConnectorsResponseType = {connectors?: Array<connector>;
    };
export type getDatasourceTokenResponseType = {token?: string;
    };
export type getWorkflowsResponseType = {workflows?: Array<workflow>;
    };
export type getWorkflowDesignDetailsResponseType = {workflow?: workflowDesign;
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
