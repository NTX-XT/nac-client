import axios from 'axios'
import { INWCWorkflowSource } from './model/INWCWorkflowSource'
import { INWCConnectionInfo } from './model/INWCConnectionInfo'
import { INWCConnectorInfo } from './model/INWCConnectorInfo'
import { INWCClientAppCredentials } from './model/INWCClientAppCredentials'
import { INWCWorkflowInfo } from './model/INWCWorkflowInfo'
import { INWCTenantInfo } from './model/INWCTenantInfo'
import * as endpoints from './endpoints.json'
import { INWCUser } from './model/INWCUser'
import { INWCImportedWorkflowResponse } from './model/INWCImportWorkflowResponse'
import { INWCWorkflowPublishPayload } from './model/INWCWorkflowPublishPayload'
import { INWCDataSource, INWCDatasourceContract } from './model/INWCDatasource'
import { INWCTenantDetails } from './model/INWCTenantDetails'
import color, { echo } from 'colorts'
import { IExecutionContextConfiguration } from './model/IExecutionContextConfiguration'
import fs from 'fs-extra'
import path from 'path'

enum LogStyle {
	Default,
	Start,
	Warning,
	Error,
	Success,
}

class NWCSDKLogger {
	public logToConsole: boolean

	public constructor(logToConsole: boolean = false) {
		this.logToConsole = logToConsole
	}

	public writeStart(message: string) {
		this.write(message, LogStyle.Start)
	}

	public writeWarning(message: string) {
		this.write(message, LogStyle.Warning)
	}

	public writeError(message: string) {
		this.write(message, LogStyle.Error)
	}

	public writeSuccess(message: string) {
		this.write(message, LogStyle.Success)
	}

	public write(message: string, style: LogStyle = LogStyle.Default) {
		if (this.logToConsole) {
			switch (style) {
				case LogStyle.Start:
					echo(color(message).white.bold)
					break
				case LogStyle.Error:
					echo(color(message).red.bold)
					break
				case LogStyle.Success:
					echo(color(message).green.bold)
					break
				case LogStyle.Warning:
					echo(color(message).yellow.bold)
					break
				default:
					echo(color(message).gray)
					break
			}
		}
	}
}

export class DefaultExecutionContextConfiguration implements IExecutionContextConfiguration {
	public key: string = 'default'
	public outputFolderPath: string = './config'
	public configFolderPath: string = './output'
	public ensureUniqueOutputFolder: boolean = true
}
export class ExecutionContext {
	public configuration: IExecutionContextConfiguration
	public resolvedConfigPath: string
	public resolvedOutputPath: string

	public constructor(tenant: NWCTenant, configuration?: IExecutionContextConfiguration, key?: string) {
		if (!configuration && !key) {
			throw new Error('Neither a configuration or a key was specified')
		}
		if (!configuration && key) {
			configuration = new DefaultExecutionContextConfiguration()
			configuration.key = key
		}
		this.configuration = configuration!
		this.resolvedConfigPath = path.resolve(this.configuration.configFolderPath)
		this.resolvedOutputPath = this.configuration.ensureUniqueOutputFolder
			? path.resolve(path.join(this.configuration.outputFolderPath, new Date().toISOString().split(':').join('-').replace('.', '-')))
			: path.resolve(this.configuration.outputFolderPath)

		tenant.log.writeError(`Ensuring config path: ${this.resolvedConfigPath}`)
		fs.ensureDirSync(this.resolvedConfigPath)
		tenant.log.writeError(`Ensuring output path: ${this.resolvedOutputPath}`)
		fs.ensureDirSync(this.resolvedOutputPath)
	}

	public getConfigurationFilePath(fileName: string): string {
		return path.join(this.resolvedConfigPath, fileName)
	}

	public getOutputFilePath(fileName: string): string {
		return path.join(this.resolvedOutputPath, fileName)
	}
}

export class NWCTenant {
	private static defaultApiManagerUrl = 'https://us.nintex.io'
	private static defaultHost = NWCTenant.getDefaultHost()
	private clientAppCredentials?: INWCClientAppCredentials
	private token?: string
	private dataSourceToken?: string
	public tenantInfo: INWCTenantInfo
	public currentUser: INWCUser
	public connections: INWCConnectionInfo[]
	public connectors: INWCConnectorInfo[]
	public workflows: INWCWorkflowInfo[]
	public datasources: INWCDataSource[]
	public datasourceContracts: INWCDatasourceContract[]
	public log: NWCSDKLogger
	//public executionContext: ExecutionContext

