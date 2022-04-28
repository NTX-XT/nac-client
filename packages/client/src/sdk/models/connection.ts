import { ConnectionInfo } from "./connectionInfo";
import { ConnectionSchema } from "./connectionSchema";
import { Contract } from "./contract";

export interface Connection extends ConnectionInfo {
    contract: Contract
    schema: ConnectionSchema
}


