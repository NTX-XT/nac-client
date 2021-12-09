# nwc-package

This tool can be used to programmatically package, deploy, configure and publish NWC workflow across tenants.

- Package all workflows marked with a specific tag in a JSON formatted file, with non-expiring export keys.
- Identify relations between component workflows and come up with a proper deployment order
- Identify required connections for the packaged workflows 
- Export the workflow definitions to JSON files to be included in a version control system of choice. 
- Identify matching connection to the target tenant based on the connectors used by the packaged workflows
- Deploy and published the package to a different tenant 

The tool is created using typescript, with all available type and interface definitions included.

_**Disclaimer:**_ This is an *unofficial, community driven effort*, not officially supported ny Nintex.
## Installation

1. Add the tool to your node.js project using npm: **npm -i @nwc-sdk/package**
2. Follow the nwc-sdk documentation to configure a connection to your tenant.

## Code Samples
### Packaging
```typescript
 public static async createPackage() : Promise<NWCPackageManager> {
	const nwcPackageManager = new NWCPackageManager('MyTag');
	nwcPackageManager.setLogging(true, true);
	await nwcPackageManager.connect(sourceConnectionConfig);
	await nwcPackageManager.buildPackage(true, './output');
	writeFileSync(`./output/${nwcPackageManager.package.key}-package.json`, JSON.stringify(nwcPackageManager.package));
	return nwcPackageManager;
}
```
### Get matching connecions
```typescript
public static async getMatchingConnections() {
	const nwcPackageManager = new NWCPackageManager(undefined, NWCPackageManager.loadPackage('./output/MyTag-package.json'));
	await nwcPackageManager.connect(targetConnectionConfig);
	const connections = await nwcPackageManager.getMatchingConnectionInfos();
	writeFileSync(`./output/connections.json`, JSON.stringify(connections));
}
```
### Deploying
```typescript
  public static async deployPackage(reuseExistingWorkflows: boolean) {
	const targetConnections = JSON.parse(readFileSync('./output/connections.json', 'utf-8')) as INWCConnectionInfo[];
	const nwcPackageManager = new NWCPackageManager(undefined, NWCPackageManager.loadPackage('./output/MyTag-package.json'));
	nwcPackageManager.setLogging(true, true);
	await nwcPackageManager.connect(targetConnectionConfig);
	await nwcPackageManager.deploy(targetConnections, reuseExistingWorkflows);
}
```
