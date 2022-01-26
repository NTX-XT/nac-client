import { Sdk } from "@nwc-sdk/client";
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
		this.id = type === TreeNodeType.nwcTenant ? (data as Sdk).tenant.id : this.treeNodeId(this)
		this.iconPath = this.getNodeIcon(type)
	}

	private treeNodeId = (node: TreeNode): string =>
		`${node.parent ? node.parent.id : ''}${node.parent ? '_' : ''}${node.data === undefined ? node.type : (node.data.id ? node.data.id : node.data.key)}`

	private getNodeIcon = (type: TreeNodeType): vscode.ThemeIcon | undefined => {
		switch (type) {
			case TreeNodeType.nwcTenant:
				return new vscode.ThemeIcon("globe")
			case TreeNodeType.workflow:
				return new vscode.ThemeIcon("type-hierarchy-sub")
			case TreeNodeType.datasource:
			case TreeNodeType.connection:
			case TreeNodeType.workflowConnection:
				return new vscode.ThemeIcon("debug-disconnect")
			case TreeNodeType.connectionAction:
				return new vscode.ThemeIcon("layout")
			default:
				return undefined
		}
	}
}
