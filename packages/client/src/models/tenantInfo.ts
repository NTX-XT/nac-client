/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type tenantInfo = {
    id?: string;
    name?: string;
    organization_id?: string;
    tenancy_url?: string;
    created?: string;
    license?: {
type?: string;
start?: string;
end?: string;
contract_id?: string;
entitlement?: string;
};
    region?: string;
    region_name?: string;
    aliases?: Array<string>;
    owner?: {
email?: string;
first_name?: string;
last_name?: string;
};
    source?: string;
    contract_id?: string;
}