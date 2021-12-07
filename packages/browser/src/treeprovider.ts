import { INWCConnectionInfo, INWCDataSource, INWCWorkflowInfo, INWCWorkflowSource, NWCTenant } from '@nwc-sdk/sdk'
import * as vscode from 'vscode'
import { NWCExplorerTreeNodeType } from './enums'
import { IConfiguration } from './settings'

export class NWCExplorerTreeNode extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public type: NWCExplorerTreeNodeType,
		public parent: NWCExplorerTreeNode | undefined = undefined,
		public data?: any,
		public additionalData?: any
	) {
		super(label, collapsibleState)
		this.contextValue = type
		switch (type) {
			case NWCExplorerTreeNodeType.nwcTenant:
				this.id = (data as NWCTenant).tenantInfo.id
				break
			case (NWCExplorerTreeNodeType.workflows, NWCExplorerTreeNodeType.datasources, NWCExplorerTreeNodeType.connections):
				this.id = `${parent!.id}_${type}`
				break
			case NWCExplorerTreeNodeType.workflow:
				this.id = (data as INWCWorkflowInfo).id
				break
			case NWCExplorerTreeNodeType.datasource:
				this.id = (data as INWCDataSource).id
				break
			case NWCExplorerTreeNodeType.connection:
				this.id = (data as INWCConnectionInfo).id
				break
			default:
				break
		}
	}
}

