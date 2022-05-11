import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getSdkTenantConnectionDetails, getSdkTenant } from './../shared'

const tenant: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	const sdk = await getSdkTenant(getSdkTenantConnectionDetails(req))
	context.res = {
		status: 200,
		body: sdk.tenant,
	}
}

export default tenant
