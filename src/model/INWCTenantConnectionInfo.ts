import { INWCClientApp } from "./INWCTenantAuthenticationTokens";

// export interface INWCTenantConnectionInfo extends INWCTenantAuthenticationTokens {
//     region:string;
// }

export interface INWCTenantConnectionInfo {
    clientId: string,
    clientSecret: string,
    region: string,
    tenantName?: string
}