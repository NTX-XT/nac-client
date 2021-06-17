import { INWCTenantOAuthInfo } from "./INWCTenantOAuthInfo";
import { INWCUser } from "./INWCUser";
import { INWCXcomponent } from "./INWCXcomponent";

export interface INWCTenantDetails {
    apiManagerUrl: string;
    zincUrl: string;
    webTaggerUrl: string;
    launchDarklyKey: string;
    whiteListedConnections: string[];
    gaTrackingCode: string;
    designerUrl: string;
    embedFormsUrl: string;
    connectionsXcomponentUrl: string;
    userManagementXcomponent: INWCXcomponent;
    devTokenManagementXcomponent: INWCXcomponent;
    domainManagementXComponent: INWCXcomponent;
    feedbackFormEndpoint: string;
    createTicketFormEndpoint: string;
    appInsightsInstrumentationKey: string;
    cloudElementService: boolean;
    serviceRegion: string;
    boxAppUrl: string;
    allowedHawkeyeDomains: string;
    readmeIOUrl: string;
    oidc: INWCTenantOAuthInfo;
    user: INWCUser;
}
