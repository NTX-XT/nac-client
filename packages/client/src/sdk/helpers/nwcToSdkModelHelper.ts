import { connection, contract, datasource, tenantInfo, tenantConfiguration, workflow, tag, tenantUser, workflowDesign, permissionItem, connectionSchema, connectionSchemaProperty } from "../../nwc";
import { Connection } from "../models/connection";
import { Contract } from "../models/contract";
import { Datasource } from "../models/datasource";
import { WorkflowDesign } from "../models/workflowDesign";
import { Workflow } from "../models/workflow";
import { Tenant } from "../models/tenant";
import { Tag } from "../models/tag";
import { User } from "../models/user";
import { WorkflowPermissionItem } from "../models/workflowPermissionItem";
import { WorkflowPermissions } from "../models/workflowPermissions";
import { OpenAPIV2 } from 'openapi-types'
import { ConnectionProperty } from "../models/connectionProperty";
import { ConnectionSchema } from "../models/connectionSchema";
import { ParsedWorkflowDefinition } from "../parsers/parsedWorkflowDefinition";

export class NwcToSdkModelHelper {
    public static Connection = (connection: connection): Connection => ({
        id: connection.id,
        name: connection.displayName,
        isValid: !(connection.isInvalid ?? false),
        contractId: connection.contractId
    })

    public static ConnectionSchema = (schema: connectionSchema): ConnectionSchema => ({
        title: schema.title,
        description: schema.description,
        required: schema.required ?? [],
        type: schema.type,
        properties: Object.assign({}, ...Object.keys(schema.properties).map<{ [key: string]: ConnectionProperty }>((key) => ({
            [key]: {
                title: (schema.properties[key] as connectionSchemaProperty)!.title,
                type: (schema.properties[key] as connectionSchemaProperty)!.type,
                decription: (schema.properties[key] as connectionSchemaProperty)!.description,
                format: (schema.properties[key] as connectionSchemaProperty)!.format,
                value: (schema.properties[key] as connectionSchemaProperty)!.default
            }
        })))
    })

    public static Contract = (contract: contract): Contract => ({
        id: contract.id!,
        name: contract.name!,
        description: contract.description,
        appId: contract.appId
    })

    public static Datasource = (datasource: datasource): Datasource => ({
        id: datasource.id,
        name: datasource.name,
        contractId: datasource.contractId,
        operationId: datasource.operationId,
        connectionId: datasource.connectionId
    })

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
        tags: workflowDesign.tags!.map((tag) => NwcToSdkModelHelper.Tag(tag))
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
        workflowOwners: workflowOwners.map<WorkflowPermissionItem>((item) => NwcToSdkModelHelper.WorkflowPermissionItem(item)),
        businessOwners: businessOwners.map<WorkflowPermissionItem>((item) => NwcToSdkModelHelper.WorkflowPermissionItem(item))
    })

    public static Workflow = (source: workflow): Workflow => ({
        id: source.workflowId!,
        name: source.workflowName!,
        tags: source.tags!.map((tag) => NwcToSdkModelHelper.Tag(tag)),
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
        definition: new ParsedWorkflowDefinition(source.workflowDefinition),
        _nwcObject: source
    }
        // _nwcObject: source,
        // definition: WorkflowDefinitionParser.parse(source.workflowDefinition, contracts, connections, workflowInfos)
    );

    public static User = (user: tenantUser): User => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        roles: user.roles
    })
}