
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { INWCClientAppCredentials } from '@nwc-sdk/sdk'
import * as vscode from 'vscode'
import { NWCExplorerTreeNode, NWCTenantsTreeNodeDataProvider } from './treeprovider'

let _nwcTenantsProvider: NWCTenantsTreeNodeDataProvider

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
	console.log(context.globalStorageUri)

	// var ss = vscode.workspace.getConfiguration('nwcExplorer')
	//	_settings = Settings.load(context)

	_nwcTenantsProvider = new NWCTenantsTreeNodeDataProvider()

	vscode.window.registerTreeDataProvider('nwcTenants', _nwcTenantsProvider)
	vscode.commands.registerCommand('nwcTenants.edit', () => {
		const setting: vscode.Uri = context.globalStorageUri
		vscode.workspace.openTextDocument(setting)
	})
	vscode.commands.registerCommand('nwcTenants.refresh', () => _nwcTenantsProvider.refresh())
	vscode.commands.registerCommand('nwcTenants.viewSource', async (node: NWCExplorerTreeNode) => {
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

const tenantUrlInputOptions: vscode.InputBoxOptions = {
	prompt: 'Enter your NWC Tenant URL',
}

const clientIdInputOptions: vscode.InputBoxOptions = {
	prompt: 'Enter the tenants client id',
}

const clientSecretInputOptions: vscode.InputBoxOptions = {
	prompt: 'Enter your client secret',
}

async function connectToNWCTenant(): Promise<INWCClientAppCredentials> {
	const tenantName = await vscode.window.showInputBox(tenantUrlInputOptions)
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const clientId = (await vscode.window.showInputBox(clientIdInputOptions))!
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const clientSecret = (await vscode.window.showInputBox(clientSecretInputOptions))!

	const appCredentials: INWCClientAppCredentials = {
		tenantName: tenantName,
		clientId: clientId,
		clientSecret: clientSecret,
	}

	return appCredentials
}
