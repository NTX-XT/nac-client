import { INWCWorkflowDefinitionDataTypeSchema } from "./INWCWorkflowDefinitionDataTypeSchema";

export interface INWCWorkflowDefinitionDataType {
    name: string;
    version: number;
    subType?: string;
    schema?:  INWCWorkflowDefinitionDataTypeSchema;    
}


