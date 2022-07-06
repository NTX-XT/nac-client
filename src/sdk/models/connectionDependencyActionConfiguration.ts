import { ActionConfigurationEntry } from "./actionConfigurationEntry";

export interface ActionConfiguration {
    actionId: string
    data: any;
    configuration: ActionConfigurationEntry[];
}
