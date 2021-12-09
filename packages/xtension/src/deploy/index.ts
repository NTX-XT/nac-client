import * as df from 'durable-functions'
import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { IDeploymentConfiguration, IOrchestrationActivities, getTenant, getTenantConnectionDetails } from '@nwc-sdk/azure-functions-shared'
import axios from 'axios'
import { INWCPackage } from '@nwc-sdk/package'

const deploy: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	const client = df.getClient(context)
	const nwcPackage: INWCPackage = (await axios.get(req.body.packageUrl)).data
	const config: IOrchestrationActivities = {
		activities: [
			{
				activityName: 'runDeployment',
				input: {
					connectionDetails: getTenantConnectionDetails(req),
					package: nwcPackage,
					connections: req.body.connections,
					datasources: req.body.datasources,
					skipExisting: req.body.skipExisting,
				} as IDeploymentConfiguration,
			},
		],
	}
	const instanceId = await client.startNew('orchestrator', undefined, config)
	context.log(`Started orchestration with ID = '${instanceId}'.`)
	context.res = {
		status: 200,
		body: { operationId: instanceId },
	}
}

export default deploy
