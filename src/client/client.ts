import { NAC, ApiError, permissionItem, datasourcePayload, tokenResponse } from '../nac';
import { ClientCredentials } from './models/clientCredentials';
import { Tenant } from './models/tenant';
import { Workflow } from './models/workflow';
import { Contract } from './models/contract';
import { WorkflowDesign, WorkflowInstance } from './models/workflowDesign';
import { Connection } from './models/connection';
import { Datasource } from './models/datasource';
import { NACToClientModelHelper } from './helpers/NACToClientModelHelper';
import { User } from './models/user';
import { PermissionType, ClientToNACModelHelper } from './helpers/ClientToNACModelHelper';
import { CacheClear, Cacheable } from '@type-cacheable/core';
import { OpenAPIV2 } from 'openapi-types';
import { ConnectionSchema } from './models/connectionSchema';
import { ConnectionProperty } from './models/connectionProperty';
import { Tag } from './models/tag';
import { DatasourceHelper } from './helpers/datasourceHelper';
import { Permission } from './models/permission';
import { WorkflowHelper } from './helpers/workflowHelper';

export interface WorkflowsQueryOptions {
  tag?: string;
  namePattern?: string;
}

const everyonePermission = (asUser: boolean = true, asOwner: boolean = true): Permission => ({
  id: 'everyone',
  name: 'Everyone',
  type: 'group',
  isOwner: asOwner,
  isUser: asUser,
});

export const invalidId = 'undefined';
const defaultBaseURL = (isTestTenant: boolean = false): string =>
  isTestTenant ? 'https://us.nintextest.io' : 'https://us.nintex.io';

const invalidContract: Contract = {
  id: invalidId,
  name: '(Invalid Contract)',
  appId: '',
  actions: [],
  events: [],
  icon: '',
};

export class Client {
  private _tenant: Tenant;
  private _nac: NAC;
  private _token: string;
  private _datasourceToken: string;
  private _user: User;

  public get nac(): NAC {
    return this._nac;
  }

  public get tenant(): Tenant {
    return this._tenant;
  }

  public get user(): User {
    return this._user;
  }

  private constructor(tenant: Tenant, user: User, token: string, datasourceToken: string) {
    this._tenant = tenant;
    this._token = token;
    this._datasourceToken = datasourceToken;
    this._user = user;
    this._nac = new NAC({
      CREDENTIALS: 'include',
      BASE: tenant.apiManagerUrl,
      HEADERS: () => {
        return Promise.resolve({
          Host: this._tenant.host,
        });
      },
      TOKEN: (options) => {
        return Promise.resolve<string>(
          options.url.startsWith('/connection/api/') ? this._datasourceToken : this._token
        );
      },
    });
  }

  private _defaultPermisssions = (): Permission[] => [
    everyonePermission(),
    {
      id: this._user.id,
      email: this._user.email,
      name: this._user.name ?? `${this._user.firstName ?? ''} ${this._user.lastName ?? ''}`.trim(),
      isOwner: true,
      isUser: false,
      type: 'user',
    },
  ];

  @CacheClear({ isPattern: true, cacheKey: '.' })
  // TODO: Extremelly bad workaround until I find the right way to do it
  public clearCache(): void {
    return undefined;
  }

  public static authenticate(credentials: ClientCredentials): Promise<tokenResponse> {
    return new NAC({
      CREDENTIALS: 'include',
      BASE: defaultBaseURL(credentials.isTestTenant),
    }).default.getToken({
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      grant_type: 'client_credentials',
    });
  }

  public static connectWithClientCredentials(credentials: ClientCredentials): Promise<Client> {
    return this.authenticate(credentials)
      .then((response) => Promise.resolve(Client.connectWithToken(response.access_token!, credentials.isTestTenant)))
      .catch((error: ApiError) => Promise.reject(error));
  }

