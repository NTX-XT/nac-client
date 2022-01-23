import { ApiError, Sdk, Tenant, UsedConnector, Workflow, WorkflowInfo } from "@nwc-sdk/client"
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
				case TreeNodeType.datasources:
					return this.populateTenantDatasources(element)
				case TreeNodeType.connections:
					return this.populateTenantConnections(element)
				case TreeNodeType.workflowConnections:
					return this.populateWorkflowConnectors(element)
				case TreeNodeType.workflowConnector:
					return this.populateUsedConnector(element)
				default:
					break
			}
		} else {
			return this.populateTenants()
		}
		return Promise.resolve([])
	}

	private populateUsedConnector(element: TreeNode): Promise<TreeNode[]> {
		const connector: UsedConnector = element.data
		const nodes: TreeNode[] = []
		if (connector.connections) {
			for (const cn of Object.keys(connector.connections)) {
				nodes.push(new TreeNode(connector.connections[cn].name, vscode.TreeItemCollapsibleState.None, TreeNodeType.workflowConnection, element, connector.connections[cn]))
			}
		}
		return Promise.resolve(nodes)
	}

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

	private populateTenantWorkflow = (element: TreeNode): Promise<TreeNode[]> =>
		this.getClient(element).getWorkflow((element.data as WorkflowInfo).id).then((workflow) => {
			element.data = workflow
			return Promise.resolve([
				new TreeNode(TreeNodeType.workflowConnections.split(' ')[1], vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflowConnections, element),
				// new TreeNode(TreeNodeType.workflowDatasources.split(' ')[1], vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflowDatasources, element),
				// new TreeNode(TreeNodeType.workflowForms.split(' ')[1], vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflowForms, element),
				new TreeNode(TreeNodeType.workflowTags.split(' ')[1], vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflowTags, element),
			])
		}).catch((error: ApiError) => Promise.reject(error))

	private getClient = (element: TreeNode): Sdk => element.parent === undefined ? element.data as Sdk : this.getClient(element.parent)

	private populateTenantDatasources = (element: TreeNode): Promise<TreeNode[]> =>
		this.getClient(element).getDatasources()
			.then((datasources) => Promise.resolve(datasources.map(ds => new TreeNode(ds.name, vscode.TreeItemCollapsibleState.None, TreeNodeType.datasource, element, ds))))
			.catch((error: ApiError) => Promise.reject(error))

	private populateTenantConnections = (element: TreeNode): Promise<TreeNode[]> =>
		this.getClient(element).getConnections()
			.then((connections) => Promise.resolve(connections.map(cn => new TreeNode(cn.name, vscode.TreeItemCollapsibleState.None, TreeNodeType.datasource, element, cn))))
			.catch((error: ApiError) => Promise.reject(error))

	private populateTenantWorkflows = (element: TreeNode): Promise<TreeNode[]> =>
		this.getClient(element).getWorkflowInfos()
			.then((workflows) => Promise.resolve(workflows.map(wfl => new TreeNode(wfl.name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflow, element.parent, wfl))))
			.catch((error: ApiError) => Promise.reject(error))

	private populateTenant = (element: TreeNode) =>
		Promise.resolve([
			new TreeNode(TreeNodeType.workflows, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflows, element),
			new TreeNode(TreeNodeType.connections, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.connections, element),
			new TreeNode(TreeNodeType.datasources, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.datasources, element),
		])

	private getConfiguration = (): IConfiguration | undefined => vscode.workspace.getConfiguration().get<IConfiguration>('nwcExplorer')

	private populateTenants = (): Promise<TreeNode[]> =>
		this.getConfiguration() === undefined
			? Promise.resolve([])
			: Promise.all(
				this.getConfiguration()!.connections.map(cred => Sdk.connectWithClientCredentials(cred)
					.then((client) => new TreeNode(`${client.tenant.name} (${client.tenant.id})`, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.nwcTenant, undefined, client))
					.catch((error: ApiError) => Promise.reject(error))))

}
