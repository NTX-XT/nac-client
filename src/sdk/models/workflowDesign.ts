import { Tag } from "./tag";
import { Permission } from "./permission";

export interface WorkflowDesign {
    id: string;
    name: string;
    engine?: string;
    tags: Tag[];
    formUrl?: string
    businessOwners: Permission[]
}
