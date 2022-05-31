import { arrayToDictionary, findOperation, flattenTree } from "../../utils";
import { OpenAPIV2 } from "openapi-types";
import { action, connection, workflowDatasources, workflowDefinition, workflowStartEvent } from "../../nwc";
import { ActionConfigurationEntryValue } from "../models/actionConfigurationEntryValue";
import { WorkflowDependency } from "../models/workflowDependency";
import { ActionHelper } from "./actionHelper";
import { ContractDependency } from "../models/contractDependency";
import { ActionConfiguration } from "../models/connectionDependencyActionConfiguration";
import { Form } from "../models/form";
import { KnownStrings } from "../../utils/knownStrings";
import { WorkflowForms } from "../models/workflowForms";
import { WorkflowDependencies } from "../models/workflowDependencies";
import { Connection } from "../models/connection";
import { Workflow } from "../models/workflow";
import { ConnectionDependency } from "../models/connectionDependency";
import { DatasourceDependency } from "../models/datasourceDependency";

export class WorkflowHelper {
    static parseDefinition = (definition: string): workflowDefinition => JSON.parse(definition)
    static stringifyDefinition = (definition: workflowDefinition): string => JSON.stringify(definition)
    static ensureWorkflowId = (definition: workflowDefinition, workflowId: string): void => { definition.settings.id = workflowId }

