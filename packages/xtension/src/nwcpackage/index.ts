import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import axios from 'axios'
import { INWCPackage, INWCPackageWorkflow, NWCPackageManager } from '@nwc-sdk/package'
import { getTenantConnectionDetails, IOrchestrationActivities, IPackagingConfiguration } from '@nwc-sdk/azure-functions-shared'
import * as df from 'durable-functions'

const nwcpackage: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	if (req.method === 'GET') {
		const nwcPackage: INWCPackage = (await axios.get(req.query.packageUrl)).data
		const response = {
			key: nwcPackage.key,
			datasources: nwcPackage.datasources,
			connectors: nwcPackage.connectors,
			workflows: [] as { workflowId: string, workflowName: string, exportKey: string, order: number }[],
		}
		for (const workflow of nwcPackage.workflows) {
			response.workflows.push({
				workflowId: workflow.workflowId,
				workflowName: workflow.workflowName,
				exportKey: workflow.exportKey,
				order: workflow.order,
			})
		}

		context.res = {
			status: 200,
			body: response,
		}
	} else if (req.method === 'POST') {
		const client = df.getClient(context)
		const config: IOrchestrationActivities = {
			activities: [
				{
					activityName: 'runPackaging',
					input: {
						connectionDetails: getTenantConnectionDetails(req),
						tag: req.query.tag,
						packageName: req.query.packageName,
					} as IPackagingConfiguration,
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
}

export default nwcpackage
