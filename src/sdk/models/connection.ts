import { connection } from "../../nwc";

export interface Connection {
    id: string;
    name: string;
    isValid: boolean;
    contractId: string
    nwcObject: connection
}


