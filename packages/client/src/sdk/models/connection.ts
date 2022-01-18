import { ConnectionInfo } from "./connectionInfo";
import { Connector } from "./connector";

export interface Connection extends ConnectionInfo {
    connector: Connector
}


