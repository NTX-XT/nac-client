import { arrayToDictionary, findOperation, flattenTree } from "../../utils";
import { OpenAPIV2 } from "openapi-types";
import { action, connection, workflowDatasources, workflowDefinition, workflowStartEvent, xtensionUsage } from "../../nac";
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
import { Datasource } from "../models/datasource";
import { FormVariable } from "../models/formVariable";
import { FormControlDatasourceConfig } from "../models/formVariableConfig";
import { FormHelper } from "./formHelper";
import { Contract } from "../models/contract";
import { FormControl } from "../models/formControl";
import { ParameterDeclaration } from "ts-morph";

export class WorkflowHelper {
    static parseDefinition = (definition: string): workflowDefinition => JSON.parse(definition)
    static stringifyDefinition = (definition: workflowDefinition): string => JSON.stringify(definition)
    static ensureWorkflowId = (definition: workflowDefinition, workflowId: string): void => { definition.settings.id = workflowId }

    static resolveActionConfigurationEntryValue = (entry: { parameter: OpenAPIV2.Parameter | string, value: any }): ActionConfigurationEntryValue => {
        if (typeof (entry.parameter) === "string" || entry.parameter instanceof String) {
            return {
                key: entry.parameter.toString(),
                value: entry.value,
                name: entry.parameter.toString(),
                type: "value"
            }
        }
        if (entry.value === undefined) {
            return {
                key: entry.parameter.name,
                value: undefined,
                name: entry.parameter["x-ntx-summary"],
                type: "value"
            }
        }
        if (entry.parameter.type === "string" && entry.value.literal) {
            return {
                key: entry.parameter.name,
                value: entry.value.literal,
                name: entry.parameter["x-ntx-summary"],
                type: "value"
            }
        }
        if (entry.parameter.type === "string" && entry.value.variable) {
            return {
                key: entry.parameter.name,
                value: entry.value.variable.name,
                name: entry.parameter["x-ntx-summary"],
                type: "variable"
            }
        }
        if (entry.parameter.schema && entry.parameter.schema.type === "object" && entry.value.value) {
            const values = Object.keys(entry.value.value).map<ActionConfigurationEntryValue>((key) => ({
                key: key,
                name: entry.value.value[key].schema.title,
                value: entry.value.value[key].literal ? entry.value.value[key].literal : (entry.value.value[key].variable ? entry.value.value[key].variable.name : (entry.parameter as OpenAPIV2.Parameter).name),
                type: entry.value.value[key].literal ? "value" : (entry.value.value[key].variable ? "variable" : "unsupported")
            }))
            return {
                key: entry.parameter.name,
                value: values,
                name: entry.parameter["x-ntx-summary"],
                type: "dictionary"
            }
        }

        return {
            key: entry.parameter.name,
            name: entry.parameter["x-ntx-summary"] ?? entry.parameter.name,
            type: "unsupported",
            value: undefined
        }
    }

    static actionsArray = (definition: workflowDefinition): action[] => flattenTree(definition.actions, "next", "children")
    static actionsDictionary = (definition: workflowDefinition): { [key: string]: action; } => arrayToDictionary(WorkflowHelper.actionsArray(definition), "id")

    static dependencies = (definition: workflowDefinition, forms: WorkflowForms): WorkflowDependencies => {
        const dependencies: { [key: string]: ContractDependency; } = {}
        this.ensureDatasources(definition, forms)
        this.resolveConnectionDependencies(dependencies, definition)
        this.resolveDatasourceDependencies(dependencies, definition.settings.datasources, forms)
        return {
            contracts: dependencies,
            workflows: this.workflowDependencies(definition),
        }
    }

    static allContractDependencies = (dependencies: WorkflowDependencies): ContractDependency[] => Object.values(dependencies.contracts)
    static allWorkflowDependencies = (dependencies: WorkflowDependencies): WorkflowDependency[] => Object.values(dependencies.workflows)
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

    private static _addToDatasource = (datasources: workflowDatasources, form: Form, datasourceId: string) => {
        const formKey = form.formType === 'startform' ? "startForm" : form.id
        if (!(datasources[formKey])) {
            datasources[formKey] = {
                sources: [],
                type: form.formType === 'startform' ? "startForm" : "taskForm"
            }
        }
        const foundDatasourceId = datasources[formKey].sources.find(source => source.id === datasourceId)
        if (!foundDatasourceId) {
            datasources[formKey].sources.push({
                id: datasourceId
            })
        }
    }

