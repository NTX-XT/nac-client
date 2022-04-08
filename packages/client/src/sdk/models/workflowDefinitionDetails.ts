import { ActionInfo } from "./actionInfo";
import { Connection } from "./connection";
import { UsedConnector } from "./usedConnector";
import { WorkflowDependency } from "./workflowDependency";
import { workflowDefinition } from "../../nwc/models/workflowDefinition";
import { action } from "../../nwc/models/action";


export interface WorkflowDefinitionDetails {
    definition: workflowDefinition;
    actionsArray: action[];
    actionInfos: ActionInfo[];
    actionsDictionary: { [key: string]: action; };
    usedConnectors: { [key: string]: UsedConnector; };
    dependencies: { [key: string]: WorkflowDependency; };
}
