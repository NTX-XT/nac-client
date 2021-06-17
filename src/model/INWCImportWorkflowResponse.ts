import { INWCImportedWorkflowId } from "./INWCImportedWorkflowId";
import { INWCUser } from "./INWCUser";

export interface INWCImportedWorkflowResponse {
    workflowId:          INWCImportedWorkflowId;
    isActive:            boolean;
    author:              INWCUser;
    eventType:           string;
    isPublished:         boolean;
    created:             string;
    isDeleted:           boolean;
    lastModified:        string;
    workflowDescription: string;
    workflowName:        string;
    publishAuthor:       INWCUser;
    publishedId:         string;
    lastPublished:       string;
    workflowType:        string;
    saveAuthor:          INWCUser;
    lastEdited:          string;
    status:              string;
}


