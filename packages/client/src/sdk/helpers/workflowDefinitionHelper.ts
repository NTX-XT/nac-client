import { workflowDefinition } from "../../nwc";

export class WorkflowDefinitionHelper {
    static toObject = (definition: string): workflowDefinition => JSON.parse(definition)
    static toString = (definition: workflowDefinition): string => JSON.stringify(definition)
    static ensureWorkflowId = (definition: workflowDefinition, workflowId: string): void => { definition.settings.id = workflowId }

}