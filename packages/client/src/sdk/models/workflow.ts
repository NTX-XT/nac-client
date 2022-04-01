import { workflowSource } from "client/src/nwc";
import { ParsedFormDefinition } from "./parsedFormDefinition";
import { ParsedWorkflowDefinition } from "./parsedWorkflowDefinition";
import { WorkflowInfo } from "./workflowInfo";
export interface Workflow extends WorkflowInfo {
    isActive: boolean;
    eventType?: string;
    isPublished: boolean;
    publishedId?: string;
    status?: string;
    version?: number;
    description?: string;
    comments?: string;
    type?: string;
    designVersion?: string;
    definition?: ParsedWorkflowDefinition
    startForm?: ParsedFormDefinition
    source: workflowSource
}
