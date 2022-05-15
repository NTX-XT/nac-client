import { ConnectionDependency } from "./connectionDependency";


export interface ContractDependency {
    contractId: string
    connections: { [key: string]: ConnectionDependency; };
}
