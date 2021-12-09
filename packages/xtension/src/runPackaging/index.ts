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
import { BlobServiceClient } from '@azure/storage-blob'
import { NWCPackageManager } from '@nwc-sdk/package'
import { IPackagingConfiguration, getTenant } from '@nwc-sdk/azure-functions-shared'

const runPackaging: AzureFunction = async function (context: Context, config: IPackagingConfiguration): Promise<string> {
	const tenant = await getTenant(config.connectionDetails, true)
	tenant.setLogging(true)
	const packageManager = NWCPackageManager.createWithKey(tenant, config.tag)
	await packageManager.buildPackage()
	const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.PackageStorage!)
	const containerName = 'packages'
	const containerClient = blobServiceClient.getContainerClient(containerName)
	if (config.packageName === undefined) {
		config.packageName = `${tenant.tenantInfo.name}-${packageManager.package.key}-${new Date().toISOString()}`
	}
	config.packageName += '.json'
	const blockBlobClient = containerClient.getBlockBlobClient(config.packageName)
	const uploadBlobResponse = await blockBlobClient.uploadData(Buffer.from(JSON.stringify(packageManager.package)), {
		blobHTTPHeaders: { blobContentType: 'application/json' },
	})
	return blockBlobClient.url
}

export default runPackaging
