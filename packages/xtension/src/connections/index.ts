import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getTenant, getTenantConnectionDetails } from './../shared'

const connections: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	const tenant = await getTenant(getTenantConnectionDetails(req))
	await tenant.getConnectors()
	await tenant.getConnections()
	const connector = tenant.connectors.find(con => con.id === req.params.id)
	const connections = tenant.getConnectionsOfConnector(connector?.name || "", true)
	const result = connections.map(con => ({
		id: con.id,
		name: con.displayName,
		valid: !con.isInvalid,
		contractName: con.contractName,
	}))
	context.res = {
		status: 200,
		body: result,
	}
}

export default connections