  public static connectWithToken(token: string, isTestTenant: boolean = false): Promise<Client> {
    let temporaryClient = new NAC({
      CREDENTIALS: 'include',
      TOKEN: token,
      BASE: defaultBaseURL(isTestTenant),
    });
    return temporaryClient.default
      .getTenantConfiguration()
      .then((tenantConfigurationRequestResult) => {
        temporaryClient = new NAC({
          CREDENTIALS: 'include',
          TOKEN: token,
          BASE: tenantConfigurationRequestResult.apiManagerUrl!,
        });
        return Promise.all([
          temporaryClient.default.getTenantInfo(tenantConfigurationRequestResult.user!.tenantId!),
          temporaryClient.default.getDatasourceToken(),
        ])
          .then((responses) => {
            const user = NACToClientModelHelper.User(tenantConfigurationRequestResult.user!);
            const client = new Client(
              NACToClientModelHelper.Tenant(responses[0], tenantConfigurationRequestResult),
              user,
              token,
              responses[1].token!
            );
            return client;
          })
          .catch((error: ApiError) => Promise.reject(error));
      })
      .catch((error: ApiError) => Promise.reject(error));
  }

  @Cacheable({ cacheKey: 'tags' })
  public getTags(): Promise<Tag[]> {
    return this._nac.default
      .getTenantTags()
      .then((response) => response.resource!.map<Tag>((tag) => NACToClientModelHelper.Tag(tag)))
      .catch((error: ApiError) => Promise.reject(error));
  }

  @Cacheable({ cacheKey: 'workflowDesigns' })
  public getWorkflowDesigns(options: WorkflowsQueryOptions = {}): Promise<WorkflowDesign[]> {
    return this._nac.default
      .getWorkflowDesigns(2000)
      .then((response) => {
        let workflowInfos = response.workflows!.map<WorkflowDesign>((wfl) =>
          NACToClientModelHelper.WorkflowDesign(wfl)
        );
        if (options.tag) {
          workflowInfos = workflowInfos.filter((wfl) => {
            const matchedTags = wfl.tags!.filter((tag) => tag.name === options.tag);
            return matchedTags && matchedTags.length > 0;
          });
        }
        if (options.namePattern) {
          workflowInfos = workflowInfos.filter((wfl) => wfl.name! === options.namePattern);
        }
        return Promise.resolve(workflowInfos);
      })
      .catch((error: ApiError) => Promise.reject(error));
  }

  public getWorkflowDesign = (workflowId: string): Promise<WorkflowDesign | undefined> =>
    this.getWorkflowDesigns().then((designs) => designs.find((design) => design.id === workflowId));

  public getWorkflowDesignByName = (workflowName: string): Promise<WorkflowDesign | undefined> =>
    this.getWorkflowDesigns().then((designs) => designs.find((design) => design.name === workflowName));

  private resolveDependencies = async (workflow: Workflow): Promise<Workflow> => {
    const nonResolvedConnections = WorkflowHelper.allConnectionDependencies(workflow.dependencies).filter(
      (dep) => dep.needsResolution
    );
    for (const dep of nonResolvedConnections) {
      const cn = await this.getConnection(dep.connectionId);
      if (cn) {
        dep.connectionName = cn.name;
        dep.needsResolution = false;
        workflow.dependencies.contracts[dep.contractId].contractName = cn.NACObejct.contractName;
      }
    }
    return workflow;
  };

  @Cacheable({ cacheKey: 'workflow' })
  public getWorkflow(workflowId: string): Promise<Workflow> {
    return this._nac.default
      .getWorkflow(workflowId)
      .then((workflow) =>
        this.getWorkflowDesign(workflowId)
          .then((design) =>
            this.resolveDependencies(NACToClientModelHelper.Workflow(workflow, design!))
              .then((wfl) => wfl)
              .catch((error) => Promise.reject(error))
          )
          .catch((error) => Promise.reject(error))
      )
      .catch((error) => Promise.reject(error));
  }

  public getWorkflowInstance(workflowInstanceId: string): Promise<WorkflowInstance> {
    return this._nac.default
      .getWorkflowInstance(workflowInstanceId)
      .then((instance) => NACToClientModelHelper.WorkflowInstance(instance));
  }

  public tryGetWorkflow = async (workflowId: string): Promise<Workflow | undefined> => {
    try {
      return await this.getWorkflow(workflowId);
    } catch {
      return undefined;
    }
  };

  public checkIfWorkflowExists = (workflowName: string): Promise<boolean> =>
    this.getWorkflowByName(workflowName)
      .then((workflow) => workflow !== undefined)
      .catch((error) => Promise.reject(error));

