import { ContractDependency } from "./contractDependency";
import { WorkflowDependency } from "./workflowDependency";


export interface WorkflowDependencies {
    contracts: { [key: string]: ContractDependency; };
    workflows: { [key: string]: WorkflowDependency; };
}