    static resolveActionConfigurationEntryValue = (entry: { parameter: OpenAPIV2.Parameter, value: any }): ActionConfigurationEntryValue => {
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

    static actionsArray = (definition: workflowDefinition): action[] => flattenTree(definition.actions, "next", "children")
    static actionsDictionary = (definition: workflowDefinition): { [key: string]: action; } => arrayToDictionary(WorkflowHelper.actionsArray(definition), "id")

    static dependencies = (definition: workflowDefinition, datasources: string, forms: WorkflowForms): WorkflowDependencies => {
        const dependencies: { [key: string]: ContractDependency; } = {}
        this.resolveConnectionDependencies(dependencies, definition)
        if (datasources !== "") {
            this.resolveDatasourceDependencies(dependencies, JSON.parse(datasources), forms)
        }
        return {
            contracts: dependencies,
            workflows: this.workflowDependencies(definition),
        }
    }

    static allContractDependencies = (dependencies: WorkflowDependencies): ContractDependency[] => Object.values(dependencies.contracts)
    static allConnectionDependencies = (dependencies: WorkflowDependencies): ConnectionDependency[] => {
        const connectionDependencies: ConnectionDependency[] = []
        this.allContractDependencies(dependencies).map((dep) =>
            Object.values(dep.connections).map((cn) =>
                connectionDependencies.push(cn)
            )
        )
        return connectionDependencies
    }

    static allDatasourceDependencies = (dependencies: WorkflowDependencies): DatasourceDependency[] => {
        const datasourceDependencies: DatasourceDependency[] = []
        this.allConnectionDependencies(dependencies).map((dep) =>
            Object.values(dep.datasources).map((ds) =>
                datasourceDependencies.push(ds)
            )
        )
        return datasourceDependencies
    }



    private static workflowDependencies = (definition: workflowDefinition): { [key: string]: WorkflowDependency; } => {
        const dependencies: { [key: string]: WorkflowDependency; } = {}
        const componentWorkflowActions = WorkflowHelper.actionsArray(definition).filter(action => {
            return action.className === 'engine:startworkflow'
        })
        for (const action of componentWorkflowActions) {
            const referencedWorkflowId = ActionHelper.getComponentWorkflowIdValue(action)
            if (referencedWorkflowId) {
                if (!dependencies[referencedWorkflowId]) {
                    dependencies[referencedWorkflowId] = {

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

    private static resolveConnectionDependencies = (dependencies: { [key: string]: ContractDependency; }, definition: workflowDefinition): void => {
        for (const contractId of Object.keys(definition.inUseXtensions)) {
            if (!(dependencies[contractId])) {
                dependencies[contractId] = {
                    contractId: contractId,
                    contractName: "",
                    connections: {},
                    needsResolution: false
                }
            }
            for (const actionId of definition.inUseXtensions[contractId].usedByActionIds) {
                const action = WorkflowHelper.actionsDictionary(definition)[actionId]
                const connection = ActionHelper.getConnection(ActionHelper.getXtensionInputParameter(action))
                if (connection) {
                    const dependencyKey = connection.id === 'undefined' ? connection.displayName : connection.id
                    const needsResolution = (connection.id === 'undefined')
                    if (!(dependencies[contractId].connections[dependencyKey])) {
                        dependencies[contractId].connections[dependencyKey] = {
                            connectionName: connection.displayName,
                            connectionId: connection.id,
                            actions: {},
                            datasources: {},
                            needsResolution: needsResolution
                        }
                    }
                    if (dependencies[contractId].contractName === "") {
                        dependencies[contractId].contractName = connection.contractName
                    }
                    const operationId = WorkflowHelper.actionsDictionary(definition)[actionId].configuration.xtension!.operationId
                    const document: OpenAPIV2.Document = definition.inUseXtensions[contractId].xtension as OpenAPIV2.Document
                    const operation = findOperation(document.paths, operationId)
                    if (operation) {
                        const values = ActionHelper.getXtensionInputValue(WorkflowHelper.actionsDictionary(definition)[actionId])
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
                            const actionConfigurationValue = WorkflowHelper.resolveActionConfigurationEntryValue(entry)
                            actionConfiguration.configuration.push({
                                path: key,
                                name: actionConfigurationValue.name,
                                key: actionConfigurationValue.key,
                                value: actionConfigurationValue.value,
                                type: actionConfigurationValue.type
                            })
                        }

                        dependencies[contractId].connections[dependencyKey].actions[actionId] = actionConfiguration
                    }
                }
            }
        }
    }

    private static resolveDatasourceDependencies = (dependencies: { [key: string]: ContractDependency; }, datasources: workflowDatasources, forms: WorkflowForms): void => {
        for (const formId of Object.keys(datasources)) {
            for (const source of datasources[formId].sources) {
                const form = datasources[formId].type === "startForm" ? forms.startForm! : forms.taskForms![formId]
                const connection = this.getDatasourceConnection(source.id, form)
                if (connection) {
                    let dependencyKey = connection.contractId ?? connection.contractName
                    let needsResolution = (!connection.contractId)
                    if (!connection.contractId) {
                        for (const key of Object.keys(dependencies)) {
                            if (dependencies[key].contractName === connection.contractName) {
                                dependencyKey = key
                                needsResolution = false
                            }
                        }
                    }
                    if (!(dependencies[dependencyKey])) {
                        dependencies[dependencyKey] = {
                            contractId: connection.contractId,
                            contractName: connection.contractName,
                            connections: {},
                            needsResolution: needsResolution
                        }
                    }
                    if (!(dependencies[dependencyKey].connections[connection.id])) {
                        if (dependencies[dependencyKey].connections[connection.displayName]) {
                            dependencies[dependencyKey].connections[connection.id] = dependencies[dependencyKey].connections[connection.displayName]
                            dependencies[dependencyKey].connections[connection.id].connectionId = connection.id
                            dependencies[dependencyKey].connections[connection.id].needsResolution = false
                            delete dependencies[dependencyKey].connections[connection.displayName]
                        } else {
                            dependencies[dependencyKey].connections[connection.id] = {
                                connectionId: connection.id,
                                connectionName: connection.displayName,
                                actions: {},
                                datasources: {},
                                needsResolution: false
                            }
                        }
                    }
                    if (!(dependencies[dependencyKey].connections[connection.id].datasources[source.id])) {
                        dependencies[dependencyKey].connections[connection.id].datasources[source.id] = {
                            datasourceId: source.id,
                            formIds: []
                        }
                    }
                    dependencies[dependencyKey].connections[connection.id].datasources[source.id].formIds.push(formId)
                }
            }
        }
    }

    static forms = (definition: workflowDefinition, startEvents?: workflowStartEvent[]): WorkflowForms => {
        const taskForms: { [key: string]: Form } = {}
        for (const key of Object.keys(definition.forms)) {
            taskForms[key] = JSON.parse(definition.forms[key])
        }
        return {
            taskForms: taskForms,
            startForm: startEvents?.find(event => event.eventType === 'nintex:form')?.webformDefinition
                ? JSON.parse(startEvents!.find(event => event.eventType === 'nintex:form')!.webformDefinition!) as Form
                : undefined
        }
    }

    private static getDatasourceConnection = (datasourceId: string, form: Form): connection | undefined => {
        for (const row of form.rows) {
            for (const control of row.controls) {
                if (control.properties.dataSourceConfiguration && control.properties.dataSourceConfiguration.dataSourceId === datasourceId) {
                    for (const key of Object.keys(control.properties.dataSourceConfiguration.config.value)) {
                        if (key.endsWith(KnownStrings.NTXConnectionId)) {
                            return control.properties.dataSourceConfiguration.config.value[key].data
                        }
                    }
                }
            }
        }
        for (const variable of form.variableContext.variables) {
            if (variable.config.dataSourceId === datasourceId) {
                for (const key of Object.keys(variable.config.config.value)) {
                    if (key.endsWith(KnownStrings.NTXConnectionId)) {
                        return variable.config.config.value[key].data
                    }
                }
            }
        }
    }

    static swapConnection = (workflow: Workflow, connectionId: string, newConnection: Connection): void => {
        const dependency = WorkflowHelper.allConnectionDependencies(workflow.dependencies).find(cn => cn.connectionId === connectionId)
        if (dependency) {
            for (const actionId of Object.keys(dependency.actions)) {
                const dic = WorkflowHelper.actionsDictionary(workflow.definition)
                const value = ActionHelper.getXtensionInput(dic[actionId])
                value.data = newConnection.nwcObject
                value.literal = newConnection.id
            }
        }
    }

    static findConnectionDependency = (workflow: Workflow, connectionId: string): ConnectionDependency | undefined => {
        for (const contractId in workflow.dependencies.contracts) {
            if (workflow.dependencies.contracts[contractId].connections[connectionId]) {
                return workflow.dependencies.contracts[contractId].connections[connectionId]
            }
        }
        return undefined
    }
}