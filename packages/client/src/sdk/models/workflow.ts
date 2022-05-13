import { workflow } from "../../nwc";
import { FormDefinitionDetails } from "./formDefinitionDetails";
import { WorkflowDefinitionDetails } from "./workflowDefinitionDetails";
import { WorkflowDesign } from "./workflowDesign";
export interface Workflow extends WorkflowDesign {
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
    // definition: WorkflowDefinitionDetails;
    _nwcObject: workflow
    // startForm?: FormDefinitionDetails
}
