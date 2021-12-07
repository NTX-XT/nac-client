import { INWCConnectionInfo, INWCDataSource, INWCTenantInfo, INWCWorkflowInfo, INWCWorkflowSource } from "@nwc-sdk/sdk";

export interface INWCPackageWorkflowDatasource {
	id: string
	name: string
	datasourceId?: string
	datasourceName?: string
}
export interface INWCPackageWorkflowConnector {
	id: string
	name: string
	connectionId?: string
}

export interface INWCPackageWorkflow {
	workflowId: string
	workflowName: string
	exportKey: string
	publishedUrl: string
	order: number
	eventManagerSubscription?: any
	connectionData?: { [key: string]: any }
}


export interface INWCPackage {
	key: string
	workflows: INWCPackageWorkflow[]
	connectors: INWCPackageWorkflowConnector[]
	datasources: INWCPackageWorkflowDatasource[]
	sourceTenantInfo: INWCTenantInfo
}

export interface INWCDeployedWorkflow {
	packaged: INWCPackageWorkflow
	deployed?: INWCWorkflowInfo
	publishingErrorSource?: INWCWorkflowSource
	publishedSource?: INWCWorkflowSource
}
export interface INWCPackageDeploymentOutcome {
	tenant: INWCTenantInfo
	connections: INWCConnectionInfo[]
	datasources: INWCDataSource[]
	deployedWorkflows: INWCDeployedWorkflow[]
	completed: boolean
}

