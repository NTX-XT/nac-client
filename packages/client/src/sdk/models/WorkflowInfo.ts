import { Tag } from "./tag";

export interface WorkflowInfo {
    id: string;
    name: string;
    engine?: string;
    tags: Tag[];
}
