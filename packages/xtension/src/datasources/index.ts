import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getTenant, getTenantConnectionDetails } from '@nwc-sdk/azure-functions-shared'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	const tenant = await getTenant(getTenantConnectionDetails(req))
	var datasources = await tenant.getDataSources()
	var contracts = await tenant.getDataSourceContracts()
	if (req.query.contractId) {
		datasources = datasources.filter(datasource => {
			return datasource.contractId === req.query.contractId
		})
	}
	const result = datasources.map(ds => ({
		id: ds.id,
		name: ds.name,
		valid: !ds.isInvalid,
		contractName: contracts.find(cn => cn.id === ds.contractId)?.name,
		contractId: ds.contractId,
	}))
	context.res = {
		status: 200,
		body: result,
	}
}

export default httpTrigger
