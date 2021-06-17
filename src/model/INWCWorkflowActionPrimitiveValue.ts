import { INWCWorkflowActionParameterValue } from "./INWCWorkflowActionParameterValue";
import { INWCWorkflowActionParameterValueType } from "./INWCWorkflowActionParameterValueType";


export interface INWCWorkflowActionPrimitiveValue {
    valueType: INWCWorkflowActionParameterValueType;
    formatValues: INWCWorkflowActionParameterValue[];
}