	private constructor(executionContextConfiguration: IExecutionContextConfiguration) {
		this.tenantInfo = {} as INWCTenantInfo
		this.clientAppCredentials = {} as INWCClientAppCredentials
		this.currentUser = {} as INWCUser
		this.connections = [] as INWCConnectionInfo[]
		this.connectors = [] as INWCConnectorInfo[]
		this.workflows = [] as INWCWorkflowInfo[]
		this.datasources = [] as INWCDataSource[]
		this.datasourceContracts = [] as INWCDatasourceContract[]
		this.log = new NWCSDKLogger(false)
		//this.executionContext = new ExecutionContext(this, executionContextConfiguration)
	}

	public setLogging(logToConsole: boolean) {
		this.log.logToConsole = logToConsole
	}

	private getEndpoint(endpointTemplate: string, workflowInfo?: INWCWorkflowInfo): string {
		let endpoint = endpointTemplate.replace('{{apiManagerUrl}}', this.tenantInfo.apiManagerUrl ? this.tenantInfo.apiManagerUrl : NWCTenant.defaultApiManagerUrl)
		if (workflowInfo !== null && workflowInfo !== undefined) {
			endpoint = endpoint.replace('{{workflowId}}', workflowInfo.id).replace('{{workflowName}}', workflowInfo.name)
		}
		return endpoint
	}

	private static getDefaultHost(): string {
		return NWCTenant.defaultApiManagerUrl.split('//')[1]
	}

	private getRequestHeaders(token?: string) {
		return {
			Authorization: `Bearer ${token ? token : this.token}`,
			'Content-Type': 'application/json',
			'Accept-Encoding': 'gzip, deflate, br',
			Host: this.tenantInfo?.host ? this.tenantInfo?.host : NWCTenant.defaultHost,
		}
	}

	public async get(endpointTemplate: string, workflowInfo?: INWCWorkflowInfo, token?: string): Promise<any> {
		const endpoint = this.getEndpoint(endpointTemplate, workflowInfo)
		this.log.write(`Executing get from ${endpoint}`)
		await this.validateConnection(true)
		try {
			const result = await axios.get(endpoint, {
				headers: this.getRequestHeaders(token),
			})
			return result.data
		} catch (error) {
			this.handleError(error)
		}
	}

	private async delete(endpointTemplate: string, workflowInfo?: INWCWorkflowInfo): Promise<any> {
		const endpoint = this.getEndpoint(endpointTemplate, workflowInfo)
		this.log.write(`Executing delete to ${endpoint}`)
		await this.validateConnection(true)
		try {
			const result = await axios.delete(endpoint, {
				headers: this.getRequestHeaders(),
			})
			return result.data
		} catch (error) {
			this.handleError(error)
		}
	}

	private async post(endpointTemplate: string, payload?: any, workflowInfo?: INWCWorkflowInfo) {
		const endpoint = this.getEndpoint(endpointTemplate, workflowInfo)
		this.log.write(`Executing post to ${endpoint}`)
		await this.validateConnection(true)
		try {
			const result = await axios.post(endpoint, payload, {
				headers: this.getRequestHeaders(),
			})
			return result.data
		} catch (error) {
			this.handleError(error)
		}
	}

	private handleError(error: any): any {
		throw new Error(error)
	}

	private async getToken(): Promise<string | undefined> {
		if (this.token) return this.token
		if (this.clientAppCredentials) {
			const endpoint = this.getEndpoint(endpoints.AppTokenEndpointTemplate)
			const payload = {
				client_id: this.clientAppCredentials.clientId,
				client_secret: this.clientAppCredentials.clientSecret,
				grant_type: 'client_credentials',
			}
			this.log.write(`Getting authentication token from ${endpoint}`)
			try {
				const result = await axios.post(endpoint, payload, {
					headers: {
						'Content-Type': 'application/json',
					},
				})
				return result.data.access_token
			} catch (error) {
				this.handleError(error)
				return undefined
			}
		} else {
			return undefined
		}
	}

	private async validateConnection(throwOnError: boolean = true): Promise<boolean> {
		if (!this.token) {
			this.token = await this.getToken()
		}
		if (!this.token && throwOnError) {
			this.handleError('Authentication failed')
		}
		return this.token != undefined
	}

	private async getDatasourceToken() {
		const dataSourceTokenRequest = await this.get(endpoints.DatasourceTokenEndpointTemplate)
		this.dataSourceToken = dataSourceTokenRequest.token
	}

	private async getTenantInfo() {
		const details: INWCTenantDetails = await this.get(endpoints.TenantInfoEndpointTemplate.replace('{{apiManagerUrl}}', 'https://us.nintex.io'))
		this.currentUser = details.user
		this.tenantInfo.apiManagerUrl = details.apiManagerUrl
		this.tenantInfo.host = details.apiManagerUrl.split('//')[1]
		this.tenantInfo.id = details.user.tenantId
		this.tenantInfo.name = details.user.tenantName ? details.user.tenantName : details.user.tenantId
		this.tenantInfo.serviceRegion = details.serviceRegion
		this.tenantInfo.cloudElementService = details.cloudElementService
	}

