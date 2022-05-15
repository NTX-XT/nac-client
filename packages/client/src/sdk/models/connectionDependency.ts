import { ActionConfiguration } from "./connectionDependencyActionConfiguration";


export interface ConnectionDependency {
    connectionId: string,
    actions: { [actionId: string]: ActionConfiguration };
}
