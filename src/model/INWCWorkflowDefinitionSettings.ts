import { INWCUser } from './INWCUser'
export interface INWCWorkflowDefinitionSettings {
	id: string
	title: string
	description: string
	type: string
	author: INWCUser
	_metaData: string[]
	datasources: { [key: string]: INWCWorkflowDefinitionDataSources }
	overwriteExistingWorkflow: boolean
	isPublishing: boolean
	isActive: boolean
}
export interface INWCWorkflowDefinitionDataSources {
	sources: string[]
	type: string
}
