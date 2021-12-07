export interface INWCWorkflowEventType {
    id: string;
    name: string;
}

export interface INWCWorkflowDefinitionVariableConfiguration {
    description?: string;
    defaultValue: string;
}


export interface INWCXcomponent {
    redirectUri: string;
    documentationUrl?: string;
    url: string;
}

export interface INWCUser {
    id: string;
    email: string;
    externalId: string;
    firstName: string;
    lastName: string;
    name: string;
    nintexTenantId: string;
    roles: string[];
    permissions: string[];
    tenantId: string;
    tenantName: string;
    displayName: string;
}



export interface INWCTenantOAuthInfo {
    domain: string;
    clientId: string;
}

export interface INWCTenantInfo {
    cloudElementService: boolean
    serviceRegion: string
    id: string
    name: string
    apiManagerUrl: string
    host: string
}

export interface IExecutionContextConfiguration {
    key: string;
    outputFolderPath: string;
    configFolderPath: string;
    ensureUniqueOutputFolder: boolean;
}

export interface INWCClientAppCredentials {
    clientId: string
    clientSecret: string
    tenantName?: string
}

export interface INWCConnectionInfo {
    id: string;
    displayName: string;
    isInvalid?: boolean;
    createdDate?: string;
    contractName: string;
    createdByUserId?: string;
    ownership?: boolean;
}


export interface INWCConnectorActionInfo {
    type: string;
    name: string;
    enabled: boolean;
    configuration: any;
}


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

export interface INWCWorkflowDefinitionDataTypeSchema {
    title: string;
    type: string;
    properties: any;
}

export interface INWCWorkflowDefinitionDataType {
    name: string;
    version: number;
    subType?: string;
    schema?: INWCWorkflowDefinitionDataTypeSchema;
}



export interface INWCWorkflowStartEvent {
    eventGroup: string;
    eventType: string;
    eventTypeOption: string;
    eventTypeDisplayName: string;
    configuration: any[];
    conditional: any;
    properties: any[];
    xtensionEventConfiguration: any;
    transformation: any;
    webformDefinition?: string;
    webformVersion?: string;
    metadataConfiguration?: any;
    formMetadata?: any;
    eventData?: { [key: string]: string }
}

export interface INWCWorkflowPublisedUrls {
    designerUrl: string;
}

export interface INWCWorkflowPublishInfo {
    id: string;
    author: INWCUser;
    description: string;
    publishedType: string;
    isActive: boolean;
    created: Date;
    lastPublished: Date;
    eventType: INWCWorkflowEventType;
    eventConfiguration: any[];
    urls: INWCWorkflowPublisedUrls;
}

export interface INWCWorkflowInfo {
    id: string;
    draft?: any;
    published?: INWCWorkflowPublishInfo;
    lastModified?: Date;
    name: string;
    tags?: any[];
}

export interface INWCWorklflowDefinitionVariableProperty {
    dataType: INWCWorkflowDefinitionDataType;
    name: string;
    rawName: string;
    displayName: string;
}


export interface INWCWorkflowDefinitionVariable {
    source: string;
    name: string;
    displayName: string;
    dataType: INWCWorkflowDefinitionDataType;
    schema?: any | null;
    properties?: INWCWorklflowDefinitionVariableProperty[];
    scopeId?: string;
    outputId?: string;
    usedInActions: string[] | { [key: string]: string[]; };
    isInUse: boolean;
    isUsedInActions: boolean;
    configuration?: INWCWorkflowDefinitionVariableConfiguration;
    output?: boolean;
    initiate?: boolean;
    isHidden?: boolean;
    "x-ntx-flagged": boolean;
}


export interface INWCWorkflowDefinitionState {
    modified: boolean;
}
export interface INWCWorkflowDefinitionDataSourceId {
    id: string
}

export interface INWCWorkflowDefinitionDataSources {
    sources: INWCWorkflowDefinitionDataSourceId[]
    type: string
}


