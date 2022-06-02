
import { Nwc, ApiError, permissionItem, datasourcePayload } from './../nwc'
import { ClientCredentials } from "./models/clientCredentials"
import { Tenant } from './models/tenant'
import { Workflow } from './models/workflow'
import { Contract } from './models/contract'
import { WorkflowDesign } from './models/workflowDesign'
import { Connection } from './models/connection';
import { Datasource } from './models/datasource';
import { NwcToSdkModelHelper } from './helpers/nwcToSdkModelHelper'
import { User } from './models/user'
import { SdkToNwcModelHelper } from './helpers/sdkToNwcModelHelper'
import { CacheClear, CacheUpdate, Cacheable } from '@type-cacheable/core'
import { OpenAPIV2 } from 'openapi-types'
import { ConnectionSchema } from './models/connectionSchema'
import { ConnectionProperty } from './models/connectionProperty'
import { Tag } from './models/tag'
import { DatasourceHelper } from './helpers/datasourceHelper'
import { Permission } from './models/permission'

export interface WorkflowsQueryOptions {
    tag?: string,
    namePattern?: string,
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
    private _token: string
    private _datasourceToken: string

    public get nwc(): Nwc {
        return this._nwc
    }

    public get tenant(): Tenant {
        return this._tenant
    }

    private constructor(tenant: Tenant, token: string, datasourceToken: string) {
        this._tenant = tenant
        this._token = token
        this._datasourceToken = datasourceToken
        this._nwc = new Nwc({
            CREDENTIALS: "include",
            BASE: tenant.apiManagerUrl,
            HEADERS: () => {
                return Promise.resolve({
                    "Host": this._tenant.host
                })
            },
            TOKEN: (options) => {
                return Promise.resolve<string>(options.url.startsWith('/connection/api/') ? this._datasourceToken : this._token)
            }
        })
    }

