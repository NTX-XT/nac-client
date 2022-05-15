import { workflow } from "../../nwc";
import { ParsedWorkflowDefinition } from "../parsers/parsedWorkflowDefinition";
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
    definition: ParsedWorkflowDefinition;
    _nwcObject: workflow
    // startForm?: FormDefinitionDetails
}
