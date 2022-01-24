import { ConnectionAction, ConnectionInfo, Datasource, Sdk, UsedConnection, UsedConnector, WorkflowInfo } from "@nwc-sdk/client";
import * as vscode from 'vscode';
import { TreeNodeType } from './enums';


export class TreeNode extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public type: TreeNodeType,
		public parent: TreeNode | undefined = undefined,
		public data?: any,
		public additionalData?: any
	) {
		super(label, collapsibleState);
		this.contextValue = type;
		switch (type) {
			case TreeNodeType.nwcTenant:
				this.id = (data as Sdk).tenant.id;
				this.iconPath = new vscode.ThemeIcon("globe")
				break;
			case (TreeNodeType.workflows):
				this.id = `${parent!.id}_${type}`;
				this.iconPath = new vscode.ThemeIcon("type-hierarchy-sub")
				break;
			case (TreeNodeType.datasources):
				this.id = `${parent!.id}_${type}`;
				this.iconPath = new vscode.ThemeIcon("debug-disconnect")
				break;
			case (TreeNodeType.connections):
				this.id = `${parent!.id}_${type}`;
				this.iconPath = new vscode.ThemeIcon("debug-disconnect")
				break;
			case TreeNodeType.workflow:
				this.id = (data as WorkflowInfo).id;
				this.iconPath = new vscode.ThemeIcon("type-hierarchy-sub")
				break;
			case TreeNodeType.datasource:
				this.id = (data as Datasource).id;
				this.iconPath = new vscode.ThemeIcon("debug-disconnect")
				break;
			case TreeNodeType.connection:
				this.id = (data as ConnectionInfo).id;
				this.iconPath = new vscode.ThemeIcon("debug-disconnect")
				break;
			case TreeNodeType.workflowConnections:
				this.id = `${parent!.id}_${type}`;
				this.iconPath = new vscode.ThemeIcon("debug-disconnect")
				break;
			case TreeNodeType.workflowConnection:
				this.id = `${parent!.id}_${(data as UsedConnection).id}`;
				this.iconPath = new vscode.ThemeIcon("debug-disconnect")
				break;
			case TreeNodeType.workflowConnector:
				this.id = `${parent!.id}_${(data as UsedConnector).id}`;
				this.iconPath = new vscode.ThemeIcon("debug-disconnect")
				break;
			case TreeNodeType.connectionAction:
				this.id = (data as ConnectionAction).id;
				this.iconPath = new vscode.ThemeIcon("layout")
				break;
			default:
				break;
		}
	}
}
