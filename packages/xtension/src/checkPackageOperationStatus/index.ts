import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import * as df from 'durable-functions'

const checkPackageOperationStatus: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	const client = df.getClient(context)
	const response = await client.getStatus(req.query.operationId!)
	const output = Array.isArray(response.output) ? response.output[0] : null
	context.res = {
		status: 200 /* Defaults to 200 */,
		body: {
			operationStatus: response.runtimeStatus,
			output: output,
		},
	}
}

export default checkPackageOperationStatus
