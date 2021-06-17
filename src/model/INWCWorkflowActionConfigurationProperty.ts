import { INWCWorkflowActionConfigurationPropertyParameter } from "./INWCWorkflowActionConfigurationPropertyParameter";


export interface INWCWorkflowActionConfigurationProperty {
    id: string;
    displayName: string;
    parameters: INWCWorkflowActionConfigurationPropertyParameter[];
}
