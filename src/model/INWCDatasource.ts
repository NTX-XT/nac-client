export interface INWCDataSource {
	id: string
	name: string
	description: string
	contractId: string
	operationId: string
	connectionId: string
	createdByUserId: string
	createdDate: Date
	modifiedByUserId: string
	modifiedDate: Date
	isInvalid: boolean
	isEditable: boolean
}

export interface INWCDatasourceContract {
	id: string
	name: string
	description: string
	appId: string
	createdByUserId: string
	timeStamp: Date
	createdDate: Date
	icon: string
	operations: any[]
	allowedHosts: string[]
	latestVersion: string
}
