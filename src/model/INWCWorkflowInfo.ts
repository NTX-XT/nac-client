import { INWCWorkflowPublishInfo } from "./INWCWorkflowPublishInfo";

export interface INWCWorkflowInfo {
    id: string;
    draft?: any;
    published?: INWCWorkflowPublishInfo;
    lastModified?: Date;
    name: string;
    tags?: any[];
}
