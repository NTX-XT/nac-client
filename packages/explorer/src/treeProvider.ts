import { Sdk, Tenant, UsedConnector, Workflow, WorkflowInfo } from "@nwc-sdk/client"
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
					return this.populateTenantNode(element)
				case TreeNodeType.workflows:
					return this.populateTenantWorkflowsNode(element)
				case TreeNodeType.workflow:
					return this.populateTenantWorkflowNode(element)
				case TreeNodeType.datasources:
					return this.populateTenantDatasourcesNode(element)
				case TreeNodeType.connections:
					return this.populateTenantConnectionsNode(element)
				case TreeNodeType.workflowXtensions:
					return this.populateWorkflowXtensionsNode(element)
				case TreeNodeType.workflowXtension:
					return this.populateWorkflowXtensionNode(element)
				default:
					break
			}
		} else {
			return this.generateTenantNodes()
		}
		return Promise.resolve([])
	}

	private async populateWorkflowXtensionNode(element: TreeNode): Promise<TreeNode[]> {
		const connector: UsedConnector = element.data
		const nodes: TreeNode[] = []
		if (connector.connections) {
			for (const cn of Object.keys(connector.connections)) {
				nodes.push(new TreeNode(connector.connections[cn].name, vscode.TreeItemCollapsibleState.None, TreeNodeType.workflowConnection, element, connector.connections[cn]))
			}
		}
		return Promise.resolve(nodes)
	}

	private async populateWorkflowXtensionsNode(element: TreeNode): Promise<TreeNode[]> {
		const workflow: Workflow = element.parent!.additionalData
		const nodes: TreeNode[] = []
		if (workflow.usedXtensions) {
			for (const cn of Object.keys(workflow.usedXtensions)) {
				nodes.push(new TreeNode(workflow.usedXtensions[cn].name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflowXtension, element, workflow.usedXtensions[cn]))
			}
		}
		return Promise.resolve(nodes)
	}

	private async populateTenantWorkflowNode(element: TreeNode): Promise<TreeNode[]> {
		const workflowInfo: WorkflowInfo = element.data
		const service: Sdk = this.getService(element)

		const source = await service.getWorkflow(workflowInfo.id)
		element.additionalData = source

		return Promise.resolve([
			new TreeNode(
				TreeNodeType.workflowXtensions.split(' ')[1],
				vscode.TreeItemCollapsibleState.Collapsed,
				TreeNodeType.workflowXtensions,
				element
			),
			new TreeNode(
				TreeNodeType.workflowDatasources.split(' ')[1],
				vscode.TreeItemCollapsibleState.Collapsed,
				TreeNodeType.workflowDatasources,
				element
			),
			new TreeNode(
				TreeNodeType.workflowForms.split(' ')[1],
				vscode.TreeItemCollapsibleState.Collapsed,
				TreeNodeType.workflowForms,
				element
			),
			new TreeNode(
				TreeNodeType.workflowTags.split(' ')[1],
				vscode.TreeItemCollapsibleState.Collapsed,
				TreeNodeType.workflowTags,
				element
			),
		])
	}

	private getService(element: TreeNode): Sdk {
		let currentElement = element
		while (currentElement.parent !== undefined) {
			currentElement = currentElement.parent
		}
		return currentElement.data as Sdk
	}

	private async populateTenantDatasourcesNode(element: TreeNode): Promise<TreeNode[]> {
		const service: Sdk = this.getService(element)
		const datasources = await service.getDatasources()
		return Promise.resolve(
			datasources.map(ds => new TreeNode(ds.name, vscode.TreeItemCollapsibleState.None, TreeNodeType.datasource, element, ds))
		)
	}

	private async populateTenantConnectionsNode(element: TreeNode): Promise<TreeNode[]> {
		const service: Sdk = element.parent!.data
		const connections = await service.getConnections()
		return Promise.resolve(
			connections.map(cn => new TreeNode(cn.name, vscode.TreeItemCollapsibleState.None, TreeNodeType.datasource, element, cn))
		)
	}

	private async populateTenantWorkflowsNode(element: TreeNode): Promise<TreeNode[]> {
		const service: Sdk = element.parent!.data
		const workflows = await service.getWorkflowInfos()
		return Promise.resolve(Promise.all(workflows.map(wfl => {
			return new TreeNode(wfl.name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflow, element.parent, wfl)
		}
		)))
	}

	private async createWorkflowNode(service: Sdk, workflow: WorkflowInfo, parent: TreeNode): Promise<TreeNode> {
		const source = await service.getWorkflow(workflow.id)
		return new TreeNode(workflow.name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflow, parent, workflow, source)
	}

	private populateTenantNode(element: TreeNode) {
		return Promise.resolve([
			new TreeNode(TreeNodeType.workflows, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflows, element),
			new TreeNode(TreeNodeType.connections, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.connections, element),
			new TreeNode(TreeNodeType.datasources, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.datasources, element),
		])
	}

	private async generateTenantNodes(): Promise<TreeNode[]> {
		const nodes: TreeNode[] = []
		const configuration = vscode.workspace.getConfiguration().get<IConfiguration>('nwcExplorer')
		if (configuration) {
			return Promise.resolve(Promise.all(configuration.connections.map(cred => {
				return Sdk.connect(cred).then((service) => {
					return new TreeNode(`${service.tenant.name} (${service.tenant.id})`, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.nwcTenant, undefined, service)
				})
			})))
		} else {
			return Promise.resolve([])
		}
	}
}
