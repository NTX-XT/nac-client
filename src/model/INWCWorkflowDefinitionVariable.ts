import { INWCWorkflowDefinitionDataType } from "./INWCWorkflowDefinitionDataType";
import { INWCWorkflowDefinitionVariableConfiguration } from "./INWCWorkflowDefinitionVariableConfiguration";
import { INWCWorklflowDefinitionVariableProperty } from "./INWCWorklflowDefinitionVariableProperty";


export interface INWCWorkflowDefinitionVariable {
    source: string;
    name: string;
    displayName: string;
    dataType: INWCWorkflowDefinitionDataType;
    schema?: any | null;
    properties?: INWCWorklflowDefinitionVariableProperty[];
    scopeId?: string;
    outputId?: string;
    usedInActions: string[] | { [key: string]: string[]; };
    isInUse: boolean;
    isUsedInActions: boolean;
    configuration?: INWCWorkflowDefinitionVariableConfiguration;
    output?: boolean;
    initiate?: boolean;
    isHidden?: boolean;
    "x-ntx-flagged": boolean;
}
