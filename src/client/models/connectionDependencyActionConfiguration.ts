import { ActionConfigurationEntry } from "./actionConfigurationEntry";

export interface ActionConfiguration {
    actionId: string;
    name: string;
    data: any;
    configuration: ActionConfigurationEntry[];
}
