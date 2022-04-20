import { WorkflowPermissionItem } from "./workflowPermissionItem";

export interface WorkflowPermissions {
    workflowOwners: WorkflowPermissionItem[];
    businessOwners: WorkflowPermissionItem[];
}
