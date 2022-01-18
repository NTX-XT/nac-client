import { Contract } from "./contract";
import { Connection } from "./connection";

export interface Datasource {
    id: string;
    name: string;
    contract: Contract;
    connection?: Connection;
}
