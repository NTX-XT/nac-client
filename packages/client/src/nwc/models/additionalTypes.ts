/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { connector } from "./connector";
import { workflow } from "./workflow";
import { workflowDesign } from "./workflowDesign";
import { exportWorkflowResponse } from "./exportWorkflowResponse";
import { importWorkflowResponse } from "./importWorkflowResponse";
export type getTenantConnectorsResponseType = {connectors?: Array<connector>;};
export type getDatasourceTokenResponseType = {token?: string;};
export type getWorkflowsResponseType = {workflows?: Array<workflow>;};
export type getWorkflowDesignDetailsResponseType = {workflow?: workflowDesign;};
export type exportWorkflowResponseType = {workflow?: exportWorkflowResponse;};
export type importWorkflowResponseType = {workflow?: importWorkflowResponse;};
