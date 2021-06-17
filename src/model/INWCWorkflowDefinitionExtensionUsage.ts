import { INWCWorkflowDefinitionExtension } from "./INWCWorkflowDefinitionExtension";


export interface INWCWorkflowDefinitionExtensionUsage {
    xtension: INWCWorkflowDefinitionExtension;
    usedByActionIds: string[];
    usedByEventIds: string[];
}
