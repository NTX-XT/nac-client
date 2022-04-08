import { arrayToDictionary, ActionUtilities } from "../../utils";
import { ActionInfo } from "../models/actionInfo";
import { Connection } from "../models/connection";
import { Connector } from "../models/connector";
import { ConnectionActionConfigurationItemValue } from "../models/connectionActionConfigurationItemValue";
import { ConnectionAction } from "../models/connectionAction";
import { UsedConnection } from "../models/usedConnection";
import { UsedConnector } from "../models/usedConnector";
import { OpenAPIV2 } from 'openapi-types'
import { WorkflowDependency } from "../models/workflowDependency";
import { WorkflowInfo } from "../models/workflowInfo";
import { workflowDefinition } from "../../nwc/models/workflowDefinition"
import { action } from "../../nwc/models/action";
import { workflow } from "client/src/nwc";
import { WorkflowDefinitionDetails } from "../models/workflowDefinitionDetails";

export class WorkflowDefinitionParser {
    public static parse(definition: string, connectors: Connector[], connections: Connection[], workflowInfos: WorkflowInfo[]): WorkflowDefinitionDetails {
        const _definition = JSON.parse(definition) as workflowDefinition
        const _actionsArray = ActionUtilities.flatten(_definition.actions)
        const _actionsDictionary = arrayToDictionary(_actionsArray, "id")
        const _actionInfos = _actionsArray.map<ActionInfo>((a) => ({ id: a.id, name: a.configuration.name }))
        const _dependencies = WorkflowDefinitionParser.resolveDependencies(_actionsArray, workflowInfos)
        const _usedConnectors = WorkflowDefinitionParser.resolveConnections(_definition, _actionsDictionary, arrayToDictionary(Object.keys(_definition.inUseXtensions).map<UsedConnector>((connectorId) => (connectors.find((cn) => (cn.id === connectorId))!)), "id"), connections)

        return {
            definition: _definition,
            actionInfos: _actionInfos,
            actionsArray: _actionsArray,
            actionsDictionary: _actionsDictionary,
            dependencies: _dependencies,
            usedConnectors: _usedConnectors
        }
    }

    public static toNwcWorkflowDefinition(workflowDefinitionDetails: WorkflowDefinitionDetails): workflowDefinition {
        throw new Error("Not implemented (yet)");
    }

    private static getActionConnection = (action: action, connections: Connection[]): UsedConnection | undefined => connections.find((con) => (con.id === ActionUtilities.getConnectionId(ActionUtilities.getXtensionInputParameter(action))))

    private static findOperation = (paths: OpenAPIV2.PathsObject, operationId: string): OpenAPIV2.OperationObject | undefined => {
        for (const key of Object.keys(paths)) {
            for (const verb of Object.keys(OpenAPIV2.HttpMethods).map(key => OpenAPIV2.HttpMethods[key])) {
                if (paths[key][verb] && paths[key][verb].operationId === operationId) {
                    return paths[key][verb]
                }
            }
        }
        return undefined
    }

    private static resolveActionParameterValue(entry: { parameter: OpenAPIV2.Parameter, value: any }): ConnectionActionConfigurationItemValue {
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

    private static resolveDependencies(actionsArray: action[], workflowInfos: WorkflowInfo[]): { [key: string]: WorkflowDependency; } {
        const dependencies: { [key: string]: WorkflowDependency; } = {}
        const componentWorkflowActions = actionsArray.filter(action => {
            return action.className === 'engine:startworkflow'
        })
        for (const action of componentWorkflowActions) {
            const referencedWorkflowId = ActionUtilities.getComponentWorkflowIdValue(action)
            if (referencedWorkflowId) {
                if (Object.keys(dependencies).find(key => key === referencedWorkflowId) === undefined) {
                    const info = workflowInfos.find(info => info.id === referencedWorkflowId)!
                    dependencies[referencedWorkflowId] = {
                        id: info.id,
                        name: info.name,
                        actions: []
                    }
                }
                if (dependencies[referencedWorkflowId].actions.find(actionInfo => actionInfo.id === action.id) === undefined) {
                    dependencies[referencedWorkflowId].actions.push({ id: action.id, name: action.configuration.name })
                }
            }
        }
        return dependencies
    }

    private static resolveConnections(definition: workflowDefinition, actionsDictionary: { [key: string]: action; }, usedConnectors: { [key: string]: UsedConnector }, connections: Connection[]) {
        for (const connectorId of Object.keys(definition.inUseXtensions)) {
            const foundConnections: UsedConnection[] = []
            for (const actionId of definition.inUseXtensions[connectorId].usedByActionIds) {
                const connection = WorkflowDefinitionParser.getActionConnection(actionsDictionary[actionId], connections)
                if (connection) {
                    let usedConnection = foundConnections.find(uc => uc.id === connection.id)
                    if (usedConnection === undefined) {
                        usedConnection = connection
                        usedConnection.actions = []
                        foundConnections.push(usedConnection)
                    }
                    const operationId = actionsDictionary[actionId].configuration.xtension!.operationId
                    const document: OpenAPIV2.Document = definition.inUseXtensions[connectorId].xtension as OpenAPIV2.Document
                    const operation: OpenAPIV2.OperationObject = (WorkflowDefinitionParser.findOperation(document.paths, operationId)!)
                    const values = ActionUtilities.getXtensionInputValue(actionsDictionary[actionId])
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
                        name: actionsDictionary[actionId].configuration.name,
                        data: valuesDictionary,
                        configuration: []
                    }

                    for (const [key, entry] of Object.entries(valuesDictionary)) {
                        const v = WorkflowDefinitionParser.resolveActionParameterValue(entry)
                        actionInfo.configuration.push({
                            path: key,
                            name: v.name,
                            key: v.key,
                            value: v.value,
                            type: v.type
                        })
                    }
                    usedConnection.actions!.push(actionInfo)
                    if (usedConnectors[connectorId].connections === undefined) {
                        usedConnectors[connectorId].connections = {}
                    }
                    usedConnectors[connectorId].connections![connection.id] = usedConnection
                }
            }
        }
        return usedConnectors
    }
}