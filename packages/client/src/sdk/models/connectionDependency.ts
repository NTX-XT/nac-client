import { ActionConfiguration } from "./connectionDependencyActionConfiguration";


export interface ConnectionDependency {
    connectionName: string
    actions: { [actionId: string]: ActionConfiguration }
    datasources: { [datasourceId: string]: string }
}
