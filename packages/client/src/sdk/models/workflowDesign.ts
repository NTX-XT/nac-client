import { Tag } from "./tag";
import { WorkflowPermissionItem } from "./workflowPermissionItem";

export interface WorkflowDesign {
    id: string;
    name: string;
    engine?: string;
    tags: Tag[];
    formUrl?: string
    businessOwners: WorkflowPermissionItem[]
}
