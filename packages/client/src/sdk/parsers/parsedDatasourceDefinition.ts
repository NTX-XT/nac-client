import { KnownStrings } from "client/src/utils/knownStrings";
import jsonSchemaTraverse from "json-schema-traverse";

export class parsedDatasourceDefinition {
    private _parsedDefinition: any;
    public get parsedDefinition(): any {
        return this._parsedDefinition;
    }

    private _originalDefinition: string;
    public get originalDefinition(): string {
        return this._originalDefinition;
    }

    private _generalisedDefinition: string;
    public get generalisedDefinition(): string {
        return this._generalisedDefinition;
    }

    private _connectionId: string | undefined;
    public get connectionId(): string | undefined {
        return this._connectionId;
    }

    private _contractId: string | undefined;
    public get contractId(): string | undefined {
        return this._contractId;
    }

    constructor(definition: string) {
        this._originalDefinition = definition
        this._parsedDefinition = JSON.parse(definition)
        const definitionCopy = JSON.parse(definition)
        jsonSchemaTraverse(definitionCopy, { allKeys: true, cb: this.parseNode })
        this._generalisedDefinition = JSON.stringify(definitionCopy)
    }

    private parseNode = (schema: jsonSchemaTraverse.SchemaObject, path: string) => {
        if (path.endsWith(KnownStrings.NTXConnectionId)) {
            if (schema.schema?.title === 'Connection') {
                this._connectionId = schema.literal
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
            this._contractId = schema.literal
            schema.literal = KnownStrings.ContractIdToken
            schema.data = KnownStrings.ContractToken
        }
    };
}
