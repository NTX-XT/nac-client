import { Connector } from "./connector";
import { UsedConnection } from "./usedConnection";


export interface UsedConnector extends Connector {
    connections?: { [key: string]: UsedConnection; };
}
