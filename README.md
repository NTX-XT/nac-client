# nwc-sdk

Welcome to the unofficial Nintex Workflow Cloud SDK repoistory. This SDK can be used to programmatically interact with the Nintex Workflow Cloud platfrorm.

_**Disclaimer:**_ This is an *unofficial, community driven effort*, not officially supported ny Nintex.

The sdk is created using typescript, with all available type and interface definitions included.

## How to use the SDK

1. For each NWC tenant you want to access via the SDK, you need to create an App
	1. Go to Settings > Apps and tokens
	2. Click the Add App button
	3. Name your app with something that relates to the nwc sdk usage - i.e. nwcdsk. You can choose whatever name you want. If required, provide a description as well.
2. Add the sdk to your node.js project using npm: **npm -i nwc-sdk**
3. For each tenant, create a json file in your project with the following contents - i.e. myTenantName.json:
```JSON
{
	"clientId": "{The client id of the app you created}",
	"clientSecret": "{The client secret of the app you created}",
	"region" : "{Your tenant's region | us, eu, au}",
	"tenantName": "{The name of your tenant}"
}
```
4. In your project, import the json file into a variable:
```typescript
import * as tenantConnectionConfig from './myTenantName.json';
```
5. Connect to your tenant:
```typescript
import { NWCTenant } from 'nwc-sdk';

async function connect() {
	const tenant = new NWCTenant();
	await tenant.connect(tenantConnectionConfig);
	return tenant;
}
```
6. You can also create the connection configuration programmatically:
```typescript
import { INWCConnectionInfo } from 'nwc-sdk';
const tenantConnectionConfig = {
	"clientId": "{The client id of the app you created}",
	"clientSecret": "{The client secret of the app you created}",
	"region" : "{Your tenant's region | us, eu, au}",
	"tenantName": "{The name of your tenant}"
} : INWCConnectionInfo
```

## Supported SDK functions

The following functions are available on the NWCTenant class - the class representing a Nintex Workflow Cloud tenancy

### connect
```typescript
public async connect(connectionInfo :INWCTenantConnectionInfo, retrieveTenantData: boolean = true ) : Promise<void>
```
Connects to the tenant and retrieves the following details - based on the value of the retrieveTenantData parameter
- tenant information
- available connectors
- configured connections
- configured datasources
- workflows

## retrieveTenantData
```typescript
public async retrieveTenantData()
```
Retrieves the following tenant details of a connected tenant:
- available connectors
- configured connections
- configured datasources
- workflows

## getWorkflow
```typescript
public async getWorkflow(workflowId: string) : Promise<INWCWorkflowInfo> {
```
Retrieves the data of a workflow, based on the workflow id.

## getWorkflowSource
```typescript
public async getWorkflowSource(workflowId: string) : Promise<INWCWorkflowSource>
```
Retrieves the source definition of a workflow, based on the workflow id.

## deleteWorkflowSource
```typescript
public async deleteWorkflowSource(workflowId: string) : Promise<void>
```
Deletes the workflow with the corresponding workflowId

## checkIfWorkflowExists
```typescript
public async checkIfWorkflowExists(workflowName:string) : Promise<boolean>
```
Checks if a workflow with the provided name exists on a tenant

## exportWorkflow
```typescript
public async exportWorkflow(workflowId: string) : Promise<string>
```
Generates a non-expiring export key for the provided workflowId

## importWorkflow
```typescript
public async importWorkflow(workflowExportKey: string, workflowName: string)
```
Imports a workflow with a pre-generated export key using the provided workflow name

## publishWorkflow
```typescript
public async publishWorkflow(workflowId: string, payload:INWCWorkflowPublishPayload)
```
Publishes a draft workflow with the providedId

## getConnectionsOfConnector
```typescript
public getConnectionsOfConnector(connectorName: string, includeInvalid: boolean = false): INWCConnectionInfo[]
```
Retrieves all configured connections of a connector. The includeInvalid parameter can be used to include invalid connections - i.e. connections with expired credentials.













 




