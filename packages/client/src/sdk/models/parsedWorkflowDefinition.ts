import { ActionInfo } from "./ActionInfo";
import { UsedConnector } from "./workflow";
import { action } from "./workflowDefinition";

export interface ParsedWorkflowDefinition {
    usedConnectors: { [key: string]: UsedConnector; };
    actionInfos: ActionInfo[];
    actionsArray: action[];
    actionsDictionary: { [key: string]: action; };
}
