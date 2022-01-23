
import { Nwc, tokenResponse, ApiError, tenantConfiguration, tenantInfo, getDatasourceTokenResponseType, tagResponse, getWorkflowsResponseType, OpenAPIConfig } from './../nwc'
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
import { Cacheable } from '../cache'
import { arrayToDictionary } from '../utils'
import { WorkflowDefinitionParser } from './workflowDefinitionWrapper'

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

    private _initialiseCache = (): Promise<void> => {
        return Promise.all([this.getConnectors(), this.getContracts(), this.getTags()]).then(() =>
            Promise.resolve(this.getConnections()).then(() =>
                Promise.resolve(this.getDatasources().then(() => Promise.resolve())
                ).catch((error: ApiError) => Promise.reject(error))
            ).catch((error: ApiError) => Promise.reject(error))
        ).catch((error: ApiError) => Promise.reject(error))
    }

    public static connectWithClientCredentials(credentials: ClientCredentials): Promise<Sdk> {
        return new Nwc().getToken({ client_id: credentials.clientId, client_secret: credentials.clientSecret, grant_type: "client_credentials" })
            .then((response) => Promise.resolve(Sdk.connectWithToken(response.access_token!)))
            .catch((error: ApiError) => Promise.reject(error))
    }

    public static connectWithToken(token: string): Promise<Sdk> {
        const temporaryClient = new Nwc({
            CREDENTIALS: 'include',
            TOKEN: token
        })
        return temporaryClient.getTenantConfiguration()
            .then((tenantConfigurationRequestResult) => {
                temporaryClient.request.openApiConfig.BASE = tenantConfigurationRequestResult.apiManagerUrl!
                return Promise.all([
                    temporaryClient.getTenantInfo(tenantConfigurationRequestResult.user!.tenantId!),
                    temporaryClient.getDatasourceToken()])
                    .then((responses) => {
                        const tenantInfoRequestResponse = responses[0]
                        const dataSourceTokenRequestResult = responses[1]
                        const tenant: Tenant = {
                            id: tenantInfoRequestResponse.id!,
                            name: tenantInfoRequestResponse.name!,
                            apiManagerUrl: tenantConfigurationRequestResult.apiManagerUrl!,
                            serviceRegion: tenantConfigurationRequestResult.serviceRegion!,
                            cloudElementService: tenantConfigurationRequestResult.cloudElementService!,
                            host: tenantConfigurationRequestResult.apiManagerUrl!.split('//')[1],
                            token: token,
                            datasourceToken: dataSourceTokenRequestResult.token!,
                            url: tenantInfoRequestResponse.tenancy_url!
                        }
                        const service = new Sdk(tenant)
                        return service._initialiseCache()
                            .then(() => Promise.resolve(service))
                            .catch((error: ApiError) => Promise.reject(error))
                    })
                    .catch((error: ApiError) => Promise.reject(error))
            })
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable()
    public getTags(): Promise<string[]> {
        return this._nwc.getTenantTags().then((response) => {
            return Promise.resolve(response.resource!.map<string>((tag) => tag.name!))
        }).catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable()
    public getWorkflowInfos(options: WorkflowsQueryOptions = {}): Promise<WorkflowInfo[]> {
        return this._nwc.getWorkflows(2000).then((response) => {
            let workflowInfos = response.workflows!.map<WorkflowInfo>((wfl) => ({
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
            return Promise.resolve(workflowInfos)
        }).catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable()
    public getWorkflow(workflowId: string): Promise<Workflow> {
        return Promise.all([this.getWorkflowInfos(), this._nwc.getWorkflowSource(workflowId), this.getConnectors(), this.getConnections()])
            .then((responses) => {
                const info = responses[0].find((wfl) => (wfl.id === workflowId))!
                const source = responses[1]
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
                    definition: WorkflowDefinitionParser.parse(source.workflowDefinition!, responses[2], responses[3])
                }
                return Promise.resolve(workflow)
            }).catch((error) => Promise.reject(error))
    }


    @Cacheable()
    public getConnectors(): Promise<Connector[]> {
        return this._nwc.getTenantConnectors().then((response) => {
            return Promise.resolve(response.connectors!.map<Connector>((cn) => {
                return {
                    id: cn.id!,
                    name: cn.name!,
                    enabled: cn.enabled!
                }
            }))
        }).catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable()
    public getConnections(): Promise<Connection[]> {
        return Promise.all([this.getConnectors(), this._nwc.getTenantConnections()]).then((results) => {
            const connectors = results[0]
            return Promise.resolve(results[1].map<Connection>((cn) => {
                return {
                    id: cn.id!,
                    name: cn.displayName!,
                    isValid: !(cn.isInvalid ?? false),
                    connector: connectors.find((connector) => connector.id === cn.contractId!)!
                }
            }))
        }).catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable()
    public getContracts(): Promise<Contract[]> {
        return this._nwc.getTenantContracts(true).then((response) => {
            return Promise.resolve(response.map<Contract>((cn) => {
                return {
                    id: cn.id!,
                    name: cn.name!,
                    description: cn.description
                }
            }))
        }).catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable()
    public getDatasources(): Promise<Datasource[]> {
        return Promise.all([this.getConnections(), this.getContracts(), this._nwc.getTenantDatasources()])
            .then((results) => {
                return Promise.resolve(results[2].map<Datasource>((ds) => {
                    return {
                        id: ds.id!,
                        name: ds.name!,
                        contract: results[1].find((contract) => contract.id === ds.contractId!)!,
                        connection: (ds.connectionId === undefined) ? undefined : results[0].find((cn) => cn.id === ds.connectionId!)!
                    }
                }))
            }).catch((error: ApiError) => Promise.reject(error))
    }
}
