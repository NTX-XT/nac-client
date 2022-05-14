
import { Nwc, ApiError, permissionItem, workflow, workflowDefinition } from './../nwc'
import { ClientCredentials } from "./models/clientCredentials"
import { Tenant } from './models/tenant'
import { Workflow } from './models/workflow'
import { Contract } from './models/contract'
import { WorkflowDesign } from './models/workflowDesign'
import { Connection } from './models/connection';
import { Datasource } from './models/datasource';
import { NwcToSdkModelHelper } from './helpers/nwcToSdkModelHelper'
import { User } from './models/user'
import { WorkflowPermissions } from './models/workflowPermissions'
import { SdkToNwcModelHelper } from './helpers/sdkToNwcModelHelper'
import { CacheClear, CacheUpdate, Cacheable } from '@type-cacheable/core'
import { OpenAPIV2 } from 'openapi-types'
import { ConnectionSchema } from './models/connectionSchema'
import { ConnectionProperty } from './models/connectionProperty'
import { WorkflowDefinitionDetails } from './models/workflowDefinitionDetails'

export interface WorkflowsQueryOptions {
    tag?: string,
    name?: string,
    matchNameAsPattern?: boolean
}

export const invalidId = "undefined"
const defaultBaseURL = (isTestTenant: boolean = false) => isTestTenant ? "https://us.nintextest.io" : "https://us.nintex.io"

const invalidContract: Contract = {
    id: invalidId,
    name: "(Invalid Contract)",
    appId: "",
}

