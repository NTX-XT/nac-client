import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getTenant, getTenantConnectionDetails } from '@nwc-sdk/azure-functions-shared'

const tags: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	const tenant = await getTenant(getTenantConnectionDetails(req))
	const tags = await tenant.getTags()
	context.res = {
		status: 200,
		body: tags,
	}
}

export default tags
