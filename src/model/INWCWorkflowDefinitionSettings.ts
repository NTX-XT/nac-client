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
	sources: INWCWorkflowDefinitionDataSourceId[]
	type: string
}
export interface INWCWorkflowDefinitionDataSourceId {
	id: string
}