  public getWorkflowByName(workflowName: string): Promise<Workflow | undefined> {
    return this.getWorkflowDesigns()
      .then((designs) => {
        const design = designs.find((design) => design.name === workflowName);
        return design ? this.getWorkflow(design.id) : undefined;
      })
      .catch((error) => Promise.reject(error));
  }

  public getWorkflowPermissions(workflowId: string): Promise<Permission[]> {
    return Promise.all([
      this._nac.default.getWorkflowOwners(workflowId),
      this._nac.default.getWorkflowBusinessOwners(workflowId),
    ])
      .then((responses) =>
        NACToClientModelHelper.WorkflowPermissions(responses[0].permissions, responses[1].businessOwners)
      )
      .catch((error) => Promise.reject(error));
  }

  public startWorkflow(workflowId: string, startData?: Record<string, string>): Promise<WorkflowInstance> {
    return this._nac.default
      .startWorkflow(workflowId, startData)
      .then((response) => NACToClientModelHelper.WorkflowInstance(response));
  }

  public updateWorkflowPermissions(workflowId: string, permissions: Permission[]): Promise<void> {
    return this._nac.default
      .updateWorkflowOwners(workflowId, {
        permissions: permissions
          .filter((p) => p.isOwner)
          .map<permissionItem>((item) => ClientToNACModelHelper.workflowPermissionItem(item)),
      })
      .then(() =>
        this._nac.default
          .updateWorkflowBusinessOwners(workflowId, {
            businessOwners: permissions
              .filter((p) => p.isUser)
              .map<permissionItem>((item) => ClientToNACModelHelper.workflowPermissionItem(item)),
          })
          .then(() => Promise.resolve())
          .catch((error) => Promise.reject(error))
      )
      .catch((error) => Promise.reject(error));
  }

  @Cacheable({ cacheKey: 'users' })
  public getUsers(): Promise<User[]> {
    return this._nac.default
      .getTenantUsers()
      .then((response) => response.users!.map<User>((tenantUser) => NACToClientModelHelper.User(tenantUser)))
      .catch((error) => Promise.reject(error));
  }

  public deleteWorkflow(workflowId: string): Promise<void> {
    return this._nac.default
      .deleteDraftWorkflow(workflowId)
      .then(() =>
        this._nac.default
          .deletePublishedWorkflow(workflowId)
          .then(() => Promise.resolve())
          .catch((error: ApiError) => Promise.reject(error))
      )
      .catch((error: ApiError) => Promise.reject(error));
  }

  @Cacheable({ cacheKey: 'connections' })
  public getConnections(): Promise<Connection[]> {
    return this._nac.default
      .getTenantConnections()
      .then((response) => response.connections.map<Connection>((cn) => NACToClientModelHelper.Connection(cn)))
      .catch((error: ApiError) => Promise.reject(error));
  }

  @Cacheable({ cacheKey: 'connection' })
  public getConnection(connectionId: string): Promise<Connection | undefined> {
    return this.getConnections()
      .then((connections) => connections.find((cn) => cn.id === connectionId))
      .catch((error: ApiError) => Promise.reject(error));
  }

  public getConnectionByName = (name: string): Promise<Connection | undefined> =>
    this.getConnections()
      .then((connections) => connections.find((cn) => cn.name === name))
      .catch((error: ApiError) => Promise.reject(error));

  @Cacheable({ cacheKey: 'connectionSchema' })
  public getConnectionSchema(connectionId: string): Promise<ConnectionSchema> {
    return this._nac.default
      .getTenantConnectionSchema(connectionId)
      .then((schema) => NACToClientModelHelper.ConnectionSchema(schema.value!))
      .catch((error: ApiError) => Promise.reject(error));
  }

  @Cacheable({ cacheKey: 'contracts' })
  public getContracts(): Promise<Contract[]> {
    return Promise.all([this._nac.default.getTenantContracts(true), this._nac.default.getTenantConnectors()])
      .then((responses) =>
        responses[0].map<Contract>((cn) =>
          NACToClientModelHelper.Contract(
            cn,
            responses[1].connectors.find((c) => c.id === cn.id)
          )
        )
      )
      .catch((error: ApiError) => Promise.reject(error));
  }

