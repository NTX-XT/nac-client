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

export function getNodeType(nodeType: string): TreeNodeType {
	return TreeNodeType[nodeType as keyof typeof TreeNodeType]
}








export enum TreeNodeType {
	nwcTenant = 'Tenant',
	connectors = 'Connectors',
	connector = 'Connector',
	workflows = 'Workflows',
	workflow = 'Workflow',
	workflowConnections = 'Workflow Connections',
	workflowConnector = 'Workflow Connector',
	workflowConnection = 'Workflow Connection',
	workflowDatasources = 'Workflow Datasources',
	workflowTags = 'Workflow Tags',
	workflowTag = 'Workflow Tag',
	workflowForms = 'Workflow Forms',
	connections = 'Connections',
	datasource = 'Datasource',
	datasources = 'Datasources',
	connection = 'Connection',
	contract = 'Contract',
	contracts = 'Contracts',
	connectionAction = 'Connection Action',
	actionConfiguration = 'Action Configuration',
	workflowDependencies = "Workflow Dependencies",
	workflowDependency = "Workflow Dependency",
	dependencyAction = "Dependency Action"
}
