import { ConnectionProperty } from "./connectionProperty";


export interface ConnectionSchema {
    title: string;
    description?: string;
    type: string;
    properties: { [key: string]: ConnectionProperty; };
    required: string[];
}
