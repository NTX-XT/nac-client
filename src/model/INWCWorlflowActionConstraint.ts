import { INWCWorkflowActionConstraintData } from "./INWCWorkflowActionConstraintData";
import { INWCWorkflowDefinitionDataType } from "./INWCWorkflowDefinitionDataType";


export interface INWCWorlflowActionConstraint {
    constraintType: INWCWorkflowDefinitionDataType;
    data: INWCWorkflowActionConstraintData;
}
