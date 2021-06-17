import { INWCUser } from "./INWCUser";
import { INWCWorkflowPublisedUrls } from "./INWCWorkflowPublisedUrls";
import { INWCWorkflowEventType } from "./INWCWorkflowEventType";



export interface INWCWorkflowPublishInfo {
    id: string;
    author: INWCUser;
    description: string;
    publishedType: string;
    isActive: boolean;
    created: Date;
    lastPublished: Date;
    eventType: INWCWorkflowEventType;
    eventConfiguration: any[];
    urls: INWCWorkflowPublisedUrls;
}
