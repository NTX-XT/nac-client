import { Datasource } from "../models/datasource";
import jsonSchemaTraverse from "json-schema-traverse";
import { KnownStrings } from "../../utils/knownStrings";
import { datasourcePayload } from "../../nac";

export class DatasourceHelper {
    static ensureConnectionInDefinition = (definition: string, newConnectionId: string): string => {
        const details = this.processDefinition(definition)
        if (details.connectionId !== newConnectionId) {
            definition = definition.split(details.connectionId).join(newConnectionId)
        }
        return definition
    }

    static parseDefinition = (definition: string): any => JSON.parse(definition)
    static stringifyDefinition = (definition: any): string => JSON.stringify(definition)
    static processDefinition = (definition: string): { generilisedDefinition: any, contractId: string, connectionId: string } => {
        const definitionCopy = JSON.parse(definition)
        let connectionId: string | undefined
        let contractId: string | undefined
        const parseNode = (schema: jsonSchemaTraverse.SchemaObject, path: string) => {
            if (path.endsWith(KnownStrings.NTXConnectionId)) {
                if (schema.schema?.title === 'Connection') {
                    connectionId = schema.literal
                    schema.literal = KnownStrings.ConnectionIdToken
                    schema.data = KnownStrings.ConnectionToken
                }
            } else {
                const entry = Object.keys(schema).find((entry) => entry.endsWith('NTX_CONNECTION_ID'))
                if (entry && (typeof schema[entry] === "string" || schema[entry] instanceof String)) {
                    schema[entry] = KnownStrings.ConnectionIdToken
                }
            }
            if (path.endsWith('connector')) {
                contractId = schema.literal
                schema.literal = KnownStrings.ContractIdToken
                schema.data = KnownStrings.ContractToken
            }
        };

        jsonSchemaTraverse(definitionCopy, { allKeys: true, cb: parseNode })

        return {
            generilisedDefinition: JSON.stringify(definitionCopy),
            connectionId: connectionId!,
            contractId: contractId!
        }
    }
}