export class NWCTenantsTreeNodeDataProvider implements vscode.TreeDataProvider<NWCExplorerTreeNode> {
	private _onDidChangeTreeData: vscode.EventEmitter<NWCExplorerTreeNode | undefined> = new vscode.EventEmitter<NWCExplorerTreeNode | undefined>()
	readonly onDidChangeTreeData: vscode.Event<NWCExplorerTreeNode | undefined> = this._onDidChangeTreeData.event

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined)
	}

	getTreeItem(element: NWCExplorerTreeNode): vscode.TreeItem {
		console.log(element.id)
		return element
	}

	getChildren(element?: NWCExplorerTreeNode): Thenable<NWCExplorerTreeNode[]> {
		if (element) {
			console.log(element.type)
			switch (element.type) {
				case NWCExplorerTreeNodeType.nwcTenant:
					return this.populateTenantNode(element)
				case NWCExplorerTreeNodeType.workflows:
					return this.populateTenantWorkflowsNode(element)
				case NWCExplorerTreeNodeType.workflow:
					return this.populateTenantWorkflowNode(element)
				case NWCExplorerTreeNodeType.datasources:
					return this.populateTenantDatasourcesNode(element)
				case NWCExplorerTreeNodeType.connections:
					return this.populateTenantConnectionsNode(element)
				case NWCExplorerTreeNodeType.workflowConnections:
					return this.populateWorkflowConnectionsNode(element)
				default:
					break
			}
		} else {
			return this.generateTenantNodes()
		}
		return Promise.resolve([])
	}

	private async populateWorkflowConnectionsNode(element: NWCExplorerTreeNode): Promise<NWCExplorerTreeNode[]> {
		const workflowSource: INWCWorkflowSource = element.parent!.additionalData
		const nodes: NWCExplorerTreeNode[] = []

		for (const contractId in workflowSource.workflowDefinitionAsObject!.inUseXtensions) {
			let title = workflowSource.workflowDefinitionAsObject!.inUseXtensions[contractId].xtension?.info.title
			if (title === undefined || title === null || title === '') {
				title = contractId
			}
			nodes.push(new NWCExplorerTreeNode(title, vscode.TreeItemCollapsibleState.Collapsed, NWCExplorerTreeNodeType.workflowConnection, element))
		}
		return Promise.resolve(nodes)
	}

	private async populateTenantWorkflowNode(element: NWCExplorerTreeNode): Promise<NWCExplorerTreeNode[]> {
		const workflowInfo: INWCWorkflowInfo = element.data
		const tenant: NWCTenant = this.getTenant(element)

		const source = await tenant.getWorkflowSource(workflowInfo.id)
		element.additionalData = source

		return Promise.resolve([
			new NWCExplorerTreeNode(
				NWCExplorerTreeNodeType.workflowConnections.split(' ')[1],
				vscode.TreeItemCollapsibleState.Collapsed,
				NWCExplorerTreeNodeType.workflowConnections,
				element
			),
			new NWCExplorerTreeNode(
				NWCExplorerTreeNodeType.workflowDatasources.split(' ')[1],
				vscode.TreeItemCollapsibleState.Collapsed,
				NWCExplorerTreeNodeType.workflowDatasources,
				element
			),
			new NWCExplorerTreeNode(
				NWCExplorerTreeNodeType.workflowForms.split(' ')[1],
				vscode.TreeItemCollapsibleState.Collapsed,
				NWCExplorerTreeNodeType.workflowForms,
				element
			),
			new NWCExplorerTreeNode(
				NWCExplorerTreeNodeType.workflowTags.split(' ')[1],
				vscode.TreeItemCollapsibleState.Collapsed,
				NWCExplorerTreeNodeType.workflowTags,
				element
			),
		])
	}

	private getTenant(element: NWCExplorerTreeNode) {
		let currentElement = element
		while (currentElement.parent !== undefined) {
			currentElement = currentElement.parent
		}
		return currentElement.data as NWCTenant
	}

	private async populateTenantDatasourcesNode(element: NWCExplorerTreeNode): Promise<NWCExplorerTreeNode[]> {
		const tenant: NWCTenant = this.getTenant(element)
		const datasources = await tenant.getDataSources()
		return Promise.resolve(
			datasources.map(ds => new NWCExplorerTreeNode(ds.name, vscode.TreeItemCollapsibleState.Collapsed, NWCExplorerTreeNodeType.datasource, element, ds))
		)
	}

	private async populateTenantConnectionsNode(element: NWCExplorerTreeNode): Promise<NWCExplorerTreeNode[]> {
		const tenant: NWCTenant = element.parent!.data
		const connections = await tenant.getConnections()
		return Promise.resolve(
			connections.map(cn => new NWCExplorerTreeNode(cn.displayName, vscode.TreeItemCollapsibleState.Collapsed, NWCExplorerTreeNodeType.datasource, element, cn))
		)
	}

	private async populateTenantWorkflowsNode(element: NWCExplorerTreeNode): Promise<NWCExplorerTreeNode[]> {
		const tenant: NWCTenant = element.parent!.data
		const workflows = await tenant.getWorkflows()
		return Promise.resolve(Promise.all(workflows.map(wfl => this.createWorkflowNode(tenant, wfl, element))))
	}

	private async createWorkflowNode(tenant: NWCTenant, workflow: INWCWorkflowInfo, parent: NWCExplorerTreeNode): Promise<NWCExplorerTreeNode> {
		return tenant.getWorkflowSource(workflow.id).then(source => {
			source.workflowDefinition = ''
			return new NWCExplorerTreeNode(workflow.name, vscode.TreeItemCollapsibleState.Collapsed, NWCExplorerTreeNodeType.workflow, parent, workflow, source)
		})
	}

	private populateTenantNode(element: NWCExplorerTreeNode) {
		return Promise.resolve([
			new NWCExplorerTreeNode(NWCExplorerTreeNodeType.workflows, vscode.TreeItemCollapsibleState.Collapsed, NWCExplorerTreeNodeType.workflows, element),
			new NWCExplorerTreeNode(NWCExplorerTreeNodeType.connections, vscode.TreeItemCollapsibleState.Collapsed, NWCExplorerTreeNodeType.connections, element),
			new NWCExplorerTreeNode(NWCExplorerTreeNodeType.datasources, vscode.TreeItemCollapsibleState.Collapsed, NWCExplorerTreeNodeType.datasources, element),
		])
	}

	private async generateTenantNodes(): Promise<NWCExplorerTreeNode[]> {
		const nodes: NWCExplorerTreeNode[] = []
		const configuration = vscode.workspace.getConfiguration().get<IConfiguration>('nwcExplorer')
		if (configuration) {
			for (const cred of configuration.connections) {
				const tenant = await NWCTenant.connectWithClientAppCredentials(cred, undefined, false)
				nodes.push(
					new NWCExplorerTreeNode(tenant.tenantInfo.name, vscode.TreeItemCollapsibleState.Collapsed, NWCExplorerTreeNodeType.nwcTenant, undefined, tenant)
				)
			}
		}
		return Promise.resolve(nodes)
	}
}
