import { INWCWorkflowDefinitionExtensionInfo } from "./INWCWorkflowDefinitionExtensionInfo";


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
