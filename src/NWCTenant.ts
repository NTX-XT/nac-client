import axios from 'axios';
import { INWCWorkflowSource } from './model/INWCWorkflowSource';
import { INWCConnectionInfo } from './model/INWCConnectionInfo';
import { INWCConnectorInfo } from './model/INWCConnectorInfo';
import { INWCClientApp as INWCClientAppInfo } from './model/INWCTenantAuthenticationTokens';
import { INWCWorkflowInfo } from './model/INWCWorkflowInfo';
import { INWCTenantInfo } from './model/INWCTenantInfo';
import * as endpoints from './endpoints.json' ;
import { INWCTenantConnectionInfo } from './model/INWCTenantConnectionInfo';
import { INWCUser } from './model/INWCUser';
import {ILogging, LogStyle, LogWithStyle} from "ntx-solutions-utils";
import { INWCImportedWorkflowResponse } from './model/INWCImportWorkflowResponse';
import { INWCWorkflowPublishPayload } from './model/INWCWorkflowPublishPayload';
import { INWCDataSource } from './model/INWCDatasource';
export class NWCTenant implements ILogging {
    private clientAppInfo: INWCClientAppInfo;
    private token?:string;
    private dataSourceToken?: string;
    public tenantInfo: INWCTenantInfo;
    public currentUser: INWCUser;
    public connections: INWCConnectionInfo[];
    public connectors: INWCConnectorInfo[];
    public workflows: INWCWorkflowInfo[];
    public datasources: INWCDataSource[];
    public log: LogWithStyle;
    
    public setLogging(logToConsole: boolean) {
        this.log.logToConsole = logToConsole;
    }

    private getEndpoint(endpointTemplate: string, workflowInfo?: INWCWorkflowInfo) : string {
        let endpoint = endpointTemplate.replace("{{apiManagerUrl}}", this.tenantInfo.apiManagerUrl);
        if (workflowInfo !== null && workflowInfo !== undefined) {
            endpoint = endpoint.replace("{{workflowId}}", workflowInfo.id).replace("{{workflowName}}", workflowInfo.name);
        }
        return endpoint;
    }
    
    public async Authenticate() : Promise<void> {
        const endpoint = this.getEndpoint(endpoints.AppTokenEndpointTemplate);
        const payload = {
            "client_id": this.clientAppInfo.clientId,
            "client_secret": this.clientAppInfo.clientSecret,
            "grant_type": "client_credentials"
        }
        this.log.write(`Getting authentication token from ${endpoint}`);
        try {
            const result = await axios.post(endpoint, payload, {
                headers: {'Content-Type': 'application/json' }
            });
            this.token = result.data.access_token;
        } catch (error) {
            this.handleError(error);
        }
    }

       private getRequestHeaders(token?: string) {
        return {
            'Authorization': `Bearer ${(token) ? token : this.token}`,
            'Content-Type': 'application/json',
            'Accept-Encoding': "gzip, deflate, br",
            'Host': this.tenantInfo.host
        }
    }

    private handleError(error: any): any {
        throw new Error(error);
    }

