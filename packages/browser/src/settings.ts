import { INWCClientAppCredentials, INWCConnectionInfo } from '@nwc-sdk/sdk'
import * as vscode from 'vscode'
import { SHARE_ENV } from 'worker_threads'
import { Informer } from './informer'

export interface IConfiguration {
	connections: INWCClientAppCredentials[]
}
