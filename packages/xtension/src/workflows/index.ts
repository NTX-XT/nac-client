import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getTenant, getTenantConnectionDetails } from '@nwc-sdk/azure-functions-shared'

const workflows: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	const tenant = await getTenant(getTenantConnectionDetails(req))
	let workflows = await tenant.getWorkflows()
	if (req.query.tag) {
		workflows = workflows.filter(workflow => {
			return workflow.tags!.find(tag => tag?.name === req.query.tag) !== undefined
		})
	}
	if (req.query.onlyPublished) {
		workflows = workflows.filter(workflow => {
			return workflow.published!.id !== undefined
		})
	}
	const result = workflows.map(workflow => ({
		id: workflow.id,
		name: workflow.name,
		tags: workflow.tags!.map(tag => {
			return tag.name
		}),
		isPublished: workflow.published!.id !== undefined,
	}))
	context.res = {
		status: 200,
		body: result,
	}
}

export default workflows