    @CacheClear({ isPattern: true, cacheKey: '.' })
    // TODO: Extremelly bad workaround until I find the right way to do it
    public clearCache(): void {
        return undefined
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
                        const client = new Sdk(
                            NwcToSdkModelHelper.Tenant(responses[0], tenantConfigurationRequestResult), token, responses[1].token!)
                        return client
                    })
                    .catch((error: ApiError) => Promise.reject(error))
            })
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "tags" })
    public getTags(): Promise<Tag[]> {
        return this._nwc.default.getTenantTags()
            .then((response) => response.resource!.map<Tag>((tag) => NwcToSdkModelHelper.Tag(tag)))
            .catch((error: ApiError) => Promise.reject(error))
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
            if (options.namePattern) {
                workflowInfos = workflowInfos.filter(wfl => wfl.name! === options.namePattern)
            }
            return Promise.resolve(workflowInfos)
        }).catch((error: ApiError) => Promise.reject(error))
    }

    public getWorkflowDesign = (workflowId: string): Promise<WorkflowDesign | undefined> => this.getWorkflowDesigns().then((designs) => designs.find(design => design.id === workflowId))
    public getWorkflowDesignByName = (workflowName: string): Promise<WorkflowDesign | undefined> => this.getWorkflowDesigns().then((designs) => designs.find(design => design.name === workflowName))

    @Cacheable({ cacheKey: "workflow" })
    public getWorkflow(workflowId: string): Promise<Workflow> {
        return this._nwc.default.getWorkflow(workflowId)
            .then((workflow) => this.getWorkflowDesign(workflowId)
                .then((design) => NwcToSdkModelHelper.Workflow(workflow, design!))
                .catch((error) => Promise.reject(error))
            ).catch((error) => Promise.reject(error))
    }

    public checkIfWorkflowExists = (workflowName: string): Promise<boolean> =>
        this.getWorkflowByName(workflowName)
            .then((workflow) => workflow !== undefined)
            .catch((error) => Promise.reject(error))

    public getWorkflowByName(workflowName: string): Promise<Workflow | undefined> {
        return this.getWorkflowDesigns()
            .then((designs) => {
                const design = designs.find((design) => design.name === workflowName)
                return (design)
                    ? this.getWorkflow(design.id)
                    : undefined
            })
            .catch((error) => Promise.reject(error))
    }

    public getWorkflowPermissions(workflowId: string): Promise<Permission[]> {
        return Promise.all([this._nwc.default.getWorkflowOwners(workflowId), this._nwc.default.getWorkflowBusinessOwners(workflowId)])
            .then((responses) => NwcToSdkModelHelper.WorkflowPermissions(responses[0].permissions, responses[1].businessOwners))
            .catch((error) => Promise.reject(error))
    }

    public updateWorkflowPermissions(workflowId: string, permissions: Permission[]): Promise<void> {
        return this._nwc.default.updateWorkflowOwners(workflowId, { permissions: permissions.filter(p => p.isOwner).map<permissionItem>((item) => SdkToNwcModelHelper.workflowPermissionItem(item)) })
            .then(() => this._nwc.default.updateWorkflowBusinessOwners(workflowId, { businessOwners: permissions.filter(p => p.isUser).map<permissionItem>((item) => SdkToNwcModelHelper.workflowPermissionItem(item)) })
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
            .then((response) => response.connections.map<Connection>(cn => NwcToSdkModelHelper.Connection(cn)))
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "connection" })
    public getConnection(connectionId: string): Promise<Connection | undefined> {
        return this.getConnections()
            .then((connections) => connections.find(cn => cn.id === connectionId))
            .catch((error: ApiError) => Promise.reject(error))
    }

    public getConnectionByName = (name: string): Promise<Connection | undefined> =>
        this.getConnections()
            .then((connections) => connections.find(cn => cn.name === name))
            .catch((error: ApiError) => Promise.reject(error))


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

    public getContract(id: string): Promise<Contract | undefined> {
        return this.getContracts()
            .then((contracts) => contracts.find((contract) => contract.id === id))
            .catch((error: ApiError) => Promise.reject(error))
    }

    public getContractByName(name: string): Promise<Contract | undefined> {
        return this.getContracts()
            .then((contracts) => contracts.find((contract) => contract.name === name))
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "contractSchema" })
    public getContractSchema(contractId: string): Promise<OpenAPIV2.Document> {
        return this._nwc.default.getTenantContractSchema(contractId)
            .then((response) => response)
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "connectionProperties" })
    public getContractConnectionProperties(contractId: string): Promise<{ [key: string]: ConnectionProperty }> {
        return this.getContractSchema(contractId)
            .then((schema) => Object.values(schema.securityDefinitions!)[0]?.["x-ntx-connection-properties"]?.properties ?? {})
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "datasources" })
    public getDatasources(): Promise<Datasource[]> {
        return this._nwc.default.getTenantDatasources()
            .then((response) => Promise.all(response.datasources.map<Promise<Datasource>>((datasource) =>
                this._nwc.default.getDatasource(datasource.id)
                    .then((ds) => NwcToSdkModelHelper.Datasource(ds)))))
            .catch((error: ApiError) => Promise.reject(error))
    }

    @Cacheable({ cacheKey: "datasource" })
    public getDatasource(id: string): Promise<Datasource> {
        return this._nwc.default.getDatasource(id)
            .then((datasource) => NwcToSdkModelHelper.Datasource(datasource))
            .catch((error: ApiError) => Promise.reject(error))
    }

    public getDatasourceByName = (name: string): Promise<Datasource | undefined> =>
        this.getDatasources()
            .then((datasources) => datasources.find(ds => ds.name === name))
            .catch((error: ApiError) => Promise.reject(error))

    @CacheClear({ cacheKey: "datasources" })
    public createDatasource(payload: datasourcePayload): Promise<Datasource | undefined> {
        payload.definition = DatasourceHelper.ensureConnectionInDefinition(payload.definition, payload.connectionId)
        return this._nwc.default.createDatasource(payload)
            .then((response) => this._nwc.default.updateDatasourcePermissions(response, { permissions: [{ id: "everyone", name: "Everyone", type: "group", scope: { owner: true, user: true } }] })
                .then(() => this.getDatasource(response))
                .then((datasource) => datasource)
                .catch((error) => Promise.reject(error)))
            .catch((error) => Promise.reject(error))
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

    @CacheClear({ cacheKey: ["workflowDesigns"] })
    public importWorkflow(name: string, key: string, overwriteExisting: boolean = false): Promise<Workflow> {
        return this.getWorkflowByName(name)
            .then((foundWorkflow) => {
                if (foundWorkflow && !overwriteExisting) {
                    throw new Error("workflow exists and no overwrite was specified")
                }
                if (!foundWorkflow) {
                    overwriteExisting = false
                }
                return this._nwc.default.importWorkflow({ name: name, key: key, overwriteExisting: overwriteExisting })
                    .then((response) =>
                        this.getWorkflow(response.workflowId!.workflowId!)
                            .then((workflow) => workflow))
                    .catch((error) => Promise.reject(error))
                    .catch((error: ApiError) => Promise.reject(error))
            })
            .catch((error: ApiError) => Promise.reject(error))
    }

    @CacheClear({ cacheKey: "connections" })
    public createConnection(contract: Contract, properties: Record<string, string>): Promise<Connection | undefined> {
        return this._nwc.default.createConnection(contract.appId, properties)
            .then((response) =>
                this._nwc.default.updateConnectionPermissions(response, { permissions: [{ id: "everyone", name: "Everyone", type: "group", scope: { own: true, use: true } }] })
                    .then(() => this.getConnection(response))
                    .then((connection) => connection)
                    .catch((error) => Promise.reject(error)))
            .catch((error) => Promise.reject(error))
    }

    @CacheClear({ cacheKey: "workflow" })
    public publishWorkflow(workflow: Workflow): Promise<Workflow> {
        return this._nwc.default.publishWorkflow(workflow.id, SdkToNwcModelHelper.updateWorkflowPayload(workflow))
            .then((response) => this.getWorkflow(response.workflowId)
                .then((workflow) => workflow))
            .catch((error: ApiError) => Promise.reject(error))
            .catch((error: ApiError) => Promise.reject(error))
    }

    @CacheClear({ cacheKey: "workflow" })
    public saveWorkflow(workflow: Workflow): Promise<Workflow> {
        return this._nwc.default.saveWorkflow(workflow.id, SdkToNwcModelHelper.updateWorkflowPayload(workflow))
            .then((response) => this.getWorkflow(response.workflowId)
                .then((workflow) => workflow))
            .catch((error: ApiError) => Promise.reject(error))
            .catch((error: ApiError) => Promise.reject(error))
    }

}