import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getTenant, getTenantConnectionDetails } from './../shared'

const connectors: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	const tenant = await getTenant(getTenantConnectionDetails(req))
	const connectors = await tenant.getConnectors()
	const result = connectors.map(con => ({
		id: con.id,
		name: con.name,
		active: con.active,
		enabled: con.enabled,
	}))
	context.res = {
		status: 200,
		body: result,
	}
}

export default connectors