  public getContract(id: string): Promise<Contract | undefined> {
    return this.getContracts()
      .then((contracts) => contracts.find((contract) => contract.id === id))
      .catch((error: ApiError) => Promise.reject(error));
  }

  public getContractByName(name: string): Promise<Contract | undefined> {
    return this.getContracts()
      .then((contracts) => contracts.find((contract) => contract.name === name))
      .catch((error: ApiError) => Promise.reject(error));
  }

  @Cacheable({ cacheKey: 'contractSchema' })
  public getContractSchema(contractId: string): Promise<OpenAPIV2.Document> {
    return this._nac.default
      .getTenantContractSchema(contractId)
      .then((response) => response)
      .catch((error: ApiError) => Promise.reject(error));
  }

  @Cacheable({ cacheKey: 'connectionProperties' })
  public getContractConnectionProperties(contractId: string): Promise<{ [key: string]: ConnectionProperty }> {
    return this.getContractSchema(contractId)
      .then(
        (schema) => Object.values(schema.securityDefinitions!)[0]?.['x-ntx-connection-properties']?.properties ?? {}
      )
      .catch((error: ApiError) => Promise.reject(error));
  }

  @Cacheable({ cacheKey: 'datasources' })
  public getDatasources(): Promise<Datasource[]> {
    return this._nac.default
      .getTenantDatasources()
      .then((response) =>
        Promise.all(
          response.datasources.map<Promise<Datasource>>((datasource) =>
            this._nac.default.getDatasource(datasource.id).then((ds) => NACToClientModelHelper.Datasource(ds))
          )
        )
      )
      .catch((error: ApiError) => Promise.reject(error));
  }

  @Cacheable({ cacheKey: 'datasource' })
  public getDatasource(id: string): Promise<Datasource> {
    return this._nac.default
      .getDatasource(id)
      .then((datasource) => NACToClientModelHelper.Datasource(datasource))
      .catch((error: ApiError) => Promise.reject(error));
  }

  public tryGetDatasource = async (id: string): Promise<Datasource | undefined> => {
    try {
      return await this.getDatasource(id);
    } catch {
      return undefined;
    }
  };

  public getDatasourceByName = (name: string): Promise<Datasource | undefined> =>
    this.getDatasources()
      .then((datasources) => datasources.find((ds) => ds.name === name))
      .catch((error: ApiError) => Promise.reject(error));

