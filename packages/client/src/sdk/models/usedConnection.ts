import { Connection } from "./connection";
import { ConnectionAction } from "./connectionAction";


export interface UsedConnection extends Connection {
    actions?: ConnectionAction[];
}
