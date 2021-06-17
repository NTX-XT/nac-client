import { INWCPermission } from "./INWCPermission";
import { INWCUser } from "./INWCUser";
import { INWCWorkflowDefinition } from "./INWCWorkflowDefinition";
import { INWCWorkflowStartEvent } from "./INWCWorkflowStartEvent";

export interface INWCWorkflowSource {
    workflowId:              string;
    isActive:                boolean;
    author:                  INWCUser;
    eventType:               string;
    workflowName:            string;
    workflowDescription:     string;
    isPublished:             boolean;
    created:                 Date;
    creator:                 INWCUser;
    datasources:             string;
    eventConfiguration:      string;
    hasPermissions:          boolean;
    isDeleted:               boolean;
    lastEdited:              Date;
    lastModified:            Date;
    lastPublished:           Date;
    latestId:                string;
    publishedId:             string;
    status:                  string;
    version:                 number;
    workflowVersionComments: string;
    saveAuthor:              INWCUser;
    workflowDefinition:      string;
    startEvents:             INWCWorkflowStartEvent[];
    permissions:             INWCPermission[];
    workflowDesignVersion:   string;
    isLatest:                boolean;
    tags:                    any[];
    workflowDefinitionAsObject?: INWCWorkflowDefinition;
}
