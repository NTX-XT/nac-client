import { INWCWorkflowDefinitionDataType } from "./INWCWorkflowDefinitionDataType";
import { INWCWorkflowActionParameterValueData } from "./INWCWorkflowActionParameterValueData";


export interface INWCWorkflowActionParameterValueType {
    type: INWCWorkflowDefinitionDataType;
    data: INWCWorkflowActionParameterValueData;
    validators: any[];
}
