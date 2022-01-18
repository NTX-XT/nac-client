
import { Nwc } from './../nwc'
import { OpenAPIV2 } from 'openapi-types'
import { Connector } from "./models/connector"
import { ClientCredentials } from "./models/clientCredentials"
import { Tenant } from './models/tenant'
import { UsedConnection, UsedConnector, Workflow } from './models/workflow'
import { action, parameter, workflowDefinition } from './models/workflowDefinition'
import { Contract } from './models/contract'
import { WorkflowInfo } from './models/WorkflowInfo'
import { ActionInfo } from './models/ActionInfo'
import { Connection } from './models/connection';
import { Datasource } from './models/datasource';
import cacheManager, { Cacheable } from '../cache'

export interface WorkflowsQueryOptions {
    tag?: string,
    name?: string,
    matchNameAsPattern?: boolean
}

export class Sdk {
    private _tenant: Tenant
    private _nwc: Nwc

    public get tenant(): Tenant {
        return this._tenant
    }

    private constructor(tenant: Tenant) {
        this._tenant = tenant
        this._nwc = new Nwc({
            CREDENTIALS: "include",
            BASE: tenant.apiManagerUrl,
            HEADERS: () => {
                return Promise.resolve({
                    "Host": this._tenant.host
                })
            },
            TOKEN: (options) => {
                return Promise.resolve<string>(options.path.includes('datasources') ? this._tenant.datasourceToken! : this._tenant.token)
            }
        })
    }

    private async cacheObjects() {
        await this.getConnectors()
        await this.getConnections()
        await this.getContracts()
        await this.getDatasources()
        await this.getTags()
    }

    public static async connect(clientCredentials: ClientCredentials): Promise<Sdk> {
        const temporaryClient = new Nwc()
        const tokenRequestResult = await temporaryClient.getToken({ client_id: clientCredentials.clientId, client_secret: clientCredentials.clientSecret, grant_type: "client_credentials" })
        temporaryClient.request.openApiConfig.TOKEN = tokenRequestResult.access_token!
        const tenantConfigurationRequestResult = await temporaryClient.getTenantConfiguration();
        temporaryClient.request.openApiConfig.BASE = tenantConfigurationRequestResult.apiManagerUrl!
        const tenantInfoRequestResponse = await temporaryClient.getTenantInfo(tenantConfigurationRequestResult.user!.tenantId!)
        const dataSourceTokenRequestResult = await temporaryClient.getDatasourceToken()
        const tenant: Tenant = {
            id: tenantInfoRequestResponse.id!,
            name: tenantInfoRequestResponse.name!,
            apiManagerUrl: tenantConfigurationRequestResult.apiManagerUrl!,
            serviceRegion: tenantConfigurationRequestResult.serviceRegion!,
            cloudElementService: tenantConfigurationRequestResult.cloudElementService!,
            host: tenantConfigurationRequestResult.apiManagerUrl!.split('//')[1],
            token: tokenRequestResult.access_token!,
            datasourceToken: dataSourceTokenRequestResult.token!,
            url: tenantInfoRequestResponse.tenancy_url!
        }
        const service = new Sdk(tenant)
        await service.cacheObjects()
        return service
    }

    @Cacheable()
    public async getTags(): Promise<string[]> {
        return (await this._nwc.getTenantTags()).resource!.map<string>((tag) => tag.name!)
    }

    @Cacheable()
    public async getWorkflowInfos(options: WorkflowsQueryOptions = {}): Promise<WorkflowInfo[]> {
        let workflowInfos = (await this._nwc.getWorkflows(2000)).workflows!.map<WorkflowInfo>((wfl) => ({
            id: wfl.id!,
            name: wfl.name!,
            engine: wfl.engine,
            tags: wfl.tags!.map((tag: { name: string }) => (tag.name!))
        }))
        if (options.tag) {
            workflowInfos = workflowInfos.filter((wfl) => {
                const matchedTags = wfl.tags!.filter((tag) => (tag === options.tag))
                return (matchedTags && matchedTags.length > 0)
            })
        }
        if (options.name) {
            workflowInfos = workflowInfos.filter((wfl) => (options.matchNameAsPattern === true ? wfl.name!.includes(options.name!) : wfl.name! === options.name))
        }
        return workflowInfos
    }

