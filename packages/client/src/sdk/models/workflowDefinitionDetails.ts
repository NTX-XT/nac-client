import { ActionInfo } from "./actionInfo";
import { Connection } from "./connection";
import { UsedContract } from "./usedContract";
import { WorkflowDependency } from "./workflowDependency";
import { workflowDefinition } from "../../nwc/models/workflowDefinition";
import { action } from "../../nwc/models/action";


export interface WorkflowDefinitionDetails {
    definition: workflowDefinition;
    actionsArray: action[];
    actionInfos: ActionInfo[];
    actionsDictionary: { [key: string]: action; };
    usedContracts: { [key: string]: UsedContract; };
    dependencies: { [key: string]: WorkflowDependency; };
}
