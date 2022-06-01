import { ActionConfiguration } from "./connectionDependencyActionConfiguration";
import { DatasourceDependency } from "./datasourceDependency";

export interface ConnectionDependency {
    connectionId: string
    connectionName: string
    contractId: string
    needsResolution: boolean
    actions: { [actionId: string]: ActionConfiguration }
    datasources: { [datasourceId: string]: DatasourceDependency }
}
