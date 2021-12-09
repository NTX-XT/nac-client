import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getTenant, getTenantConnectionDetails } from '@nwc-sdk/azure-functions-shared'

const tenant: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	const tenant = await getTenant(getTenantConnectionDetails(req))
	context.res = {
		status: 200,
		body: tenant.tenantInfo,
	}
}

export default tenant
