import { INWCConnectionInfo } from "./INWCConnectionInfo";
import { INWCWorkflowConnectionSchema } from "./INWCWorkflowConnectionSchema";


export interface INWCWorkflowConnectionConfiguration {
    literal: string;
    schema: INWCWorkflowConnectionSchema;
    data: INWCConnectionInfo;
}