	public static async connectWithToken(
		token: string,
		tenantName?: string,
		retrieveTenantData: boolean = true,
		enableLogging: boolean = true,
		executionContextConfiguration?: IExecutionContextConfiguration
	): Promise<NWCTenant> {
		return await this.connect(token, undefined, tenantName, retrieveTenantData, enableLogging, executionContextConfiguration)
	}
	public static async connectWithClientAppCredentials(
		clientAppCredentials: INWCClientAppCredentials,
		tenantName?: string,
		retrieveTenantData: boolean = true,
		enableLogging: boolean = true,
		executionContextConfiguration?: IExecutionContextConfiguration
	): Promise<NWCTenant> {
		return await this.connect(undefined, clientAppCredentials, tenantName, retrieveTenantData, enableLogging, executionContextConfiguration)
	}
	private static async connect(
		token?: string,
		clientAppCredentials?: INWCClientAppCredentials,
		tenantName?: string,
		retrieveTenantData: boolean = true,
		enableLogging: boolean = true,
		executionContextConfiguration?: IExecutionContextConfiguration
	): Promise<NWCTenant> {
		const tenant = new NWCTenant(executionContextConfiguration ? executionContextConfiguration : new DefaultExecutionContextConfiguration())
		tenant.setLogging(enableLogging)
		tenant.token = token
		tenant.clientAppCredentials = clientAppCredentials
		tenant.token = await tenant.getToken()
		if (await tenant.validateConnection()) {
			await tenant.getTenantInfo()
			await tenant.getDatasourceToken()
			if (retrieveTenantData) {
				await tenant.retrieveTenantData()
			}
		}
		if (tenant.tenantInfo.name === tenant.tenantInfo.id) {
			if (tenantName) {
				tenant.tenantInfo.name = tenantName
			} else if (clientAppCredentials?.tenantName) {
				tenant.tenantInfo.name = clientAppCredentials!.tenantName
			}
		}
		return tenant
	}

	public async retrieveTenantData() {
		this.connections = await this.get(endpoints.ConnectionsEndpointTemplate)
		this.connectors = (await this.get(endpoints.ConnectorsEndpointTemplate)).connectors
		this.workflows = (await this.get(endpoints.WorkflowsEndpointTemplate)).workflows
		this.datasources = await this.get(endpoints.DatasourcesEndpointTemplate, undefined, this.dataSourceToken)
		this.datasourceContracts = await this.get(endpoints.ContractsEndpointTemplate, undefined, this.dataSourceToken)
	}

	public async getWorkflow(workflowId: string): Promise<INWCWorkflowInfo> {
		return this.get(endpoints.WorkflowEndpointTemplate, {
			id: workflowId,
		} as INWCWorkflowInfo).then(data => {
			return data.workflow
		})
	}

	public getConnectionsOfConnector(connectorName: string, includeInvalid: boolean = false): INWCConnectionInfo[] {
		const connections = this.connections.filter(c => c.contractName == connectorName)
		return includeInvalid ? connections : connections.filter(c => c.isInvalid === false)
	}

	public async getWorkflowSource(workflowId: string): Promise<INWCWorkflowSource> {
		return this.get(endpoints.WorkflowSourceEndpointTemplate, {
			id: workflowId,
		} as INWCWorkflowInfo).then((data: INWCWorkflowSource) => {
			data.workflowDefinitionAsObject = JSON.parse(data.workflowDefinition)
			return data
		})
	}

	public async deleteWorkflowSource(workflowId: string): Promise<void> {
		return this.delete(endpoints.PublishWorkflowEndpointTemplate, {
			id: workflowId,
		} as INWCWorkflowInfo)
	}

	public async checkIfWorkflowExists(workflowName: string): Promise<boolean> {
		return this.get(endpoints.CheckWorkflowNameEndpointTemplate, {
			name: workflowName,
		} as INWCWorkflowInfo)
			.then(data => {
				return data === 'Not Found' ? false : true
			})
			.catch(() => {
				return false
			})
	}

	public async exportWorkflow(workflowId: string): Promise<string> {
		return this.post(
			endpoints.ExportWorkflowEndpointTemplate,
			{
				isNonExpiring: true,
			},
			{
				id: workflowId,
			} as INWCWorkflowInfo
		).then(data => {
			return data.key
		})
	}

	public async importWorkflow(workflowExportKey: string, workflowName: string): Promise<INWCImportedWorkflowResponse> {
		const payload = JSON.stringify({
			key: workflowExportKey,
			name: workflowName,
		})
		return this.post(endpoints.ImportWorkflowEndpointTemplate, payload)
	}

	public async publishWorkflow(workflowId: string, payload: INWCWorkflowPublishPayload): Promise<INWCWorkflowSource> {
		return this.post(endpoints.PublishWorkflowEndpointTemplate, payload, {
			id: workflowId,
		} as INWCWorkflowInfo)
	}
}
