export interface dataSourceVariableMethod {
    literal?: string
    schema?: any
    data?: any
    value?: any
}

export interface dataSourceVariable {
    dataSourceId: string,
    config: {
        schema: {
            type: string
            "x-ntx-variables": boolean
            required: string[]
        }
        value: { [key: string]: dataSourceVariableMethod }
    }
}

export interface formVariable {
    id: string,
    connectedVariableId: string,
    displayName: string
    dataType: {
        type: string
        format: string
    }
    formula?: {
        raw: string
        compiled: string
        usedVariableIds: string
    }
    formModes?: number[]
    formScopes?: any[]
    config?: dataSourceVariable
}

export interface formDefinition {
    id?: string;
    name?: string;
    ruleGroups: any[]
    theme: any
    pageSettings: any
    version: number
    formType: string
    contract: any
    variableContext: { variables: formVariable[] }
    settings: any
    rows: any[]
    dataSourceContext: { [key: string]: { id: string } }
    submissionConfig: any
}