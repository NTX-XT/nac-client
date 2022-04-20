import { Connector } from "../models/connector";
import { connection, connector, contract, datasource, tenantInfo, tenantConfiguration, workflow, tag, tenantUser, workflowDesign, permissionItem } from "../../nwc";
import { Connection } from "../models/connection";
import { Contract } from "../models/contract";
import { Datasource } from "../models/datasource";
import { WorkflowDesign } from "../models/workflowDesign";
import { Workflow } from "../models/workflow";
import { Tenant } from "../models/tenant";
import { Tag } from "../models/tag";
import { WorkflowDefinitionParser } from "./parsedWorkflowDefinition";
import { User } from "../models/user";
import { WorkflowPermissionItem } from "../models/workflowPermissionItem";
import { WorkflowPermissions } from "../models/workflowPermissions";


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

    public static WorkflowDesign = (workflowDesign: workflowDesign): WorkflowDesign => ({
        id: workflowDesign.id!,
        name: workflowDesign.name!,
        engine: workflowDesign.engine,
        tags: workflowDesign.tags!.map((tag) => SdkModelBuilder.Tag(tag))
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

    public static WorkflowPermissionItem = (item: permissionItem): WorkflowPermissionItem => ({
        id: item.id,
        name: item.name,
        type: item.type,
        email: item.subtext
    })

    public static WorkflowPermissions = (workflowOwners: permissionItem[], businessOwners: permissionItem[]): WorkflowPermissions => ({
        workflowOwners: workflowOwners.map<WorkflowPermissionItem>((item) => SdkModelBuilder.WorkflowPermissionItem(item)),
        businessOwners: businessOwners.map<WorkflowPermissionItem>((item) => SdkModelBuilder.WorkflowPermissionItem(item))
    })

    public static Workflow = (source: workflow, connectors: Connector[], connections: Connection[], workflowInfos: WorkflowDesign[]): Workflow => ({
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
        _nwcObject: source,
        definition: WorkflowDefinitionParser.parse(source.workflowDefinition, connectors, connections, workflowInfos)
    });

    public static User = (user: tenantUser): User => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        roles: user.roles
    })
}
