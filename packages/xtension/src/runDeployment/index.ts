/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 *
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */

import { AzureFunction, Context } from '@azure/functions'
import { INWCPackageDeploymentOutcome, NWCPackageManager } from '@nwc-sdk/package'
import { IDeploymentConfiguration, getTenant } from '@nwc-sdk/azure-functions-shared'
import { INWCConnectionInfo } from 'sdk/dist'

const runDeployment: AzureFunction = async function (context: Context, config: IDeploymentConfiguration): Promise<INWCPackageDeploymentOutcome> {
	const tenant = await getTenant(config.connectionDetails, true)
	tenant.setLogging(true)
	const packageManager = NWCPackageManager.createFromExistingPackage(tenant, config.package)
	const outcome = await packageManager.deploy(config.connections ?? [], config.datasources, config.skipExisting)
	return outcome
}

export default runDeployment
