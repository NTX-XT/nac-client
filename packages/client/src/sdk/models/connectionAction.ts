import { ActionInfo } from "./actionInfo";
import { ConnectionActionConfigurationItem } from "./connectionActionConfigurationItem";

export interface ConnectionAction extends ActionInfo {
    data: any;
    configuration: ConnectionActionConfigurationItem[];
}
