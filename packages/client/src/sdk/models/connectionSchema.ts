import { ConnectionSchemaProperty } from "./connectionSchemaProperty";


export interface ConnectionSchema {
    title: string;
    description?: string;
    type: string;
    properties: { [key: string]: ConnectionSchemaProperty; };
    required: string[];
}
