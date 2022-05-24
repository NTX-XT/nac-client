import { Tag } from "./tag";
import { User } from "./user";


export interface WorkflowInfo {
    isActive: boolean;
    eventType?: string;
    isPublished: boolean;
    publishedId?: string;
    status?: string;
    version?: number;
    description?: string;
    comments?: string;
    type?: string;
    designVersion?: string;
    engine: string;
    tags: Tag[];
    author: User;
}
