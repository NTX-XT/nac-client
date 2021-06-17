import { INWCPermission } from "./INWCPermission";
import { INWCUser } from "./INWCUser";
import { INWCWorkflowStartEvent } from "./INWCWorkflowStartEvent";


export interface INWCWorkflowPublishPayload {
    workflowName: string;
    workflowDescription: string;
    workflowType: string;
    workflowDefinition: string;
    author: INWCUser;
    startEvents: INWCWorkflowStartEvent[];
    datasources: string;
    permissions: INWCPermission[];
    workflowVersionComments: string;
    workflowDesignParentVersion: string;
    tags: any[];
    version: number;
}