    public async get(endpointTemplate: string, workflowInfo? :INWCWorkflowInfo, token?: string) : Promise<any> {
        const endpoint = this.getEndpoint(endpointTemplate, workflowInfo);
        this.log.write(`Executing get from ${endpoint}`);
        try {
            const result = await axios.get(endpoint, {
                headers: this.getRequestHeaders(token)
            });
            return result.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    private async delete(endpointTemplate: string, workflowInfo? :INWCWorkflowInfo) : Promise<any> {
        const endpoint = this.getEndpoint(endpointTemplate, workflowInfo);
        this.log.write(`Executing delete to ${endpoint}`);
        try {
            const result = await axios.delete(endpoint, {
                headers: this.getRequestHeaders(endpoint)
            });
            return result.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    private async post(endpointTemplate: string, payload?: any, workflowInfo? :INWCWorkflowInfo) {
        const endpoint = this.getEndpoint(endpointTemplate, workflowInfo);
        this.log.write(`Executing post to ${endpoint}`);
        try {
            const result = await axios.post(endpoint, payload, {
                headers: this.getRequestHeaders(endpoint)
            });
            return result.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    public constructor() {
        this.tenantInfo = {} as INWCTenantInfo;
        this.clientAppInfo = {} as INWCClientAppInfo;
        this.currentUser = {} as INWCUser;
        this.connections = [] as INWCConnectionInfo[];
        this.connectors = [] as INWCConnectorInfo[];
        this.workflows = [] as  INWCWorkflowInfo[];     
        this.datasources = [] as INWCDataSource[];  
        this.log = new LogWithStyle(false);
    }
      

    public async connect(connectionInfo :INWCTenantConnectionInfo, retrieveTenantData: boolean = true ) : Promise<void> {
        this.tenantInfo.apiManagerUrl = `https://${connectionInfo.region}.nintex.io`
        this.tenantInfo.host = this.tenantInfo.apiManagerUrl.split("//")[1];
        this.clientAppInfo.clientId = connectionInfo.clientId;
        this.clientAppInfo.clientSecret = connectionInfo.clientSecret;
        await this.Authenticate();
        this.tenantInfo.details = await this.get(endpoints.TenantInfoEndpointTemplate);
        this.currentUser = this.tenantInfo.details.user;
        this.tenantInfo.apiManagerUrl = this.tenantInfo.apiManagerUrl;
        this.tenantInfo.host = this.tenantInfo.apiManagerUrl.split("//")[1];  
        this.tenantInfo.id =this.tenantInfo.details.user.tenantId;
        this.tenantInfo.name = (connectionInfo.tenantName) ? connectionInfo.tenantName : "undefined";
        const dataSourceTokenRequest = await this.get(endpoints.DatasourceTokenEndpointTemplate);
        this.dataSourceToken = dataSourceTokenRequest.token;

        if (retrieveTenantData) {
            await this.retrieveTenantData();
        }
    }

    public async retrieveTenantData(){
        this.connections = await this.get(endpoints.ConnectionsEndpointTemplate);
        this.connectors = (await this.get(endpoints.ConnectorsEndpointTemplate)).connectors;
        this.workflows = (await this.get(endpoints.WorkflowsEndpointTemplate)).workflows;
        this.datasources = await this.get(endpoints.DatasourcesEndpointTemplate, undefined, this.dataSourceToken);
    }

    public async getWorkflow(workflowId: string) : Promise<INWCWorkflowInfo> {
        return this.get(endpoints.WorkflowEndpointTemplate, { id: workflowId} as INWCWorkflowInfo).then((data) => {return data.workflow});
    }

    public getConnectionsOfConnector(connectorName: string, includeInvalid: boolean = false): INWCConnectionInfo[] {
        const connections = this.connections.filter(c => c.contractName == connectorName);
        return (includeInvalid) ? connections : connections.filter(c => c.isInvalid === false);
    }

    public async getWorkflowSource(workflowId: string) : Promise<INWCWorkflowSource> {
        return this.get(endpoints.WorkflowSourceEndpointTemplate, { id: workflowId} as INWCWorkflowInfo).then((data: INWCWorkflowSource) => {
            data.workflowDefinitionAsObject = JSON.parse(data.workflowDefinition);
            return data;
        });
    }

    public async deleteWorkflowSource(workflowId: string) : Promise<void> {
        return this.delete(endpoints.PublishWorkflowEndpointTemplate, { id: workflowId} as INWCWorkflowInfo);
    }

    public async checkIfWorkflowExists(workflowName:string) : Promise<boolean> {
        return this.get(endpoints.CheckWorkflowNameEndpointTemplate, { name: workflowName} as INWCWorkflowInfo).then((data) => {
            return data === "Not Found" ? false : true;
        }).catch(() => {
            return false;
        });
    }

    public async exportWorkflow(workflowId: string) : Promise<string> {
        return this.post(endpoints.ExportWorkflowEndpointTemplate, {isNonExpiring: true}, { id: workflowId} as INWCWorkflowInfo).then((data) => {
            return data.key;
        });
    }

    public async importWorkflow(workflowExportKey: string, workflowName: string) : Promise<INWCImportedWorkflowResponse> {
        const payload = JSON.stringify({ key: workflowExportKey, name: workflowName });
        return this.post(endpoints.ImportWorkflowEndpointTemplate, payload);
    }

    public async publishWorkflow(workflowId: string, payload:INWCWorkflowPublishPayload) : Promise<INWCWorkflowSource> {
        return this.post(endpoints.PublishWorkflowEndpointTemplate, payload, { id: workflowId} as INWCWorkflowInfo)
    }
}


