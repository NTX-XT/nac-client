import { ConnectionInfo, Datasource, Sdk, WorkflowInfo } from "@nwc-sdk/client";
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
				break;
			case (TreeNodeType.workflows):
				this.id = `${parent!.id}_${type}`;
				break;
			case (TreeNodeType.datasources):
				this.id = `${parent!.id}_${type}`;
				break;
			case (TreeNodeType.connections):
				this.id = `${parent!.id}_${type}`;
				break;
			case TreeNodeType.workflow:
				this.id = (data as WorkflowInfo).id;
				break;
			case TreeNodeType.datasource:
				this.id = (data as Datasource).id;
				break;
			case TreeNodeType.connection:
				this.id = (data as ConnectionInfo).id;
				break;
			default:
				break;
		}
	}
}
