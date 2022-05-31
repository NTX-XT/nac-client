export interface Datasource {
    id: string
    name: string
    contractId: string
    connectionId: string
    operationId: string
    isValid: boolean,
    definition: string,
    description: string
}
