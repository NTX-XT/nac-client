import { INWCPackage } from "nwc-package"
import { INWCClientAppCredentials, INWCConnectionInfo, INWCDataSource, NWCTenant } from "nwc-sdk"
import { HttpRequest } from '@azure/functions'
import { ClientCredentials, Sdk } from '@nwc-sdk/client'

export interface INWCTenantConnectionDetails {
    clientId?: string
    clientSecret?: string
    token?: string
}

export interface IPackagingConfiguration {
    connectionDetails: INWCTenantConnectionDetails
    tag: string
    packageName?: string
}

export interface IDeploymentConfiguration {
    connectionDetails: INWCTenantConnectionDetails
    package: INWCPackage
    connections?: INWCConnectionInfo[]
    datasources?: INWCDataSource[]
    skipExisting?: boolean
}

export interface IActivityConfiguration {
    activityName: string
    input?: any | IDeploymentConfiguration | IPackagingConfiguration
}

export interface IOrchestrationActivities {
    activities: IActivityConfiguration[]
}

export function getTenantConnectionDetails(req: HttpRequest): INWCTenantConnectionDetails {
    if (req.headers.authorization) {
        return {
            token: req.headers.authorization.split(' ')[1].trim(),
        }
    } else {
        return {
            clientId: req.headers.client_id,
            clientSecret: req.headers.client_secret,
        }
    }
}

export async function getTenant(connectionDetails: INWCTenantConnectionDetails, populateTenant: boolean = false): Promise<NWCTenant> {
    if (connectionDetails.token) {
        return await NWCTenant.connectWithToken(connectionDetails.token, undefined, populateTenant, false)
    } else {
        return await NWCTenant.connectWithClientAppCredentials(connectionDetails as INWCClientAppCredentials, undefined, populateTenant, false)
    }
}

export async function getSdkTenant(connectionDetails: ClientCredentials | string): Promise<Sdk> {
    const client = await (typeof connectionDetails === "string" ? Sdk.connectWithToken(connectionDetails) : Sdk.connectWithClientCredentials(connectionDetails))
    return client!
}

export function getSdkTenantConnectionDetails(req: HttpRequest): ClientCredentials | string {
    return req.headers.authorization
        ? req.headers.authorization.split(' ')[1].trim()
        : {
            clientId: req.headers.client_id!,
            clientSecret: req.headers.client_secret!,
        }
}
