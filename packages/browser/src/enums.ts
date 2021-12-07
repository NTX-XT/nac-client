/* eslint-disable no-use-before-define */
export enum RunningPromiseStatus {
	pending,
	resolved,
	rejected,
}

export enum SortDirection {
	ascending,
	descending,
}

export function getNodeType(nodeType: string): NWCExplorerTreeNodeType {
	return NWCExplorerTreeNodeType[nodeType as keyof typeof NWCExplorerTreeNodeType]
}

export enum NWCExplorerTreeNodeType {
	nwcTenant = 'Tenant',
	connectors = 'Connectors',
	connector = 'Connector',
	workflows = 'Workflows',
	workflow = 'Workflow',
	workflowConnections = 'Workflow Connections',
	workflowConnection = 'Workflow Connection',
	workflowDatasources = 'Workflow Datasources',
	workflowTags = 'Workflow Tags',
	workflowForms = 'Workflow Forms',
	connections = 'Connections',
	datasource = 'Datasource',
	datasources = 'Datasources',
	connection = 'Connection',
}
