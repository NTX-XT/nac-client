import { INWCWorlflowActionConstraint } from "./INWCWorlflowActionConstraint";
import { INWCWorkflowActionConfigurationProperty } from "./INWCWorkflowActionConfigurationProperty";
import { INWCWorkflowActionConfigurationServerInfo } from "./INWCWorkflowActionConfigurationServerInfo";
import { INWCWorkflowActionXtensionConfiguration } from "./INWCWorkflowActionXtensionConfiguration";


export interface INWCWorlfowActionConfiguration {
    id: string;
    name: string;
    originalName: string;
    subHeader: null;
    image: any;
    serverInfo: INWCWorkflowActionConfigurationServerInfo;
    properties: INWCWorkflowActionConfigurationProperty[];
    stateConfiguration: null;
    isDisabled: boolean;
    operationId?: string;
    xtensionId?: string;
    xtension?: INWCWorkflowActionXtensionConfiguration;
    actionConstraint?: INWCWorlflowActionConstraint;
    constraints: INWCWorlflowActionConstraint[];
    isHidden?: boolean;
    isHiddenInToolbox?: boolean;
    isPublishable?: boolean;
    isCollapsed?: boolean;
}