export interface INWCWorkflowDefinitionSettings {
    id: string
    title: string
    description: string
    type: string
    author: INWCUser
    _metaData: string[]
    datasources: { [key: string]: INWCWorkflowDefinitionDataSources }
    overwriteExistingWorkflow: boolean
    isPublishing: boolean
    isActive: boolean
}
export interface INWCWorkflowDefinitionExtensionInfo {
    title: string;
    description: string;
    version: string;
}
export interface INWCWorkflowDefinitionExtension {
    swagger: string;
    info: INWCWorkflowDefinitionExtensionInfo;
    host: string;
    basePath: string;
    schemes: string[];
    produces: string[];
    paths: { [key: string]: any; };
    definitions: { [key: string]: any; };
    parameters: any;
    responses: any;
    securityDefinitions: { [key: string]: any; };
    security: any[];
    "x-ntx-render-version"?: number;
    "x-ntx-host"?: string;
    "x-ntx-contract-id"?: string;
    "x-ntx-xtension-id"?: string;
    "x-ntx-xtension-app-id"?: string;
}

export interface INWCWorkflowDefinitionExtensionUsage {
    xtension: INWCWorkflowDefinitionExtension;
    usedByActionIds: string[];
    usedByEventIds: string[];
}

export interface INWCWorkflowConnectionSchema {
    title: string;
    type: string;
    format: string;
    minLength: number;
}

export interface INWCWorkflowConnectionConfiguration {
    literal: string;
    schema: INWCWorkflowConnectionSchema;
    data: INWCConnectionInfo;
}

export interface INWCWorkflowActionXtensionParameter {
    type: string;
    name: string;
    in: string;
    required?: boolean;
    description?: any;
    minLength?: number;
    maximum?: number;
    minimum?: number;
    collectionFormat?: string;
    uniqueItems?: boolean;
    items?: any;
    default?: string;
    schema?: any;
    "x-ntx-event-context"?: boolean;
    "x-ntx-event-consolidate"?: boolean;
    "x-ntx-visibility"?: string;
    "x-ntx-initial"?: number;
    "x-ntx-query-builder"?: any;
    "x-ntx-orderby-builder"?: any;
    "x-ntx-summary": string;
    "x-ntx-dynamic-values"?: any;
}

export interface INWCWorkflowActionXtensionConfiguration {
    operationId: string;
    id: string;
    isAsyncAction: boolean;
    engineVersion: number;
}


export interface INWCWorkflowActionRenderOptions {
    type: string;
    branchMenuCommands: null;
}


export interface INWCWorkflowActionParameterValueData {
    value: any;
}




export interface INWCWorkflowActionParameterValueType {
    type: INWCWorkflowDefinitionDataType;
    data: INWCWorkflowActionParameterValueData;
    validators: any[];
}


export interface INWCWorkflowActionPrimitiveValue {
    valueType: INWCWorkflowActionParameterValueType;
    formatValues: any[];
}


export interface INWCWorkflowActionParameterVariable {
    valueType: INWCWorkflowActionParameterValueType;
}
export interface INWCWorkflowActionExtensions {
    [key: string]: INWCWorkflowDefinitionExtensionUsage;
}
export interface INWCWorkflowActionParameterValue {
    primitiveValue: INWCWorkflowActionPrimitiveValue | null;
    variable: INWCWorkflowActionParameterVariable | null;
}

export interface INWCWorkflowActionConstraintData {
    field: string;
    filterType?: string[];
    choices?: any[];
}

export interface INWCWorkflowActionConfigurationServerInfo {
    className: string;
}
export interface INWCWorlflowActionConstraint {
    constraintType: INWCWorkflowDefinitionDataType;
    data: INWCWorkflowActionConstraintData;
}

export interface INWCWorkflowActionConfigurationPropertyParameter {
    name: string;
    label: string;
    description: string;
    required: boolean;
    dataType: INWCWorkflowDefinitionDataType;
    constraints: INWCWorlflowActionConstraint[];
    direction: string;
    properties: any;
    value: INWCWorkflowActionParameterValue;
    placeholder: string;
    valueType?: string;
    hidden?: boolean;
    originalRequired?: boolean;
    helpText?: string;
    designerType?: string;
    dependentOn?: string;
    defaultValue?: any;
    renderData?: any;
}
export interface INWCWorkflowActionConfigurationProperty {
    id: string;
    displayName: string;
    parameters: INWCWorkflowActionConfigurationPropertyParameter[];
}



export interface INWCTag {
    name: string
    count: number
}


export interface INWCPermission {
    id: string;
    name: string;
    type: string;
}


