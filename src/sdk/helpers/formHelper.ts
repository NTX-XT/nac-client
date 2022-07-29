import { isForm, isFormControl } from "../../typeGuards"
import { connection } from "../../nwc"
import { KnownStrings } from "../../utils/knownStrings"
import { Form } from "../models/form"
import { FormControl } from "../models/formControl"
import { FormVariable } from "../models/formVariable"
import { FormControlDatasourceConfig } from "../models/formVariableConfig"

export class FormHelper {
    static allFormControls = (rows: { controls: FormControl[] }[], allControls: FormControl[] = []): FormControl[] => {
        for (const row of rows) {
            for (const control of row.controls) {
                allControls.push(control)
                if ((control.properties.rows)) {
                    this.allFormControls(control.properties.rows, allControls)
                }
            }
        }
        return allControls
    }

    static getFormDatasourceControls = (datasourceId: string, form: Form): FormControl[] => {
        const allControls = this.allFormControls(form.rows)
        const matchedControls: FormControl[] = []
        for (const control of allControls) {
            if (control.properties.dataSourceConfiguration && control.properties.dataSourceConfiguration.dataSourceId === datasourceId) {
                matchedControls.push(control)
            }
        }
        return matchedControls
    }

    static getFormDatasourceControlConfig = (control: any): FormControlDatasourceConfig =>
        control.properties.dataSourceConfiguration

    static getFormDatasourceVariables = (datasourceId: string, form: Form): FormVariable[] => {
        const matchedVariables: FormVariable[] = []
        for (const variable of form.variableContext.variables) {
            if ((variable.config) && variable.config.dataSourceId === datasourceId) {
                matchedVariables.push(variable)
            }
        }
        return matchedVariables
    }

    static getFormDatasourceVariableConfig = (variable: FormVariable): FormControlDatasourceConfig => variable.config

    static getDatasourceConnectionIdNode = (controlDatasourceConfiguration: FormControlDatasourceConfig): any => {
        for (const key of Object.keys(controlDatasourceConfiguration.config.value)) {
            if (key.endsWith(KnownStrings.NTXConnectionId)) {
                return controlDatasourceConfiguration.config.value[key]
            }
        }
    }

    static getDatasourceConnection = (item: FormControl | FormVariable): connection | undefined => {
        const config = isFormControl(item) ? FormHelper.getFormDatasourceControlConfig(item) : FormHelper.getFormDatasourceVariableConfig(item)
        return (config) ? this.getDatasourceConnectionIdNode(config)?.data : undefined
    }


    static getFormDatasourceConfiguration = (datasourseId: string, form: Form): FormControlDatasourceConfig | undefined => {
        const controls = this.getFormDatasourceControls(datasourseId, form)
        if (controls.length > 0) {
            return this.getFormDatasourceControlConfig(controls[0])
        }
        const variables = this.getFormDatasourceVariables(datasourseId, form)
        if (variables.length > 0) {
            return this.getFormDatasourceVariableConfig(variables[0])
        }
        return undefined
    }

    static getFormDatasourceConnection = (datasourseId: string, form: Form): connection | undefined => {
        const variables = this.getFormDatasourceVariables(datasourseId, form)
        if (variables.length > 0) {
            return this.getDatasourceConnection(variables[0])
        } else {
            const controls = this.getFormDatasourceControls(datasourseId, form)
            if (controls.length > 0) {
                return this.getDatasourceConnection(controls[0])
            }
        }
    }
}