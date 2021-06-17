import { INWCTenantDetails } from "./INWCTenantDetails";

export interface INWCTenantInfo {
    id: string;
    name: string;
    apiManagerUrl: string;
    host: string;
    details: INWCTenantDetails;
}