export interface INWCImportedWorkflowId {
    workflowId: string;
    workflowDesignVersion: string;
}

export interface INWCDataSource {
    id: string
    name: string
    description: string
    contractId: string
    operationId: string
    connectionId: string
    createdByUserId: string
    createdDate: Date
    modifiedByUserId: string
    modifiedDate: Date
    isInvalid: boolean
    isEditable: boolean
}

export interface INWCDatasourceContract {
    id: string
    name: string
    description: string
    appId: string
    createdByUserId: string
    timeStamp: Date
    createdDate: Date
    icon: string
    operations: any[]
    allowedHosts: string[]
    latestVersion: string
}



export interface INWCConnectorEventInfo {
    type: string;
    name: string;
    enabled: boolean;
}

export interface INWCConnectorInfo {
    id: string;
    name: string;
    enabled: boolean;
    active: boolean;
    events: INWCConnectorEventInfo[]
    actions: INWCConnectorActionInfo[]
}



export interface INWCImportedWorkflowResponse {
    workflowId: INWCImportedWorkflowId;
    isActive: boolean;
    author: INWCUser;
    eventType: string;
    isPublished: boolean;
    created: string;
    isDeleted: boolean;
    lastModified: string;
    workflowDescription: string;
    workflowName: string;
    publishAuthor: INWCUser;
    publishedId: string;
    lastPublished: string;
    workflowType: string;
    saveAuthor: INWCUser;
    lastEdited: string;
    status: string;
}



export interface INWCWorlfowActionConfiguration {
    id: string;
    name: string;
    originalName: string;
    subHeader: null;
    image: any;
    serverInfo: INWCWorkflowActionConfigurationServerInfo;
    properties: INWCWorkflowActionConfigurationProperty[];
    stateConfiguration: null;
    isDisabled: boolean;
    operationId?: string;
    xtensionId?: string;
    xtension?: INWCWorkflowActionXtensionConfiguration;
    actionConstraint?: INWCWorlflowActionConstraint;
    constraints: INWCWorlflowActionConstraint[];
    isHidden?: boolean;
    isHiddenInToolbox?: boolean;
    isPublishable?: boolean;
    isCollapsed?: boolean;
}


export interface INWCWorkflowAction {
    id: string;
    configuration: INWCWorlfowActionConfiguration;
    className: string;
    renderOptions: INWCWorkflowActionRenderOptions;
    requiredZone: any;
    invalidZone: any;
    requiredZoneErrorMessage: any;
    definesZone: any;
    _metaData?: string[];
    children: INWCWorkflowAction[];
    next: INWCWorkflowAction;
    previous: string;
    parent: string;
}






export interface INWCWorkflowPublishPayload {
    workflowName: string;
    workflowDescription: string;
    workflowType: string;
    workflowDefinition: string;
    author: INWCUser;
    startEvents: INWCWorkflowStartEvent[];
    datasources: string;
    permissions: INWCPermission[];
    workflowVersionComments: string;
    workflowDesignParentVersion: string;
    tags: any[];
    version: number;
}
export interface INWCWorkflowDefinition {
    state: INWCWorkflowDefinitionState;
    settings: INWCWorkflowDefinitionSettings;
    variables: INWCWorkflowDefinitionVariable[];
    inUseXtensions: { [key: string]: INWCWorkflowDefinitionExtensionUsage; };
    forms: any;
    formVersions: any;
    actions: INWCWorkflowAction;
}


export interface INWCWorkflowSource {
    workflowId: string;
    isActive: boolean;
    author: INWCUser;
    eventType: string;
    workflowName: string;
    workflowDescription: string;
    isPublished: boolean;
    created: Date;
    creator: INWCUser;
    datasources: string;
    eventConfiguration: string;
    hasPermissions: boolean;
    isDeleted: boolean;
    lastEdited: Date;
    lastModified: Date;
    lastPublished: Date;
    latestId: string;
    publishedId: string;
    status: string;
    version: number;
    workflowVersionComments: string;
    saveAuthor: INWCUser;
    workflowDefinition: string;
    startEvents: INWCWorkflowStartEvent[];
    permissions: INWCPermission[];
    workflowDesignVersion: string;
    isLatest: boolean;
    tags: any[];
    workflowDefinitionAsObject?: INWCWorkflowDefinition;
}






