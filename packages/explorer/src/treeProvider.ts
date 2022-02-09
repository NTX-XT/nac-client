import { ApiError, Sdk, UsedConnection, UsedConnector, Workflow, WorkflowInfo, ConnectionAction, Connector, invalidId, Contract } from "@nwc-sdk/client"
import { WorkflowDependency } from "client/dist/sdk/models/parsedWorkflowDefinition"
import * as vscode from 'vscode'
import { TreeNodeType } from './enums'
import { IConfiguration } from './settings'
import { TreeNode } from "./treeNode"

export class TreeProvider implements vscode.TreeDataProvider<TreeNode> {
	private _onDidChangeTreeData: vscode.EventEmitter<TreeNode | undefined> = new vscode.EventEmitter<TreeNode | undefined>()
	readonly onDidChangeTreeData: vscode.Event<TreeNode | undefined> = this._onDidChangeTreeData.event

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined)
	}

	getTreeItem(element: TreeNode): vscode.TreeItem {
		console.log(element.id)
		return element
	}

	getChildren(element?: TreeNode): Thenable<TreeNode[]> {
		if (element) {
			console.log(element.type)
			switch (element.type) {
				case TreeNodeType.nwcTenant:
					return this.populateTenant(element)
				case TreeNodeType.workflows:
					return this.populateTenantWorkflows(element)
				case TreeNodeType.workflow:
					return this.populateTenantWorkflow(element)
				case TreeNodeType.contracts:
					return this.populateTenantContracts(element)
				case TreeNodeType.contract:
					return this.populateTenantDatasources(element)
				case TreeNodeType.connectors:
					return this.populateTenantConnectors(element)
				case TreeNodeType.connector:
					return this.populateTenantConnections(element)
				case TreeNodeType.workflowConnections:
					return this.populateWorkflowConnectors(element)
				case TreeNodeType.workflowConnector:
					return this.populateUsedConnector(element)
				case TreeNodeType.workflowConnection:
					return this.populateUsedConnection(element)
				case TreeNodeType.workflowTags:
					return this.populateWorkflowTags(element)
				case TreeNodeType.workflowDependencies:
					return this.populateWorkflowDependencies(element)
				case TreeNodeType.workflowDependency:
					return this.populateDependency(element)
				case TreeNodeType.connectionAction:
					return this.populateConnectionAction(element)
				default:
					break
			}
		} else {
			return this.populateTenants()
		}
		return Promise.resolve([])
	}

	private populateConnectionAction(element: TreeNode): Promise<TreeNode[]> {
		const action: ConnectionAction = element.data
		const nodes: TreeNode[] = []
		for (const configItem of action.configuration) {
			const node = new TreeNode(configItem.name, vscode.TreeItemCollapsibleState.None, TreeNodeType.actionConfiguration, element, configItem)
			switch (configItem.type) {
				case "value":
					node.iconPath = new vscode.ThemeIcon("text-size")
					break;
				case "variable":
					node.iconPath = new vscode.ThemeIcon("symbol-variable")
					break;
				case "dictionary":
					node.iconPath = new vscode.ThemeIcon("symbol-array")
					break;
				default:
					node.iconPath = new vscode.ThemeIcon("warning")
					break;
			}
			nodes.push(node)
		}
		return Promise.resolve(nodes)
	}

	private populateUsedConnection(element: TreeNode): Promise<TreeNode[]> {
		const connector: UsedConnection = element.data
		const nodes: TreeNode[] = []
		if (connector && connector.actions) {
			for (const usedAction of connector.actions) {
				nodes.push(new TreeNode(usedAction.name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.connectionAction, element, usedAction))
			}
		}
		return Promise.resolve(nodes)
	}

	private populateDependency(element: TreeNode): Promise<TreeNode[]> {
		const dependency: WorkflowDependency = element.data
		const nodes: TreeNode[] = []
		if (dependency && dependency.actions) {
			for (const usedAction of dependency.actions) {
				nodes.push(new TreeNode(usedAction.name, vscode.TreeItemCollapsibleState.None, TreeNodeType.dependencyAction, element, usedAction))
			}
		}
		return Promise.resolve(nodes)
	}

	private populateUsedConnector(element: TreeNode): Promise<TreeNode[]> {
		const connector: UsedConnector = element.data
		const nodes: TreeNode[] = []
		if (connector.connections) {
			for (const cn of Object.keys(connector.connections)) {
				nodes.push(new TreeNode(connector.connections[cn].name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflowConnection, element, connector.connections[cn]))
			}
		}
		return Promise.resolve(nodes)
	}

	private populateWorkflowTags = (element: TreeNode): Promise<TreeNode[]> =>
		Promise.resolve((element.parent!.data as Workflow).tags.map((tag) => new TreeNode(tag, vscode.TreeItemCollapsibleState.None, TreeNodeType.workflowTag, element, tag)))

	private populateWorkflowConnectors(element: TreeNode): Promise<TreeNode[]> {
		const workflow: Workflow = element.parent!.data
		const nodes: TreeNode[] = []
		if (workflow.definition.usedConnectors) {
			for (const cn of Object.keys(workflow.definition.usedConnectors)) {
				nodes.push(new TreeNode(workflow.definition.usedConnectors[cn].name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflowConnector, element, workflow.definition.usedConnectors[cn]))
			}
		}
		return Promise.resolve(nodes)
	}

	private populateWorkflowDependencies(element: TreeNode): Promise<TreeNode[]> {
		const workflow: Workflow = element.parent!.data
		const nodes: TreeNode[] = []
		if (workflow.definition.dependencies) {
			for (const key of Object.keys(workflow.definition.dependencies)) {
				nodes.push(new TreeNode(workflow.definition.dependencies[key].name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflowDependency, element, workflow.definition.dependencies[key]))
			}
		}
		return Promise.resolve(nodes)
	}

	private populateTenantWorkflow = (element: TreeNode): Promise<TreeNode[]> =>
		this.getClient(element).getWorkflow((element.data as WorkflowInfo).id).then((workflow) => {
			element.data = workflow
			return Promise.resolve([
				new TreeNode(TreeNodeType.workflowConnections.split(' ')[1], vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflowConnections, element),
				// new TreeNode(TreeNodeType.workflowDatasources.split(' ')[1], vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflowDatasources, element),
				// new TreeNode(TreeNodeType.workflowForms.split(' ')[1], vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflowForms, element),
				new TreeNode(TreeNodeType.workflowTags.split(' ')[1], vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflowTags, element),
				new TreeNode(TreeNodeType.workflowDependencies.split(' ')[1], vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflowDependencies, element),
			])
		}).catch((error: ApiError) => Promise.reject(error))

	private getClient = (element: TreeNode): Sdk => element.parent === undefined ? element.data as Sdk : this.getClient(element.parent)

	private populateTenantDatasources = (element: TreeNode): Promise<TreeNode[]> =>
		this.getClient(element).getDatasources()
			.then((datasources) => Promise.resolve(
				datasources.filter((ds) =>
					(element.data as Contract).id === invalidId
						? ds.contract === undefined
						: ds.contract && ds.contract.id === (element.data as Contract).id)
					.map(ds => new TreeNode(ds.name, vscode.TreeItemCollapsibleState.None, TreeNodeType.datasource, element, ds))))
			.catch((error: ApiError) => Promise.reject(error))

	private populateTenantConnections = (element: TreeNode): Promise<TreeNode[]> =>
		this.getClient(element).getConnections()
			.then((connections) => Promise.resolve(
				connections.filter((cn) =>
					(element.data as Connector).id === invalidId
						? cn.connector === undefined
						: cn.connector && cn.connector.id === (element.data as Connector).id)
					.map(cn => new TreeNode(cn.name, vscode.TreeItemCollapsibleState.None, TreeNodeType.connection, element, cn))))
			.catch((error: ApiError) => Promise.reject(error))

	private populateTenantConnectors = (element: TreeNode): Promise<TreeNode[]> =>
		this.getClient(element).getConnections()
			.then((connections) => this.getClient(element).groupConnections(connections)
				.then((connectors) => Promise.resolve(connectors.map(cn => new TreeNode(cn.name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.connector, element, cn))))
				.catch((error: ApiError) => Promise.reject(error)))
			.catch((error: ApiError) => Promise.reject(error))

	private populateTenantContracts = (element: TreeNode): Promise<TreeNode[]> =>
		this.getClient(element).getDatasources()
			.then((datasources) => this.getClient(element).groupDatasources(datasources)
				.then((contracts) => Promise.resolve(contracts.map(cn => new TreeNode(cn.name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.contract, element, cn))))
				.catch((error: ApiError) => Promise.reject(error)))
			.catch((error: ApiError) => Promise.reject(error))

	private populateTenantWorkflows = (element: TreeNode): Promise<TreeNode[]> =>
		this.getClient(element).getWorkflowInfos()
			.then((workflows) => Promise.resolve(workflows.map(wfl => new TreeNode(wfl.name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflow, element.parent, wfl))))
			.catch((error: ApiError) => Promise.reject(error))

	private populateTenant = (element: TreeNode) =>
		Promise.resolve([
			new TreeNode(TreeNodeType.workflows, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflows, element),
			new TreeNode(TreeNodeType.connections, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.connectors, element),
			new TreeNode(TreeNodeType.datasources, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.contracts, element),
		])

	private getConfiguration = (): IConfiguration | undefined => vscode.workspace.getConfiguration().get<IConfiguration>('nwcExplorer')

	private populateTenants = (): Promise<TreeNode[]> =>
		this.getConfiguration() === undefined
			? Promise.resolve([])
			: Promise.all(
				this.getConfiguration()!.connections.map(cred => Sdk.connectWithClientCredentials(cred)
					.then((client) => new TreeNode(client.tenant.name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.nwcTenant, undefined, client))
					.catch((error: ApiError) => Promise.reject(error))))

}