    private static ensureDatasources = (definition: workflowDefinition, forms: WorkflowForms) => {
        const datasources: workflowDatasources = definition.settings.datasources ?? {}
        const allForms = forms.taskForms ? Object.values(forms.taskForms) : []

        if (forms.startForm) {
            allForms.push(forms.startForm)
        }

        for (const form of allForms) {
            const controls = FormHelper.allFormControls(form.rows)
            for (const control of controls) {
                if (control.properties.dataSourceConfiguration) {
                    this._addToDatasource(datasources, form, control.properties.dataSourceConfiguration.dataSourceId)
                }
            }

            for (const variable of form.variableContext.variables) {
                if (variable.config?.dataSourceId) {
                    this._addToDatasource(datasources, form, variable.config.dataSourceId)
                }
            }
        }
        definition.settings.datasources = datasources
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
                        workflowId: referencedWorkflowId,
                        workflowName: referencedWorkflowId,
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
                let byConnectionId = false
                const action = WorkflowHelper.actionsDictionary(definition)[actionId]
                let connection = ActionHelper.getConnection(ActionHelper.getXtensionInputParameter(action))
                if (!connection) {
                    const parameter = ActionHelper.getConnectionIdParameter(action)
                    const connectionId = ActionHelper.getParameterValue(parameter)
                    byConnectionId = true
                    connection = {
                        id: connectionId,
                        contractId: contractId,
                        contractName: "",
                        displayName: connectionId,
                    }
                }
                if (connection) {
                    const dependencyKey = connection.id === 'undefined' ? connection.displayName : connection.id
                    const needsResolution = (connection.id === 'undefined' || connection.displayName === connection.id)
                    if (!(dependencies[contractId].connections[dependencyKey])) {
                        dependencies[contractId].connections[dependencyKey] = {
                            connectionName: connection.displayName,
                            connectionId: connection.id,
                            contractId: contractId,
                            actions: {},
                            datasources: {},
                            needsResolution: needsResolution
                        }
                    }
                    if (dependencies[contractId].contractName === "") {
                        dependencies[contractId].contractName = connection.contractName
                    }
                    const valuesDictionary: { [key: string]: { parameter: OpenAPIV2.Parameter | string, value: any } } = {}
                    const operationId = byConnectionId ? action.configuration.operationId! : action.configuration.xtension!.operationId
                    const document: OpenAPIV2.Document = definition.inUseXtensions[contractId].xtension
                    const operation = findOperation(document.paths, operationId)
                    if (operation) {
                        if (!byConnectionId) {
                            const values = ActionHelper.getXtensionInputValue(action)
                            for (const p of operation.parameters!) {
                                const parameter: OpenAPIV2.Parameter = p as OpenAPIV2.Parameter
                                const key = `${operation.operationId}.${parameter.in}.${parameter.name}`
                                valuesDictionary[key] = {
                                    parameter: parameter,
                                    value: values[key]
                                }
                            }
                        } else {
                            const property = ActionHelper.getConnectionIdProperty(action)
                            for (const parameter of property!.parameters.filter(p => (!p.hidden))) {
                                const key = `${operation.operationId}.${parameter.direction}.${parameter.name}`
                                valuesDictionary[key] = {
                                    parameter: parameter.name,
                                    value: parameter.value.primitiveValue.valueType.data.value
                                }
                            }
                        }
                    }
                    const actionConfiguration: ActionConfiguration = {
                        actionId: actionId,
                        name: action.configuration.name,
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

    private static resolveDatasourceDependencies = (dependencies: { [key: string]: ContractDependency; }, datasources: workflowDatasources, forms: WorkflowForms): void => {
        for (const formId of Object.keys(datasources)) {
            for (const source of datasources[formId].sources) {
                const form = datasources[formId].type === "startForm" ? forms.startForm! : forms.taskForms![formId]
                const connection = FormHelper.getFormDatasourceConnection(source.id, form)
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
                                contractId: connection.contractId,
                                connectionName: connection.displayName,
                                actions: {},
                                datasources: {},
                                needsResolution: false
                            }
                        }
                    }
                    if (!(dependencies[dependencyKey].connections[connection.id].datasources[source.id])) {
                        const config = FormHelper.getFormDatasourceConfiguration(source.id, form)
                        dependencies[dependencyKey].connections[connection.id].datasources[source.id] = {
                            datasourceId: source.id,
                            connectionId: connection.id,
                            contractId: dependencyKey,
                            name: config?.dataSourceLabel,
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

    static swapConnection = (workflow: Workflow, connectionId: string, newConnection: Connection, connectionName: string, newContract: Contract, newContractSchema: OpenAPIV2.Document): void => {
        let dependency = WorkflowHelper.allConnectionDependencies(workflow.dependencies).find(cn => cn.connectionId === connectionId)
        if (!dependency) {
            // Use case: Find invalid connections with the same name as the new one of imported workflows based on out-of-the-box contracts
            dependency = WorkflowHelper.allConnectionDependencies(workflow.dependencies).find(cn => cn.connectionName === newConnection.name && cn.contractId === newConnection.contractId && cn.needsResolution)
        }
        if (!dependency) {
            // Use case: Find invalid connections of imported workflows based on custom contracts
            dependency = WorkflowHelper.allConnectionDependencies(workflow.dependencies).find(cn => cn.connectionName === connectionName && cn.needsResolution)
        }
        const currentContractId = dependency?.contractId
        if (dependency) {
            const contractDependency = workflow.dependencies.contracts[newConnection.contractId]
            if (!contractDependency) {
                // Use case: Swapping connections of custom contracts
                workflow.dependencies.contracts[newConnection.contractId] = {
                    contractId: newConnection.contractId,
                    contractName: newConnection.NACObejct.contractName,
                    needsResolution: false,
                    connections: {}
                }
            }
            let newConnectionDependency = workflow.dependencies.contracts[newConnection.contractId].connections[newConnection.id]
            if (!(newConnectionDependency)) {
                workflow.dependencies.contracts[newConnection.contractId].connections[newConnection.id] = {
                    actions: {},
                    connectionId: newConnection.id,
                    contractId: newConnection.contractId,
                    connectionName: newConnection.name,
                    needsResolution: false,
                    datasources: {}
                }
                newConnectionDependency = workflow.dependencies.contracts[newConnection.contractId].connections[newConnection.id]
            }
            for (const actionId of Object.keys(dependency.actions)) {
                const dic = WorkflowHelper.actionsDictionary(workflow.definition)
                const action = dic[actionId]
                const newClassName = newContract.actions.find(a => a.name === action.configuration.originalName)?.type
                const value = ActionHelper.getXtensionInput(action)
                if (value) {
                    value.data = newConnection.NACObejct
                    value.literal = newConnection.id
                } else {
                    const parameter = ActionHelper.getConnectionIdParameter(action)
                    parameter!.value.primitiveValue.valueType.data.value = newConnection.id
                    const property = ActionHelper.getConnectionIdProperty(action)
                    for (const param of property!.parameters) {
                        if (param.value.primitiveValue?.valueType?.data?.value) {
                            param.value.primitiveValue.valueType.data.value = parameter!.value.primitiveValue.valueType.data.value.split('/undefined/').join(`/${newConnection.id}/`)
                        }
                    }
                }
                newConnectionDependency.actions[actionId] = dependency.actions[actionId]
                action.configuration.image.canvasSrc = newContract.icon
                action.configuration.image.configPanelSrc = newContract.icon
                action.configuration.image.toolboxSrc = newContract.icon
                action.configuration.xtension!.id = newContract.id
                if ((currentContractId) && currentContractId !== newContract.id) {
                    for (const property of action.configuration.properties) {
                        for (const parameter of property.parameters) {
                            if ((parameter.dataType.subType) && (parameter.dataType.subType.startsWith(currentContractId))) {
                                parameter.dataType.subType = `${newContract.id}|${newClassName!}`
                            }
                            if (parameter.value) {
                                if (parameter.value.variable) {
                                    if (parameter.value.variable.valueType) {
                                        if (parameter.value.variable.valueType.type) {
                                            if (parameter.value.variable.valueType.type.subType) {
                                                if (parameter.value.variable.valueType.type.subType.startsWith(currentContractId)) {
                                                    parameter.value.variable.valueType.type.subType = `${newContract.id}|${newClassName!}`
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    for (const variable of workflow.definition.variables) {
                        if ((variable.dataType.subType) && variable.dataType.subType.startsWith(currentContractId)) {
                            variable.dataType.subType = `${newContract.id}|${newClassName!}`
                        }
                    }
                }
                if (action.className.startsWith('xtension')) {
                    if (newClassName) {
                        action.className = newClassName
                        action.configuration.serverInfo.className = newClassName
                    }
                }
            }
            dependency.actions = {}
            if (Object.values(dependency.actions).length === 0 && Object.values(dependency.datasources).length === 0) {
                if (dependency.needsResolution)
                    delete workflow.dependencies.contracts[dependency.contractId].connections[dependency.connectionName]
                else {
                    delete workflow.dependencies.contracts[dependency.contractId].connections[dependency.connectionId]
                }
            }
            if (Object.values(workflow.dependencies.contracts[dependency.contractId].connections).length === 0) {
                delete workflow.dependencies.contracts[dependency.contractId]
            }
            if ((currentContractId) && currentContractId !== newContract.id) {
                const existingInUseXtensionRecord = workflow.definition.inUseXtensions[currentContractId]
                const newInUseXtensionUsage: xtensionUsage = {
                    usedByActionIds: existingInUseXtensionRecord.usedByActionIds,
                    usedByEventIds: existingInUseXtensionRecord.usedByEventIds,
                    xtension: newContractSchema
                }
                workflow.definition.inUseXtensions[newContract.id] = newInUseXtensionUsage
                delete workflow.definition.inUseXtensions[currentContractId]
            }
        }
    }

    static swapDatasource = (workflow: Workflow, datasourceId: string, newDatasource: Datasource, newConnection: Connection): void => {
        const dependency = WorkflowHelper.allDatasourceDependencies(workflow.dependencies).find(ds => ds.datasourceId === datasourceId)
        if (dependency) {
            for (const formId of dependency.formIds) {
                const form = (formId === 'startForm' ? workflow.forms.startForm : workflow.forms.taskForms![formId])!
                const allControls = FormHelper.getFormDatasourceControls(datasourceId, form)
                for (const control of allControls) {
                    const datasourceConfiguration = FormHelper.getFormDatasourceControlConfig(control)
                    datasourceConfiguration.dataSourceId = newDatasource.id
                    datasourceConfiguration.dataSourceLabel = newDatasource.name
                    const configNode = FormHelper.getDatasourceConnectionIdNode(datasourceConfiguration)
                    if (configNode) {
                        configNode.literal = newConnection.id
                        configNode.data = newConnection.NACObejct
                    }
                    if (control.properties.items) {
                        control.properties.items.dataSourceId = newDatasource.id
                        for (const key of Object.keys(control.properties.items.config.value)) {
                            if (key.endsWith(KnownStrings.NTXConnectionId)) {
                                control.properties.items.config.value[key].literal = newConnection.id
                                control.properties.items.config.value[key].data = newConnection.NACObejct
                            }
                        }
                    }
                }
                const allVariables = FormHelper.getFormDatasourceVariables(datasourceId, form)
                for (const variable of allVariables) {
                    const datasourceConfiguration = FormHelper.getFormDatasourceVariableConfig(variable)
                    datasourceConfiguration.dataSourceId = newDatasource.id
                    datasourceConfiguration.dataSourceLabel = newDatasource.name
                    const configNode = FormHelper.getDatasourceConnectionIdNode(datasourceConfiguration)
                    if (configNode) {
                        configNode.literal = newConnection.id
                        configNode.data = newConnection.NACObejct
                    }
                }
                form.dataSourceContext![newDatasource.id] = { id: newDatasource.id }
                delete form.dataSourceContext![datasourceId]

                if (formId === 'startForm') {
                    workflow.startEvents!.find(event => event.eventType === 'nintex:form')!.webformDefinition = JSON.stringify(form)
                } else {
                    workflow.definition.forms[formId] = form
                }
                const key = formId === 'startForm' ? 'startForm' : formId
                for (const source of workflow.definition.settings.datasources[key].sources) {
                    if (source.id === datasourceId) {
                        source.id = newDatasource.id
                    }
                }
            }
            let connectionDependency = workflow.dependencies.contracts[newConnection.contractId].connections[newConnection.id]
            if (!(connectionDependency)) {
                workflow.dependencies.contracts[newConnection.contractId].connections[newConnection.id] = {
                    actions: {},
                    connectionId: newConnection.id,
                    contractId: newConnection.contractId,
                    connectionName: newConnection.name,
                    needsResolution: false,
                    datasources: {}
                }
                connectionDependency = workflow.dependencies.contracts[newConnection.contractId].connections[newConnection.id]
            }
            if (!(connectionDependency.datasources[newDatasource.id])) {
                connectionDependency.datasources[newDatasource.id] = {
                    datasourceId: newDatasource.id,
                    connectionId: newDatasource.connectionId,
                    contractId: newDatasource.contractId,
                    formIds: []
                }
            }
            connectionDependency.datasources[newDatasource.id].formIds = dependency.formIds
            delete workflow.dependencies.contracts[dependency.contractId].connections[dependency.connectionId].datasources[datasourceId]
        }
    }

    static swapWorkflowDependency = (workflow: Workflow, existingWorkflowId: string, newWorkflowId: string): void => {
        const dependency = WorkflowHelper.allWorkflowDependencies(workflow.dependencies).find(dep => dep.workflowId === existingWorkflowId)
        if (dependency) {
            for (const actionId of dependency.actionIds) {
                const action = WorkflowHelper.actionsDictionary(workflow.definition)[actionId]
                const parameter = ActionHelper.getComponentWorkflowIdParameter(action)
                if (parameter) {
                    parameter.value.primitiveValue.valueType.data.value = newWorkflowId
                }
            }

            workflow.dependencies.workflows[newWorkflowId] = {
                workflowId: newWorkflowId,
                workflowName: newWorkflowId,
                actionIds: dependency.actionIds
            }

            delete workflow.dependencies.workflows[existingWorkflowId]
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