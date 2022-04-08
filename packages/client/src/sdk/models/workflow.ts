import { workflowSource } from "../../nwc";
import { FormDefinitionDetails } from "./formDefinitionDetails";
import { WorkflowDefinitionDetails } from "./workflowDefinitionDetails";
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
    definition: WorkflowDefinitionDetails;
    originalSource: workflowSource
    startForm?: FormDefinitionDetails
}
