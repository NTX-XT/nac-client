import { ActionInfo } from "./actionInfo";

export interface WorkflowDependency {
    id: string;
    name: string;
    actions: ActionInfo[];
}
