import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getSdkTenant, getSdkTenantConnectionDetails, getTenant, getTenantConnectionDetails } from './../shared'
// import { isNotError, unWrapResponseOrThrow } from '@nwc-sdk/client'

const workflows: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	const sdk = await getSdkTenant(getSdkTenantConnectionDetails(req))


	// const workflows = await sdk.getWorkflowDesigns()
	// context.res = {
	// 	status: 200,
	// 	body: unWrapResponseOrThrow(workflows),
	// }
	// if (req.query.tag) {
	// 	workflows = workflows.filter(workflow => {
	// 		return workflow.tags!.find(tag => tag?.name === req.query.tag) !== undefined
	// 	})
	// }
	// if (req.query.onlyPublished) {
	// 	workflows = workflows.filter(workflow => {
	// 		return workflow.published!.id !== undefined
	// 	})
	// }
	// const result = workflows.map(workflow => ({
	// 	id: workflow.id,
	// 	name: workflow.name,
	// 	tags: workflow.tags!.map(tag => {
	// 		return tag.name
	// 	}),
	// 	isPublished: workflow.published!.id !== undefined,
	// }))
	// context.res = {
	// 	status: 200,
	// 	body: result,
	// }
}

export default workflows
