import { arrayToDictionary } from "../utils";
import { ActionInfo } from "./models/actionInfo";
import { Connection } from "./models/connection";
import { Connector } from "./models/connector";
import { ConnectionActionConfigurationItemValue } from "./models/connectionActionConfigurationItemValue";
import { ConnectionAction } from "./models/connectionAction";
import { UsedConnection } from "./models/usedConnection";
import { UsedConnector } from "./models/usedConnector";
import { workflowDefinition, action, parameter } from "./models/workflowDefinition";
import { OpenAPIV2 } from 'openapi-types'
import { ParsedWorkflowDefinition, WorkflowDependency } from "./models/parsedWorkflowDefinition";
import { WorkflowInfo } from "./models/workflowInfo";

export class WorkflowDefinitionParser {
    private _definition: workflowDefinition;
    private _connectors: Connector[];
    private _actionsArray: action[]
    private _actionInfos: ActionInfo[];
    private _actionsDictionary: { [key: string]: action; };
    private _usedConnectors: { [key: string]: UsedConnector; };
    private _connections: Connection[];
    private _workflowInfos: WorkflowInfo[];
    private _dependencies: { [key: string]: WorkflowDependency } = {}
    public get definition(): workflowDefinition {
        return this._definition;
    }

    public get usedConnectors(): { [key: string]: UsedConnector; } {
        return this._usedConnectors;
    }

    public set usedConnectors(value: { [key: string]: UsedConnector; }) {
        this._usedConnectors = value;
    }

    public static parse(definition: string, connectors: Connector[], connections: Connection[], workflowInfos: WorkflowInfo[]): ParsedWorkflowDefinition {
        const parser = new WorkflowDefinitionParser(definition, connectors, connections, workflowInfos)
        parser.resolveConnections()
        parser.resolveDependencies()
        return {
            actionInfos: parser._actionInfos,
            actionsArray: parser._actionsArray,
            actionsDictionary: parser._actionsDictionary,
            usedConnectors: parser._usedConnectors,
            dependencies: parser._dependencies
        }
    }

    private constructor(definition: string, connectors: Connector[], connections: Connection[], workflowInfos: WorkflowInfo[]) {
        this._definition = JSON.parse(definition) as workflowDefinition
        this._connectors = connectors
        this._connections = connections
        this._workflowInfos = workflowInfos
        this._actionsArray = WorkflowDefinitionParser.actionsToFlatArray(this._definition.actions)
        this._actionsDictionary = arrayToDictionary(this._actionsArray, "id")
        this._usedConnectors = arrayToDictionary(
            Object.keys(this._definition.inUseXtensions).map<UsedConnector>(
                (connectorId) => (this._connectors.find((cn) => (cn.id === connectorId))!)
            ), "id")
        this._actionInfos = this._actionsArray.map<ActionInfo>((a) => ({ id: a.id, name: a.configuration.name }))
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

    private getComponentWorkflowId = (action: action): string | undefined =>
        action.configuration.properties
            .find(property => {
                return property.parameters.find(parameter => {
                    return parameter.name === 'wfId'
                })
            })
            ?.parameters.find(parameter => {
                return parameter.name === 'wfId'
            })?.value.primitiveValue?.valueType.data.value



    private resolveActionParameterValue(entry: { parameter: OpenAPIV2.Parameter, value: any }): ConnectionActionConfigurationItemValue {
        if (entry.value === undefined) {
            return {
                key: entry.parameter.name,
                value: undefined,
                name: entry.parameter["x-ntx-summary"],
                type: "value"
            }
        } else if (entry.parameter.type === "string" && entry.value.literal) {
            return {
                key: entry.parameter.name,
                value: entry.value.literal,
                name: entry.parameter["x-ntx-summary"],
                type: "value"
            }
        } else if (entry.parameter.type === "string" && entry.value.variable) {
            return {
                key: entry.parameter.name,
                value: entry.value.variable.name,
                name: entry.parameter["x-ntx-summary"],
                type: "variable"
            }
        } else if (entry.parameter.schema && entry.parameter.schema.type === "object" && entry.value.value) {
            const values = Object.keys(entry.value.value).map<ConnectionActionConfigurationItemValue>((key) => {
                return {
                    key: key,
                    name: entry.value.value[key].schema.title,
                    value: entry.value.value[key].literal ? entry.value.value[key].literal : (entry.value.value[key].variable ? entry.value.value[key].variable.name : entry.parameter.name),
                    type: entry.value.value[key].literal ? "value" : (entry.value.value[key].variable ? "variable" : "unsupported")
                }
            })
            return {
                key: entry.parameter.name,
                value: values,
                name: entry.parameter["x-ntx-summary"],
                type: "dictionary"
            }
        } else {
            return {
                key: entry.parameter.name,
                name: entry.parameter["x-ntx-summary"] ?? entry.parameter.name,
                type: "unsupported",
                value: undefined
            }
        }
    }

    private resolveDependencies() {
        const componentWorkflowActions = this._actionsArray.filter(action => {
            return action.className === 'engine:startworkflow'
        })
        for (const action of componentWorkflowActions) {
            const referencedWorkflowId = this.getComponentWorkflowId(action)
            if (referencedWorkflowId) {
                if (Object.keys(this._dependencies).find(key => key === referencedWorkflowId) === undefined) {
                    const info = this._workflowInfos.find(info => info.id === referencedWorkflowId)!
                    this._dependencies[referencedWorkflowId] = {
                        id: info.id,
                        name: info.name,
                        actions: []
                    }
                }
                if (this._dependencies[referencedWorkflowId].actions.find(actionInfo => actionInfo.id === action.id) === undefined) {
                    this._dependencies[referencedWorkflowId].actions.push({ id: action.id, name: action.configuration.name })
                }
            }
        }
    }

    private resolveConnections() {
        for (const connectorId of Object.keys(this._definition.inUseXtensions)) {
            const foundConnections: UsedConnection[] = []
            for (const actionId of this._definition.inUseXtensions[connectorId].usedByActionIds) {
                const connection = this.getActionConnection(this._actionsDictionary[actionId])
                if (connection) {
                    let usedConnection = foundConnections.find(uc => uc.id === connection.id)
                    if (usedConnection === undefined) {
                        usedConnection = connection
                        usedConnection.actions = []
                        foundConnections.push(usedConnection)
                    }
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

                    const actionInfo: ConnectionAction = {
                        id: actionId,
                        name: this._actionsDictionary[actionId].configuration.name,
                        data: valuesDictionary,
                        configuration: []
                    }

                    for (const [key, entry] of Object.entries(valuesDictionary)) {
                        const v = this.resolveActionParameterValue(entry)
                        actionInfo.configuration.push({
                            path: key,
                            name: v.name,
                            key: v.key,
                            value: v.value,
                            type: v.type
                        })
                    }
                    usedConnection.actions!.push(actionInfo)
                    if (this._usedConnectors[connectorId].connections === undefined) {
                        this._usedConnectors[connectorId].connections = {}
                    }
                    this._usedConnectors[connectorId].connections![connection.id] = usedConnection
                }
            }
        }
    }
}