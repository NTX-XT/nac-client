import { ConnectionDependency } from "./connectionDependency";


export interface ContractDependency {
    contractId: string
    contractName: string
    needsResolution: boolean
    connections: { [key: string]: ConnectionDependency; }
}
