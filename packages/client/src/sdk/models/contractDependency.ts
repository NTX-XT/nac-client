import { ConnectionDependency } from "./connectionDependency";
import { DatasourceDependency } from "./datasourceDependency";


export interface ContractDependency {
    contractName: string
    needsResolution: boolean
    connections: { [key: string]: ConnectionDependency; }
}
