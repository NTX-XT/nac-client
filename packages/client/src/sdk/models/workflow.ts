import { ActionInfo } from "./ActionInfo";
import { Connection } from "./connection";
import { Connector } from "./connector";
import { ParsedWorkflowDefinition } from "./parsedWorkflowDefinition";
import { WorkflowInfo } from "./WorkflowInfo";

export interface ConnectionAction extends ActionInfo {
    data: any
}

export interface UsedConnection extends Connection {
    actions?: ConnectionAction[]
}

export interface UsedConnector extends Connector {
    connections?: { [key: string]: UsedConnection }
}

export interface Workflow extends WorkflowInfo {
    isActive: boolean;
    eventType?: string;
    isPublished: boolean;
    publishedId?: string;
    status?: string;
    version?: number;
    description?: string;
    comments?: string;
    type?: string;
    designVersion?: string;
    definition: ParsedWorkflowDefinition
}
