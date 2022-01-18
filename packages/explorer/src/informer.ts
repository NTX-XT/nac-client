
import * as vscode from 'vscode'

export class Informer {
	static outputChannel?: vscode.OutputChannel

	private static get outputToUser() {
		if (!this.outputChannel) {
			this.outputChannel = vscode.window.createOutputChannel('NWC')
			this.outputChannel.show()
		}
		return this.outputChannel
	}

	public static writeInfo(message: string) {
		this.outputToUser.appendLine('info: ' + message)
	}

	public static writeError(message: string) {
		this.outputToUser.appendLine('error: ' + message)
	}

	public static writeHint(message: string) {
		this.outputToUser.appendLine('hint: ' + message)
	}
}