    @Cacheable()
    public async getWorkflow(workflowId: string): Promise<Workflow> {
        const info = (await this.getWorkflowInfos()).find((wfl) => (wfl.id === workflowId))!
        const source = (await this._nwc.getWorkflowSource(workflowId))!
        const definition = JSON.parse(source.workflowDefinition!) as workflowDefinition
        const _actions = Sdk.actionsToFlatArray(definition.actions)
        const actions = _actions.map<ActionInfo>((a) => ({ id: a.id, name: a.configuration.name }))
        const workflow: Workflow = {
            id: info.id,
            name: info.name,
            tags: info.tags,
            engine: info.engine,
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
            actions: Sdk.arrayToDictionary(actions, "id")
        }

        const usedConnectors = Sdk.arrayToDictionary(
            await Promise.all<UsedConnector>(
                Object.keys(definition.inUseXtensions).map<Promise<UsedConnector>>(
                    async (connectorId) => (
                        (await this.getConnectors()).find((cn) => (
                            cn.id === connectorId)
                        )!
                    )
                )
            ), "id")

        const actionsDic = Sdk.arrayToDictionary(_actions, "id")
        for (const connectorId of Object.keys(definition.inUseXtensions)) {
            for (const actionId of definition.inUseXtensions[connectorId].usedByActionIds) {
                const connection = await this.getActionConnection(actionsDic[actionId])
                const operationId = actionsDic[actionId].configuration.xtension!.operationId
                const document: OpenAPIV2.Document = definition.inUseXtensions[connectorId].xtension
                const operation: OpenAPIV2.OperationObject = (this.findOperation(document.paths, operationId)!)
                const values = this.getActionXtensionParameterValue(this.getActionXtensionInputParameter(actionsDic[actionId]))
                const valuesDictionary: { [key: string]: { parameter: OpenAPIV2.Parameter, value: any } } = {}
                for (const p of operation.parameters!) {
                    const parameter: OpenAPIV2.Parameter = p as OpenAPIV2.Parameter
                    const key = `${operation.operationId}.${parameter.in}.${parameter.name}`
                    valuesDictionary[key] = {
                        parameter: parameter,
                        value: values[key]
                    }
                }
                if (connection) {
                    const connectionId = connection.id
                    if (usedConnectors[connectorId].connections === undefined) {
                        usedConnectors[connectorId].connections = {}
                    }
                    usedConnectors[connectorId].connections![connectionId] = connection
                }
            }
        }
        workflow.connections = usedConnectors

        // 
        // const connections = (await Promise.all(Object.keys(definition.inUseXtensions).map<Promise<(Connection | undefined)[]>>(async (connectorId) => {
        //     return await Promise.all(definition.inUseXtensions[connectorId].usedByActionIds.map<Promise<Connection | undefined>>(async (actionId) => {
        //         return await this.getActionConnection(actionsDic[actionId])
        //     }))
        // }))).reduce((accumulator, value) => accumulator.concat(value), [])
        // for (const connectorId of Object.keys(definition.inUseXtensions)) {
        //     for (const actionId of definition.inUseXtensions[connectorId].usedByActionIds) {
        //         const connection = this.getActionConnection(actionsDic[actionId])
        //     }
        // }
        // console.log(connections)
        return workflow
    }

    private findOperation(paths: OpenAPIV2.PathsObject, operationId: string): OpenAPIV2.OperationObject | undefined {
        for (const key of Object.keys(paths)) {
            for (const verb of Object.keys(OpenAPIV2.HttpMethods).map(key => OpenAPIV2.HttpMethods[key])) {
                if (paths[key][verb] && paths[key][verb].operationId === operationId) {
                    return paths[key][verb]
                }
            }
        }
        return undefined
    }

    private getActionXtensionInputParameter(action: action): parameter | undefined {
        return action.configuration.properties.find(
            (p) => (p.displayName.startsWith('xtension:')))?.parameters?.find(
                (parameter) => parameter.name === "['X_NTX_XTENSION_INPUT']")
    }

    private getActionXtensionParameterValue(parameter: parameter | undefined): any | undefined {
        return parameter?.value.primitiveValue?.valueType.data.value.value
    }

    private getActionXtnesionConnectionId(parameter: parameter | undefined): string | undefined {
        return Object.keys(this.getActionXtensionParameterValue(parameter)).find(
            (key) => (key.endsWith('NTX_CONNECTION_ID')))
    }

    private async getActionConnection(action: action): Promise<UsedConnection | undefined> {
        const parameter = this.getActionXtensionInputParameter(action)
        const connectionId = this.getActionXtnesionConnectionId(parameter)
        if (connectionId) {
            return (await this.getConnections()).find((con) => (con.id === connectionId))
        }
        return undefined
    }

    @Cacheable()
    public async getConnectors(): Promise<Connector[]> {
        return (await this._nwc.getTenantConnectors()).connectors!.map<Connector>((cn) => {
            return {
                id: cn.id!,
                name: cn.name!,
                enabled: cn.enabled!
            }
        })
    }

    @Cacheable()
    public async getConnections(): Promise<Connection[]> {
        const connectors = await this.getConnectors()
        return (await this._nwc.getTenantConnections()).map<Connection>((cn) => {
            return {
                id: cn.id!,
                name: cn.displayName!,
                isValid: !(cn.isInvalid ?? false),
                connector: connectors.find((connector) => connector.id === cn.contractId!)!
            }
        })
    }

    @Cacheable()
    public async getContracts(): Promise<Contract[]> {
        return (await this._nwc.getTenantContracts(true)).map<Contract>((cn) => {
            return {
                id: cn.id!,
                name: cn.name!,
                description: cn.description
            }
        })
    }

    @Cacheable()
    public async getDatasources(): Promise<Datasource[]> {
        const connections = await this.getConnections()
        const contracts = await this.getContracts()
        return (await this._nwc.getTenantDatasources()).map<Datasource>((ds) => {
            return {
                id: ds.id!,
                name: ds.name!,
                contract: contracts.find((contract) => contract.id === ds.contractId!)!,
                connection: (ds.connectionId === undefined) ? undefined : connections.find((cn) => cn.id === ds.connectionId!)!
            }
        })
    }

    @Cacheable()
    public async getWorkflowDefinition(workflowId: string): Promise<workflowDefinition> {
        return JSON.parse((await this._nwc.getWorkflowSource(workflowId)).workflowDefinition!)
    }

    public static actionsToFlatArray(action: action, allActions?: action[]): action[] {
        if (allActions === null || allActions === undefined) {
            allActions = [] as action[]
        }
        allActions.push(action)
        if (action.next) {
            this.actionsToFlatArray(action.next, allActions)
        }
        action.children.forEach(a => this.actionsToFlatArray(a, allActions))
        return allActions
    }

    public static arrayToDictionary<T>(array: T[], keyProperty: string): { [key: string]: T } {
        return Object.assign({}, ...array.map((a) => ({ [a[keyProperty]]: a })))
    }
}