  @CacheClear({ cacheKey: 'datasources' })
  public createDatasource(payload: datasourcePayload, permissions?: Permission[]): Promise<Datasource | undefined> {
    payload.definition = DatasourceHelper.ensureConnectionInDefinition(payload.definition, payload.connectionId);
    return this._nac.default
      .createDatasource(payload)
      .then((response) =>
        this._nac.default
          .updateDatasourcePermissions(response, {
            permissions: ClientToNACModelHelper.permissionItems(
              permissions ?? this._defaultPermisssions(),
              PermissionType.DatasourcePost
            ),
          })
          .then(() => this.getDatasource(response))
          .then((datasource) => datasource)
          .catch((error) => Promise.reject(error))
      )
      .catch((error) => Promise.reject(error));
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
    this._nac.default
      .exportWorkflow(id, { isNonExpiring: withNonExpiringKey })
      .then((response) => response.key!)
      .catch((error: ApiError) => Promise.reject(error));

  @CacheClear({ cacheKey: ['workflowDesigns', 'workflow'] })
  public importWorkflow(name: string, key: string, overwriteExisting: boolean = false): Promise<Workflow> {
    return this.getWorkflowByName(name)
      .then((foundWorkflow) => {
        if (foundWorkflow && !overwriteExisting) {
          throw new Error('workflow exists and no overwrite was specified');
        }
        if (!foundWorkflow) {
          overwriteExisting = false;
        }
        return this._nac.default
          .importWorkflow({
            name: name,
            key: key,
            overwriteExisting: overwriteExisting,
            author: {
              id: this._user.id,
              tenantId: this._tenant.id,
              name: this._user.name ?? '',
            },
          })
          .then((response) => {
            const s = response;
            return this.getWorkflow(response.workflowId!.workflowId!)
              .then((workflow) => workflow)
              .catch((error) => Promise.reject(error));
          })
          .catch((error: ApiError) => Promise.reject(error));
      })
      .catch((error: ApiError) => Promise.reject(error));
  }

  @CacheClear({ cacheKey: 'connections' })
  public createConnection(
    contract: Contract,
    properties: Record<string, string>,
    permissions?: Permission[]
  ): Promise<Connection | undefined> {
    return this._nac.default
      .createConnection(contract.appId, properties)
      .then((response) =>
        this._nac.default
          .updateConnectionPermissions(response, {
            permissions: ClientToNACModelHelper.permissionItems(
              permissions ?? this._defaultPermisssions(),
              PermissionType.ConnectionPost
            ),
          })
          .then(() => this.getConnection(response))
          .then((connection) => connection)
          .catch((error) => Promise.reject(error))
      )
      .catch((error) => Promise.reject(error));
  }

  @CacheClear({ cacheKey: 'workflow' })
  public publishWorkflow(workflow: Workflow): Promise<Workflow> {
    if (workflow.permissions.filter((p) => p.isUser).length === 0) {
      workflow.permissions.push(everyonePermission(true, false));
    }
    this.ensureCorrectAuthorInDefinition(workflow);
    return this._nac.default
      .publishWorkflow(workflow.id, ClientToNACModelHelper.updateWorkflowPayload(workflow))
      .then(() => {
        if (workflow.startEvents && workflow.startEvents[0].eventType === 'nintex:scheduledstart') {
          return this.getWorkflow(workflow.id)
            .then((published) => {
              return this._nac.default
                .getWorkflowEndpoints(published.id)
                .then((response) => {
                  if (response.endpoints![0].url!.endsWith('published//instances')) {
                    response.endpoints![0].url = response.endpoints![0].url!.replace(
                      'published//instances',
                      `published/${published.id}/instances`
                    );
                  }
                  const payload = ClientToNACModelHelper.scheduleWorkflowPayload(published, response);
                  return this._nac.default
                    .scheduleWorkflow(published.id, payload)
                    .then((response) => {
                      console.log(response);
                      return this.getWorkflow(published.id);
                    })
                    .catch((error: ApiError) => Promise.reject(error));
                })
                .catch((error: ApiError) => Promise.reject(error));
            })
            .catch((error: ApiError) => Promise.reject(error));
        } else {
          return this.getWorkflow(workflow.id);
        }
      })
      .catch((error: ApiError) => Promise.reject(error));
  }

  @CacheClear({ cacheKey: 'workflow' })
  public saveWorkflow(workflow: Workflow): Promise<Workflow> {
    if (workflow.permissions.filter((p) => p.isUser).length === 0) {
      workflow.permissions.push(everyonePermission(true, false));
    }
    this.ensureCorrectAuthorInDefinition(workflow);
    return this._nac.default
      .saveWorkflow(workflow.id, ClientToNACModelHelper.updateWorkflowPayload(workflow))
      .then((response) => this.getWorkflow(response.workflowId).then((workflow) => workflow))
      .catch((error: ApiError) => Promise.reject(error))
      .catch((error: ApiError) => Promise.reject(error));
  }

  private ensureCorrectAuthorInDefinition(workflow: Workflow) {
    if (workflow.definition.settings.author.tenantId !== this._tenant.id) {
      workflow.definition.settings.author.displayName = this._user.name;
      workflow.definition.settings.author.email = workflow.info.author.email;
      workflow.definition.settings.author.firstName = workflow.info.author.firstName;
      workflow.definition.settings.author.id = workflow.info.author.id;
      workflow.definition.settings.author.lastName = workflow.info.author.lastName;
      workflow.definition.settings.author.name = workflow.info.author.name;
      workflow.definition.settings.author.nintexTenantId = '00000000-0000-0000-0000-000000000000';
      workflow.definition.settings.author.roles = this._user.roles;
      workflow.definition.settings.author.tenantId = this._tenant.id;
      workflow.definition.settings.author.tenantName = this._tenant.name;
    }
  }
}
