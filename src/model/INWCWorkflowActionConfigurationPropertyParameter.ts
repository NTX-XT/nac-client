import { INWCWorkflowDefinitionDataType } from "./INWCWorkflowDefinitionDataType";
import { INWCWorlflowActionConstraint } from "./INWCWorlflowActionConstraint";
import { INWCWorkflowActionParameterValue} from "./INWCWorkflowActionParameterValue";

export interface INWCWorkflowActionConfigurationPropertyParameter {
    name: string;
    label: string;
    description: string;
    required: boolean;
    dataType: INWCWorkflowDefinitionDataType;
    constraints: INWCWorlflowActionConstraint[];
    direction: string;
    properties: any;
    value: INWCWorkflowActionParameterValue;
    placeholder: string;
    valueType?: string;
    hidden?: boolean;
    originalRequired?: boolean;
    helpText?: string;
    designerType?: string;
    dependentOn?: string;
    defaultValue?: any;
    renderData?: any;
}
