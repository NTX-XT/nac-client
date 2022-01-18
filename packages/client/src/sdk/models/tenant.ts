
export interface Tenant {
    id: string;
    name: string;
    token: string;
    datasourceToken?: string;
    apiManagerUrl: string;
    host: string;
    cloudElementService: boolean;
    serviceRegion: string;
    url: string;
}
