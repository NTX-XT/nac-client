import { WorkflowInfo } from "..";
import { ActionInfo } from "./actionInfo";
import { UsedConnector } from "./usedConnector";
import { action } from "./workflowDefinition";

export interface WorkflowDependency {
    id: string,
    name: string,
    actions: ActionInfo[];
}

export interface ParsedWorkflowDefinition {
    usedConnectors: { [key: string]: UsedConnector; };
    actionInfos: ActionInfo[];
    actionsArray: action[];
    actionsDictionary: { [key: string]: action; };
    dependencies: {
        [key: string]: WorkflowDependency
    }
}

