import { arrayToDictionary } from "../utils";
import { ActionInfo } from "./models/ActionInfo";
import { Connection } from "./models/connection";
import { Connector } from "./models/connector";
import { UsedConnection, UsedConnector } from "./models/workflow";
import { workflowDefinition, action, parameter } from "./models/workflowDefinition";
import { OpenAPIV2 } from 'openapi-types'
import { ParsedWorkflowDefinition } from "./models/parsedWorkflowDefinition";

export class WorkflowDefinitionParser {
    private _definition: workflowDefinition;
    private _connectors: Connector[];
    private _actionsArray: action[]
    private _actionInfos: ActionInfo[];
    private _actionsDictionary: { [key: string]: action; };
    private _usedConnectors: { [key: string]: UsedConnector; };
    private _connections: Connection[];
    public get definition(): workflowDefinition {
        return this._definition;
    }

    public get usedConnectors(): { [key: string]: UsedConnector; } {
        return this._usedConnectors;
    }

    public set usedConnectors(value: { [key: string]: UsedConnector; }) {
        this._usedConnectors = value;
    }

    public static parse(definition: string, connectors: Connector[], connections: Connection[]): ParsedWorkflowDefinition {
        const parser = new WorkflowDefinitionParser(definition, connectors, connections)
        return {
            actionInfos: parser._actionInfos,
            actionsArray: parser._actionsArray,
            actionsDictionary: parser._actionsDictionary,
            usedConnectors: parser._usedConnectors
        }
    }

    private constructor(definition: string, connectors: Connector[], connections: Connection[]) {
        this._definition = JSON.parse(definition) as workflowDefinition
        this._connectors = connectors
        this._connections = connections
        this._actionsArray = WorkflowDefinitionParser.actionsToFlatArray(this._definition.actions)
        this._actionsDictionary = arrayToDictionary(this._actionsArray, "id")
        this._usedConnectors = arrayToDictionary(
            Object.keys(this._definition.inUseXtensions).map<UsedConnector>(
                (connectorId) => (this._connectors.find((cn) => (cn.id === connectorId))!)
            ), "id")
        this._actionInfos = this._actionsArray.map<ActionInfo>((a) => ({ id: a.id, name: a.configuration.name }))
        this.resolveConnections()
    }

    public static actionsToFlatArray(action: action, allActions?: action[]): action[] {
        if (allActions === null || allActions === undefined) {
            allActions = [] as action[]
        }
        allActions.push(action)
        if (action.next) {
            this.actionsToFlatArray(action.next, allActions)
        }
        action.children.forEach(a => this.actionsToFlatArray(a, allActions))
        return allActions
    }

    private getActionXtensionInputParameter = (action: action): parameter | undefined =>
        action.configuration.properties.find(
            (p) => (p.displayName.startsWith('xtension:')))?.parameters?.find(
                (parameter) => parameter.name === "['X_NTX_XTENSION_INPUT']")

    private getActionXtensionParameterValue = (parameter: parameter | undefined): any | undefined => parameter?.value.primitiveValue?.valueType.data.value.value

    private getActionXtnesionConnectionId(parameter: parameter): string | undefined {
        const parameterValue = this.getActionXtensionParameterValue(parameter)
        const key = Object.keys(parameterValue).find((key) => (key.endsWith('NTX_CONNECTION_ID')))
        return key ? parameterValue[key].data.id : undefined
    }

    private getActionConnection(action: action): UsedConnection | undefined {
        const parameter = this.getActionXtensionInputParameter(action)
        return parameter ? this._connections.find((con) => (con.id === this.getActionXtnesionConnectionId(parameter))) : undefined
    }

    private findOperation(paths: OpenAPIV2.PathsObject, operationId: string): OpenAPIV2.OperationObject | undefined {
        for (const key of Object.keys(paths)) {
            for (const verb of Object.keys(OpenAPIV2.HttpMethods).map(key => OpenAPIV2.HttpMethods[key])) {
                if (paths[key][verb] && paths[key][verb].operationId === operationId) {
                    return paths[key][verb]
                }
            }
        }
        return undefined
    }

    private resolveConnections() {
        for (const connectorId of Object.keys(this._definition.inUseXtensions)) {
            for (const actionId of this._definition.inUseXtensions[connectorId].usedByActionIds) {
                const connection = this.getActionConnection(this._actionsDictionary[actionId])
                const operationId = this._actionsDictionary[actionId].configuration.xtension!.operationId
                const document: OpenAPIV2.Document = this._definition.inUseXtensions[connectorId].xtension
                const operation: OpenAPIV2.OperationObject = (this.findOperation(document.paths, operationId)!)
                const values = this.getActionXtensionParameterValue(this.getActionXtensionInputParameter(this._actionsDictionary[actionId]))
                const valuesDictionary: { [key: string]: { parameter: OpenAPIV2.Parameter, value: any } } = {}
                for (const p of operation.parameters!) {
                    const parameter: OpenAPIV2.Parameter = p as OpenAPIV2.Parameter
                    const key = `${operation.operationId}.${parameter.in}.${parameter.name}`
                    valuesDictionary[key] = {
                        parameter: parameter,
                        value: values[key]
                    }
                }
                if (connection) {
                    const connectionId = connection.id
                    if (this._usedConnectors[connectorId].connections === undefined) {
                        this._usedConnectors[connectorId].connections = {}
                    }
                    this._usedConnectors[connectorId].connections![connectionId] = connection
                }
            }
        }
        // //
        // // const connections = (await Promise.all(Object.keys(definition.inUseXtensions).map<Promise<(Connection | undefined)[]>>(async (connectorId) => {
        // //     return await Promise.all(definition.inUseXtensions[connectorId].usedByActionIds.map<Promise<Connection | undefined>>(async (actionId) => {
        // //         return await this.getActionConnection(actionsDic[actionId])
        // //     }))
        // // }))).reduce((accumulator, value) => accumulator.concat(value), [])
        // // for (const connectorId of Object.keys(definition.inUseXtensions)) {
        // //     for (const actionId of definition.inUseXtensions[connectorId].usedByActionIds) {
        // //         const connection = this.getActionConnection(actionsDic[actionId])
        // //     }
        // // }
        // // console.log(connections)

    }
}