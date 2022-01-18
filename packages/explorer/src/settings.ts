import { ClientCredentials } from '@nwc-sdk/client'
import * as vscode from 'vscode'
import { SHARE_ENV } from 'worker_threads'
import { Informer } from './informer'

export interface IConfiguration {
	connections: ClientCredentials[]
}
