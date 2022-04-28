import { Contract } from "./contract";
import { UsedConnection } from "./usedConnection";


export interface UsedContract extends Contract {
    connections?: { [key: string]: UsedConnection; };
}
