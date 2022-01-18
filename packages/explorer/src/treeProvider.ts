import { Sdk, Tenant, Workflow, WorkflowInfo } from "@nwc-sdk/client"
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
				case TreeNodeType.workflowConnections:
					return this.populateWorkflowConnectionsNode(element)
				default:
					break
			}
		} else {
			return this.generateTenantNodes()
		}
		return Promise.resolve([])
	}

	private async populateWorkflowConnectionsNode(element: TreeNode): Promise<TreeNode[]> {
		const workflow: Workflow = element.parent!.additionalData
		const nodes: TreeNode[] = []
		if (workflow.connections) {
			for (const cn of Object.keys(workflow.connections)) {
				nodes.push(new TreeNode(workflow.connections[cn].name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflowConnection, element, workflow.connections[cn]))
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
				TreeNodeType.workflowConnections.split(' ')[1],
				vscode.TreeItemCollapsibleState.Collapsed,
				TreeNodeType.workflowConnections,
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
			datasources.map(ds => new TreeNode(ds.name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.datasource, element, ds))
		)
	}

	private async populateTenantConnectionsNode(element: TreeNode): Promise<TreeNode[]> {
		const service: Sdk = element.parent!.data
		const connections = await service.getConnections()
		return Promise.resolve(
			connections.map(cn => new TreeNode(cn.name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.datasource, element, cn))
		)
	}

	private async populateTenantWorkflowsNode(element: TreeNode): Promise<TreeNode[]> {
		const service: Sdk = element.parent!.data
		const workflows = await service.getWorkflowInfos()
		return Promise.resolve(Promise.all(workflows.map(wfl => {
			return new TreeNode(wfl.name, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflow, element.parent, wfl)
			// try {
			// 	return this.createWorkflowNode(service, wfl, element)
			// } catch (error: any) {
			// 	console.log("ERROR : " + wfl.name)
			// 	return new TreeNode("ERROR", vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.workflow, element.parent, wfl)
			// }
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
			for (const cred of configuration.connections) {
				const service = await Sdk.connect(cred)
				nodes.push(
					new TreeNode(`${service.tenant.name} (${service.tenant.id})`, vscode.TreeItemCollapsibleState.Collapsed, TreeNodeType.nwcTenant, undefined, service)
				)
			}
		}
		return Promise.resolve(nodes)
	}
}
