import { ContractDependency } from "../models/contractDependency";
import { WorkflowDependency } from "../models/workflowDependency";
import { workflowDefinition } from "../../nwc/models/workflowDefinition";
import { action } from "../../nwc/models/action";
import { WorkflowDefinitionHelper } from "../helpers/workflowDefinitionHelper";
import { arrayToDictionary, flattenTree } from "../../utils";
import { OpenAPIV2 } from "openapi-types";
import { ActionConfiguration } from "../models/connectionDependencyActionConfiguration";
import { ActionConfigurationEntryValue } from "../models/actionConfigurationEntryValue";
import { ActionHelper } from "../helpers/actionHelper";
import { Form } from "../models/form";


export interface IParsedWorkflowDefinition {
    definition: workflowDefinition
    actionsInfo: {
        actionsArray: action[],
        actionsDictionary: { [key: string]: action; }
    }

    dependencies: {
        contracts: { [key: string]: ContractDependency; },
        workflows: { [key: string]: WorkflowDependency; }
    }

    taskForms: { [key: string]: Form }
}

export class ParsedWorkflowDefinition implements IParsedWorkflowDefinition {
    definition: workflowDefinition
    actionsInfo: {
        actionsArray: action[],
        actionsDictionary: { [key: string]: action; }
    }

    dependencies: {
        contracts: { [key: string]: ContractDependency; },
        workflows: { [key: string]: WorkflowDependency; }
    }

    taskForms: { [key: string]: Form; } = {}

    constructor(definition: string) {
        this.definition = WorkflowDefinitionHelper.toObject(definition)
        const _actionsArray = flattenTree(this.definition.actions, "next", "children")
        this.actionsInfo = {
            actionsArray: _actionsArray,
            actionsDictionary: arrayToDictionary(_actionsArray, "id")
        }
        this.dependencies = {
            contracts: this._resolveContractDependencies(),
            workflows: this._resolveWorkflowDependencies()
        }

        for (const key of Object.keys(this.definition.forms)) {
            this.taskForms[key] = JSON.parse(this.definition.forms[key])
        }
    }

    private _resolveWorkflowDependencies(): { [key: string]: WorkflowDependency; } {
        const dependencies: { [key: string]: WorkflowDependency; } = {}
        const componentWorkflowActions = this.actionsInfo.actionsArray.filter(action => {
            return action.className === 'engine:startworkflow'
        })
        for (const action of componentWorkflowActions) {
            const referencedWorkflowId = ActionHelper.getComponentWorkflowIdValue(action)
            if (referencedWorkflowId) {
                if (!dependencies[referencedWorkflowId]) {
                    dependencies[referencedWorkflowId] = {
                        id: referencedWorkflowId,
                        actionIds: []
                    }
                }
                if (dependencies[referencedWorkflowId].actionIds.find(id => id === action.id) === undefined) {
                    dependencies[referencedWorkflowId].actionIds.push(action.id)
                }
            }
        }
        return dependencies
    }

    private _resolveContractDependencies(): { [key: string]: ContractDependency; } {
        const dependencies: { [key: string]: ContractDependency; } = {}
        for (const contractId of Object.keys(this.definition.inUseXtensions)) {
            if (!(dependencies[contractId])) {
                dependencies[contractId] = { contractId: contractId, connections: {} }
            }
            for (const actionId of this.definition.inUseXtensions[contractId].usedByActionIds) {
                const action = this.actionsInfo.actionsDictionary[actionId]
                const connectionId = ActionHelper.getConnectionId(ActionHelper.getXtensionInputParameter(action))
                if (connectionId) {
                    if (!(dependencies[contractId].connections[connectionId])) {
                        dependencies[contractId].connections[connectionId] = {
                            connectionId: connectionId,
                            actions: {}
                        }
                    }
                    const operationId = this.actionsInfo.actionsDictionary[actionId].configuration.xtension!.operationId
                    const document: OpenAPIV2.Document = this.definition.inUseXtensions[contractId].xtension as OpenAPIV2.Document
                    const operation = ParsedWorkflowDefinition.findOperation(document.paths, operationId)
                    if (operation) {
                        const values = ActionHelper.getXtensionInputValue(this.actionsInfo.actionsDictionary[actionId])
                        const valuesDictionary: { [key: string]: { parameter: OpenAPIV2.Parameter, value: any } } = {}
                        for (const p of operation.parameters!) {
                            const parameter: OpenAPIV2.Parameter = p as OpenAPIV2.Parameter
                            const key = `${operation.operationId}.${parameter.in}.${parameter.name}`
                            valuesDictionary[key] = {
                                parameter: parameter,
                                value: values[key]
                            }
                        }

                        const actionConfiguration: ActionConfiguration = {
                            actionId: actionId,
                            data: valuesDictionary,
                            configuration: []
                        }

                        for (const [key, entry] of Object.entries(valuesDictionary)) {
                            const actionConfigurationValue = ParsedWorkflowDefinition.resolveActionConfigurationEntryValue(entry)
                            actionConfiguration.configuration.push({
                                path: key,
                                name: actionConfigurationValue.name,
                                key: actionConfigurationValue.key,
                                value: actionConfigurationValue.value,
                                type: actionConfigurationValue.type
                            })
                        }

                        dependencies[contractId].connections[connectionId].actions[actionId] = actionConfiguration
                    }
                }
            }
        }
        return dependencies
    }

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

    private static resolveActionConfigurationEntryValue(entry: { parameter: OpenAPIV2.Parameter, value: any }): ActionConfigurationEntryValue {
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
            const values = Object.keys(entry.value.value).map<ActionConfigurationEntryValue>((key) => {
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
}
