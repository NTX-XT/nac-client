import { connection } from "../../nac";

export interface Connection {
    id: string;
    name: string;
    isValid: boolean;
    contractId: string
    NACObejct: connection
}