export class Sdk {
    private _tenant: Tenant
    private _nwc: Nwc
    public get nwc(): Nwc {
        return this._nwc
    }

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
                return Promise.resolve<string>(options.url.startsWith('/connection/api/') ? this._tenant.datasourceToken! : this._tenant.token)
            }
        })
    }

    // private _initialiseCache = (): Promise<void> => {
    //     this.clearCache()
    //     return Promise.all([this.getContracts(), this.getTags()]).then(() =>
    //         Promise.resolve(this.getConnections()).then(() =>
    //             Promise.resolve(this.getDatasources().then(() => Promise.resolve())
    //             ).catch((error: ApiError) => Promise.reject(error))
    //         ).catch((error: ApiError) => Promise.reject(error))
    //     ).catch((error: ApiError) => {
    //         console.log(error)
    //         Promise.reject(error)
    //     })
    // }

    @CacheClear({ isPattern: true, cacheKey: '.' })
    // TODO: Extremelly bad workaround until I find the right way to do it
    public clearCache(): void {
        const c = true
    }

    public static connectWithClientCredentials(credentials: ClientCredentials): Promise<Sdk> {
        return new Nwc({
            CREDENTIALS: 'include',
            BASE: defaultBaseURL(credentials.isTestTenant)
        }).default.getToken({ client_id: credentials.clientId, client_secret: credentials.clientSecret, grant_type: "client_credentials" })
            .then((response) => Promise.resolve(Sdk.connectWithToken(response.access_token!, credentials.isTestTenant)))
            .catch((error: ApiError) => Promise.reject(error))
    }

    public static connectWithToken(token: string, isTestTenant: boolean = false): Promise<Sdk> {
        let temporaryClient = new Nwc({
            CREDENTIALS: 'include',
            TOKEN: token,
            BASE: defaultBaseURL(isTestTenant)
        })
        return temporaryClient.default.getTenantConfiguration()
            .then((tenantConfigurationRequestResult) => {
                temporaryClient = new Nwc({
                    CREDENTIALS: 'include',
                    TOKEN: token,
                    BASE: tenantConfigurationRequestResult.apiManagerUrl!
                })
                return Promise.all([
                    temporaryClient.default.getTenantInfo(tenantConfigurationRequestResult.user!.tenantId!),
                    temporaryClient.default.getDatasourceToken()])
                    .then((responses) => {
                        const tenantInfoRequestResponse = responses[0]
                        const dataSourceTokenRequestResult = responses[1]
                        const tenant: Tenant = NwcToSdkModelHelper.Tenant(tenantInfoRequestResponse, tenantConfigurationRequestResult, token, dataSourceTokenRequestResult.token!)
                        const client = new Sdk(tenant)
                        return client
                    })
                    .catch((error: ApiError) => Promise.reject(error))
            })
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "tags" })
    public getTags(): Promise<string[]> {
        return this._nwc.default.getTenantTags().then((response) => {
            return Promise.resolve(response.resource!.map<string>((tag) => tag.name!))
        }).catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "workflowDesigns" })
    public getWorkflowDesigns(options: WorkflowsQueryOptions = {}): Promise<WorkflowDesign[]> {
        return this._nwc.default.getWorkflowDesigns(2000).then((response) => {
            let workflowInfos = response.workflows!.map<WorkflowDesign>((wfl) => NwcToSdkModelHelper.WorkflowDesign(wfl))
            if (options.tag) {
                workflowInfos = workflowInfos.filter((wfl) => {
                    const matchedTags = wfl.tags!.filter((tag) => (tag.name === options.tag))
                    return (matchedTags && matchedTags.length > 0)
                })
            }
            if (options.name) {
                workflowInfos = workflowInfos.filter((wfl) => (options.matchNameAsPattern === true ? wfl.name!.includes(options.name!) : wfl.name! === options.name))
            }
            return Promise.resolve(workflowInfos)
        }).catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "workflow" })
    public getWorkflow(workflowId: string): Promise<Workflow> {
        return this._nwc.default.getWorkflow(workflowId)
            .then((workflow) => NwcToSdkModelHelper.Workflow(workflow))
            .catch((error) => Promise.reject(error))
    }

    public getWorkflowPermissions(workflowId: string): Promise<WorkflowPermissions> {
        return Promise.all([this._nwc.default.getWorkflowOwners(workflowId), this._nwc.default.getWorkflowBusinessOwners(workflowId)])
            .then((responses) => NwcToSdkModelHelper.WorkflowPermissions(responses[0].permissions, responses[1].businessOwners))
            .catch((error) => Promise.reject(error))
    }

    public updateWorkflowPermissions(workflowId: string, permissions: WorkflowPermissions): Promise<void> {
        return this._nwc.default.updateWorkflowOwners(workflowId, { permissions: permissions.workflowOwners.map<permissionItem>((item) => SdkToNwcModelHelper.permissionItem(item)) })
            .then(() => this._nwc.default.updateWorkflowBusinessOwners(workflowId, { businessOwners: permissions.businessOwners.map<permissionItem>((item) => SdkToNwcModelHelper.permissionItem(item)) })
                .then(() => Promise.resolve())
                .catch((error) => Promise.reject(error)))
            .catch((error) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "users" })
    public getUsers(): Promise<User[]> {
        return this._nwc.default.getTenantUsers()
            .then((response) => response.users!.map<User>((tenantUser) => NwcToSdkModelHelper.User(tenantUser)))
            .catch((error) => Promise.reject(error))
    }

    public deleteWorkflow(workflowId: string): Promise<void> {
        return this._nwc.default.deleteDraftWorkflow(workflowId)
            .then(() => this._nwc.default.deletePublishedWorkflow(workflowId)
                .then(() => Promise.resolve())
                .catch((error: ApiError) => Promise.reject(error)))
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "connections" })
    public getConnections(): Promise<Connection[]> {
        return this._nwc.default.getTenantConnections()
            .then((connections) => connections.map<Connection>(cn => NwcToSdkModelHelper.Connection(cn)))
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "connection" })
    public getConnection(connectionId: string): Promise<Connection> {
        return this.getConnections()
            .then((connections) => connections.filter(cn => cn.id === connectionId)[0])
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "connectionSchema" })
    public getConnectionSchema(connectionId: string): Promise<ConnectionSchema> {
        return this._nwc.default.getTenantConnectionSchema(connectionId)
            .then((schema) => NwcToSdkModelHelper.ConnectionSchema(schema))
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "contracts" })
    public getContracts(): Promise<Contract[]> {
        return this._nwc.default.getTenantContracts(true)
            .then((contracts) => contracts.map<Contract>(cn => NwcToSdkModelHelper.Contract(cn)))
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "contractSchema" })
    public getContractSchema(contractId: string): Promise<OpenAPIV2.Document> {
        return this._nwc.default.getTenantContractSchema(contractId)
            .then((response) => JSON.parse(response) as OpenAPIV2.Document)
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "connectionProperties" })
    public getConnectionProperties(contractId: string): Promise<{ [key: string]: ConnectionProperty }> {
        return this.getContractSchema(contractId)
            .then((schema) => Object.values(schema.securityDefinitions!)[0]?.["x-ntx-connection-properties"]?.properties ?? {})
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "datasources" })
    public getDatasources(): Promise<Datasource[]> {
        return this._nwc.default.getTenantDatasources()
            .then((datasources) => datasources.map<Datasource>(datasource => NwcToSdkModelHelper.Datasource(datasource)))
            .catch((error: ApiError) => Promise.reject(error))
    }



    // public groupConnections(connections: Connection[]): Promise<Contract[]> {
    //     const uniqueContractIds = connections.map((cn) => cn.contract?.id).filter((value, index, self) => self.indexOf(value) === index)
    //     const invalidConnections = connections.filter((cn) => cn.contract === undefined)
    //     return this.getContracts()
    //         .then((contracts) => {
    //             const resolved = contracts.filter((cn) => uniqueContractIds.includes(cn.id))
    //             if (invalidConnections && invalidConnections.length > 0) {
    //                 resolved.push(invalidContract)
    //             }
    //             return Promise.resolve(resolved)
    //         }).catch((error: ApiError) => Promise.reject(error))
    // }

    // public groupDatasources(datasources: Datasource[]): Promise<Contract[]> {
    //     const uniqueIds = datasources.map((ds) => ds.contract?.id).filter((value, index, self) => self.indexOf(value) === index)
    //     const invalids = datasources.filter((ds) => ds.contract === undefined)
    //     return this.getContracts()
    //         .then((contracts) => {
    //             const resolved = contracts.filter((cn) => uniqueIds.includes(cn.id))
    //             if (invalids && invalids.length > 0) {
    //                 resolved.push(invalidContract)
    //             }
    //             return Promise.resolve(resolved)
    //         }).catch((error: ApiError) => Promise.reject(error))
    // }

    public exportWorkflow = (id: string, withNonExpiringKey: boolean = true): Promise<string> =>
        this._nwc.default.exportWorkflow(id, { isNonExpiring: withNonExpiringKey })
            .then((response) => response.key!)
            .catch((error: ApiError) => Promise.reject(error))

    public importWorkflow = (name: string, key: string, overwriteExisting: boolean = false): Promise<Workflow> =>
        this._nwc.default.importWorkflow({ name: name, key: key, overwriteExisting: overwriteExisting })
            .then((response) =>
                this.getWorkflow(response.workflowId!.workflowId!)
                    .then((workflow) => workflow))
            .catch((error) => Promise.reject(error))
            .catch((error: ApiError) => Promise.reject(error))

    @CacheUpdate({ cacheKey: "connection" })
    public createConnection(contract: Contract, properties: Record<string, string>): Promise<Connection> {
        return this._nwc.default.createConnection(contract.appId, properties)
            .then((response) => this.getConnections()
                .then((results) => results.find((cn) => cn.id === response)!)
                .catch((error) => Promise.reject(error))
                .catch((error) => Promise.reject(error)))
    }

    @Cacheable({ cacheKey: "workflowDefinition" })
    public getWorkflowDefinition(workflowId: string): Promise<workflowDefinition> {
        return this.getWorkflow(workflowId)
            .then((response) => JSON.parse(response._nwcObject.workflowDefinition) as workflowDefinition)
            .catch((error: ApiError) => Promise.reject(error))
    }

    public publishWorkflow = (workflow: Workflow): Promise<workflow> => {
        return this.getWorkflowDefinition(workflow.id)
            .then((definition) => {
                if (definition.settings.id === '') {
                    definition.settings.id = workflow.id
                    workflow._nwcObject.workflowDefinition = JSON.stringify(definition)
                }
                return this._nwc.default.publishWorkflow(workflow.id, {
                    author: workflow._nwcObject.author,
                    datasources: workflow._nwcObject.datasources,
                    engineName: workflow._nwcObject.engineName,
                    permissions: workflow._nwcObject.permissions,
                    startEvents: workflow._nwcObject.startEvents,
                    tags: workflow._nwcObject.tags,
                    version: workflow.version,
                    workflowDefinition: workflow._nwcObject.workflowDefinition,
                    workflowDescription: workflow.description,
                    workflowDesignParentVersion: workflow.designVersion,
                    workflowName: workflow.name,
                    workflowType: workflow.type,
                    workflowVersionComments: workflow.comments
                })
                    .then((response) => response)
                    .catch((error: ApiError) => Promise.reject(error))
            }
            )
            .catch((error: ApiError) => Promise.reject(error))
    }
}