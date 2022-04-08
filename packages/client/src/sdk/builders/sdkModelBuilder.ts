import { Connector } from "../models/connector";
import { connection, connector, contract, datasource, tenantInfo, tenantConfiguration, workflow, tag, workflowSource } from "../../nwc";
import { Connection } from "../models/connection";
import { Contract } from "../models/contract";
import { Datasource } from "../models/datasource";
import { WorkflowInfo } from "../models/workflowInfo";
import { Workflow } from "../models/workflow";
import { Tenant } from "../models/tenant";
import { Tag } from "../models/tag";
import { WorkflowDefinitionParser } from "./parsedWorkflowDefinition";


export class SdkModelBuilder {
    public static Connector = (connector: connector): Connector => ({
        id: connector.id!,
        name: connector.name!,
        enabled: connector.enabled!
    });

    public static Connection = (connection: connection, connectors: Connector[]): Connection => ({
        id: connection.id!,
        name: connection.displayName!,
        isValid: !(connection.isInvalid ?? false),
        connector: connectors.find((connector) => connector.id === connection.contractId!)!
    });

    public static Contract = (contract: contract): Contract => ({
        id: contract.id!,
        name: contract.name!,
        description: contract.description
    });

    public static Datasource = (datasource: datasource, contracts: Contract[], connections: Connection[]): Datasource => ({
        id: datasource.id!,
        name: datasource.name!,
        contract: contracts.find((contract) => contract.id === datasource.contractId!)!,
        connection: (datasource.connectionId === undefined) ? undefined : connections.find((connection) => connection.id === datasource.connectionId!)!,
        operationId: datasource.operationId
    });

    public static Tag = (tag: tag): Tag => ({
        name: tag.name,
        colorIndex: tag.colorIndex,
        count: tag.count
    }
    );

    public static WorkflowInfo = (workflow: workflow): WorkflowInfo => ({
        id: workflow.id!,
        name: workflow.name!,
        engine: workflow.engine,
        tags: workflow.tags!.map((tag) => SdkModelBuilder.Tag(tag))
    });

    public static Tenant = (tenantInfo: tenantInfo, tenantConfiguration: tenantConfiguration, token: string, datasourceToken: string): Tenant => ({
        id: tenantInfo.id!,
        name: tenantInfo.name!,
        apiManagerUrl: tenantConfiguration.apiManagerUrl!,
        serviceRegion: tenantConfiguration.serviceRegion!,
        cloudElementService: tenantConfiguration.cloudElementService!,
        host: tenantConfiguration.apiManagerUrl!.split('//')[1],
        token: token,
        datasourceToken: datasourceToken,
        url: tenantInfo.tenancy_url!
    });

    public static Workflow = (source: workflowSource, connectors: Connector[], connections: Connection[], workflowInfos: WorkflowInfo[]): Workflow => ({
        id: source.workflowId!,
        name: source.workflowName!,
        tags: source.tags!.map((tag) => SdkModelBuilder.Tag(tag)),
        engine: source.engineName,
        eventType: source.eventType,
        isActive: source.isActive === undefined ? false : source.isActive,
        isPublished: source.isPublished === undefined ? false : source.isPublished,
        publishedId: source.publishedId,
        status: source.status,
        version: source.version,
        description: source.workflowDescription,
        designVersion: source.workflowDesignVersion,
        type: source.workflowType,
        comments: source.workflowVersionComments,
        originalSource: source,
        definition: WorkflowDefinitionParser.parse(source.workflowDefinition, connectors, connections, workflowInfos)
    });

}
