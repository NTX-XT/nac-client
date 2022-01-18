import { user } from '../../nwc'
import { Connector } from './connector';

export interface settings {
    id: string
    title: string
    description: string
    type: string
    author: user
    _metaData: string[]
    datasources: {
        [key: string]: {
            sources: {
                id: string
            }[]
            type: string
        }
    }
    overwriteExistingWorkflow: boolean
    isPublishing: boolean
    isActive: boolean
}

export interface xtensionInfo {
    title: string;
    description: string;
    version: string;
}
export interface xtension {
    swagger: string;
    info: xtensionInfo;
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

export interface xtensionUsage {
    xtension: xtension;
    usedByActionIds: string[];
    usedByEventIds: string[];
}

export interface dataType {
    name: string;
    version: number;
    subType?: string;
    schema?: {
        title: string;
        type: string;
        properties: any;
    }
}

export interface actionConstraint {
    constraintType: dataType;
    data: {
        field: string;
        filterType?: string[];
        choices?: any[];
    };
}

export interface valueType {
    type: dataType;
    data: { value: any; };
    validators: any[];
}

export interface valueData {
    name: string,
    value: string,
    valuePath?: string
}

export interface formatValue {
    variable: {
        valueType: {
            data: valueData
        }
    }
}


export interface parameter {
    name: string;
    label: string;
    description: string;
    required: boolean;
    dataType: dataType;
    constraints: actionConstraint[];
    direction: string;
    properties: any;
    value: {
        primitiveValue: {
            valueType: valueType;
            formatValues: formatValue[];
        } | null;
        variable: { valueType: string } | null;
    };
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

export interface variable {
    source: string;
    name: string;
    displayName: string;
    dataType: dataType;
    schema?: any | null;
    properties?: {
        dataType: dataType;
        name: string;
        rawName: string;
        displayName: string;
    }[];
    scopeId?: string;
    outputId?: string;
    usedInActions: string[] | { [key: string]: string[]; };
    isInUse: boolean;
    isUsedInActions: boolean;
    configuration?: {
        description?: string;
        defaultValue: string;
    };
    output?: boolean;
    initiate?: boolean;
    isHidden?: boolean;
    "x-ntx-flagged": boolean;
}

export interface actionConfiguration {
    id: string;
    name: string;
    originalName: string;
    subHeader: null;
    image: any;
    serverInfo: { className: string; };
    properties: {
        id: string;
        displayName: string;
        parameters: parameter[];
    }[];
    stateConfiguration: null;
    isDisabled: boolean;
    operationId?: string;
    xtensionId?: string;
    xtension?: {
        operationId: string;
        id: string;
        isAsyncAction: boolean;
        engineVersion: number;
    };
    actionConstraint?: actionConstraint;
    constraints: actionConstraint[];
    isHidden?: boolean;
    isHiddenInToolbox?: boolean;
    isPublishable?: boolean;
    isCollapsed?: boolean;
}

export interface action {
    id: string;
    configuration: actionConfiguration;
    className: string;
    renderOptions: {
        type: string;
        branchMenuCommands: any;
    };
    requiredZone: any;
    invalidZone: any;
    requiredZoneErrorMessage: any;
    definesZone: any;
    _metaData?: string[];
    children: action[];
    next: action;
    previous: string;
    parent: string;
}

export interface workflowDefinition {
    state: { modified: boolean }
    settings: settings;
    variables: variable[];
    inUseXtensions: { [key: string]: xtensionUsage; };
    forms: any;
    formVersions: any;
    actions: action;
}
