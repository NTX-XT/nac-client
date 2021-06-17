import { INWCUser } from "./INWCUser";

export interface INWCWorkflowDefinitionSettings {
    id: string;
    title: string;
    description: string;
    type: string;
    author: INWCUser;
    _metaData: string[];
    datasources: any;
    overwriteExistingWorkflow: boolean;
    isPublishing: boolean;
    isActive: boolean;
}
