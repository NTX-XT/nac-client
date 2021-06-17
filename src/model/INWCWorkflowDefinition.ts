import { INWCWorkflowAction } from "./INWCWorkflowAction";
import { INWCWorkflowActionExtensions } from "./INWCWorkflowActionExtensions";
import { INWCWorkflowDefinitionExtensionUsage } from "./INWCWorkflowDefinitionExtensionUsage";
import { INWCWorkflowDefinitionSettings } from "./INWCWorkflowDefinitionSettings";
import { INWCWorkflowDefinitionState } from "./INWCWorkflowDefinitionState";
import { INWCWorkflowDefinitionVariable } from "./INWCWorkflowDefinitionVariable";


export interface INWCWorkflowDefinition {
    state: INWCWorkflowDefinitionState;
    settings: INWCWorkflowDefinitionSettings;
    variables: INWCWorkflowDefinitionVariable[];
    inUseXtensions: { [key: string]: INWCWorkflowDefinitionExtensionUsage; };
    forms: any;
    formVersions: any;
    actions: INWCWorkflowAction;
}
