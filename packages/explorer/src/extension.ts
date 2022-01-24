
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { TreeProvider } from './treeProvider'
import { TreeNode } from "./treeNode"

let provider: TreeProvider

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
	console.log(context.globalStorageUri)

	provider = new TreeProvider()

	vscode.window.registerTreeDataProvider('tenants', provider)
	vscode.commands.registerCommand('tenants.edit', () => {
		const setting: vscode.Uri = context.globalStorageUri
		vscode.workspace.openTextDocument(setting)
	})
	vscode.commands.registerCommand('tenants.refresh', () => provider.refresh())
	vscode.commands.registerCommand('tenants.viewData', async (node: TreeNode) => {
		const data = node.additionalData ? node.additionalData : node.data
		const doc = await vscode.workspace.openTextDocument({ content: JSON.stringify(data), language: 'json' })
		const formatedTexts = (await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', doc.uri)) as vscode.TextEdit[]
		const edit = new vscode.WorkspaceEdit()
		for (const text of formatedTexts) {
			edit.replace(doc.uri, text.range, text.newText)
		}
		await vscode.workspace.applyEdit(edit)
		await vscode.window.showTextDocument(doc)
	})
}

// this method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() { }
