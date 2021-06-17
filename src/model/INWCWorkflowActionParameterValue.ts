import { INWCWorkflowActionParameterVariable } from "./INWCWorkflowActionParameterVariable";
import { INWCWorkflowActionPrimitiveValue } from "./INWCWorkflowActionPrimitiveValue";


export interface INWCWorkflowActionParameterValue {
    primitiveValue: INWCWorkflowActionPrimitiveValue | null;
    variable: INWCWorkflowActionParameterVariable | null;
}
