import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getSdkTenant, getSdkTenantConnectionDetails } from './../shared'

const tags: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	const tenant = await getSdkTenant(getSdkTenantConnectionDetails(req))
	const tags = await tenant.getTags()
	context.res = {
		status: 200,
		body: tags,
	}
}

export default tags
