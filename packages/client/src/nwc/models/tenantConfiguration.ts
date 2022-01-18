/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { user } from './user';

export type tenantConfiguration = {
    apiManagerUrl?: string;
    zincUrl?: string;
    pdfFormConverterUrl?: string;
    webTaggerUrl?: string;
    launchDarklyKey?: string;
    whiteListedConnections?: Array<string>;
    gaTrackingCode?: string;
    designerUrl?: string;
    embedFormsUrl?: string;
    connectionsXcomponentUrl?: string;
    userManagementXcomponent?: {
        redirectUri?: string;
        documentationUrl?: string;
        url?: string;
    };
    devTokenManagementXcomponent?: {
        url?: string;
        redirectUri?: string;
    };
    domainManagementXComponent?: {
        url?: string;
        redirectUri?: string;
    };
    appInsights?: {
        instrumentationKey?: string;
        connectionString?: string;
    };
    feedbackFormEndpoint?: string;
    createTicketFormEndpoint?: string;
    appInsightsInstrumentationKey?: string;
    cloudElementService?: boolean;
    serviceRegion?: string;
    boxAppUrl?: string;
    allowedHawkeyeDomains?: string;
    readmeIOUrl?: string;
    devPortalUrls?: {
        queryJson?: string;
        regex?: string;
    };
    oidc?: {
        domain?: string;
        clientId?: string;
    };
    user?: user;
}
