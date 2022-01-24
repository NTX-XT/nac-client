import { ActionInfo } from "./actionInfo";
import { UsedConnector } from "./usedConnector";
import { action } from "./workflowDefinition";

export interface ParsedWorkflowDefinition {
    usedConnectors: { [key: string]: UsedConnector; };
    actionInfos: ActionInfo[];
    actionsArray: action[];
    actionsDictionary: { [key: string]: action; };
}
