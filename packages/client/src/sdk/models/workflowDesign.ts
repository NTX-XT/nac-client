import { Tag } from "./tag";

export interface WorkflowDesign {
    id: string;
    name: string;
    engine?: string;
    tags: Tag[];
}
