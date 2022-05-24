import { workflowDefinition, workflowStartEvent } from "../../nwc";
import { WorkflowDependencies } from "./workflowDependencies";
import { WorkflowForms } from "./workflowForms";
import { WorkflowInfo } from "./workflowInfo";
import { WorkflowPermissions } from "./workflowPermissions";

export interface Workflow {
    id: string,
    name: string
    info: WorkflowInfo,
    forms: WorkflowForms,
    definition: workflowDefinition,
    dependencies: WorkflowDependencies,
    permissions: WorkflowPermissions,
    startEvents?: workflowStartEvent[]
}

