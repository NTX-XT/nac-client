import { writeFileSync, readFileSync } from 'fs'
import { NWCPackageManager } from '@nwc-sdk/package'
import { INWCConnectionInfo, NWCTenant, INWCDataSource, INWCClientAppCredentials } from '@nwc-sdk/sdk'
import * as sourceClientAppCredentials from './source-tenant.json'
import * as targetClientAppCredentials from './target-tenant.json'
const key = 'TAGNAME'

class NwcSdkDemo {
	public static async getTenant(credentials: INWCClientAppCredentials): Promise<NWCTenant> {
		const tenant = await NWCTenant.connectWithClientAppCredentials(credentials)
		writeFileSync(`./output/${tenant.tenantInfo.name}-info.json`, JSON.stringify(tenant))
		return tenant
	}

	public static async createPackage(key: string): Promise<NWCPackageManager> {
		const tenant = await this.getTenant(sourceClientAppCredentials)
		const nwcPackageManager = NWCPackageManager.createWithKey(tenant, key)
		await nwcPackageManager.buildPackage(false, './output')
		writeFileSync(`./output/${nwcPackageManager.package.key}-package.json`, JSON.stringify(nwcPackageManager.package))
		return nwcPackageManager
	}

	public static async deployPackage(key: string, reuseExistingWorkflows: boolean) {
		const tenant = await this.getTenant(targetClientAppCredentials)
		const targetConnections = JSON.parse(readFileSync(`./src/${tenant.tenantInfo.name}.${key}.connections.json`, 'utf-8')) as INWCConnectionInfo[]
		const targetDatasources = JSON.parse(readFileSync(`./src/${tenant.tenantInfo.name}.${key}.datasources.json`, 'utf-8')) as INWCDataSource[]
		const nwcPackageManager = NWCPackageManager.createFromExistingPackage(tenant, NWCPackageManager.loadPackage(`./output/${key}-package.json`))
		const outcome = await nwcPackageManager.deploy(targetConnections, targetDatasources, reuseExistingWorkflows)
		writeFileSync(`./output/${nwcPackageManager.package.key}-${nwcPackageManager.tenant.tenantInfo.name}-deployment.json`, JSON.stringify(outcome))
	}

	public static async getConnectionsForTenant(key: string) {
		const tenant = await this.getTenant(targetClientAppCredentials)
		const nwcPackageManager = NWCPackageManager.createFromExistingPackage(tenant, NWCPackageManager.loadPackage(`./output/${key}-package.json`))
		const connections = nwcPackageManager.getMatchingConnectionInfos()
		const dataSources = nwcPackageManager.getMatchingDatasources()
		writeFileSync(`./output/${tenant.tenantInfo.name}.${key}.connections.json`, JSON.stringify(connections))
		writeFileSync(`./output/${tenant.tenantInfo.name}.${key}.datasources.json`, JSON.stringify(dataSources))
	}
}

// NwcSdkDemo.getTenant(sourceClientAppCredentials)
// NwcSdkDemo.createPackage(key)
// NwcSdkDemo.getConnectionsForTenant(key)
// NwcSdkDemo.deployPackage(key, false)
// NwcSdkDemo.deployPackage(key, true)
