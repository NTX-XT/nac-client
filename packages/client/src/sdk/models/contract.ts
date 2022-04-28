import { OpenAPIV2 } from 'openapi-types'
import { ConnectionSchemaProperty } from './connectionSchemaProperty';
export interface Contract {
    id: string;
    name: string;
    description?: string;
    appId: string;
    schema: OpenAPIV2.Document;
    connectionProperties: { [key: string]: ConnectionSchemaProperty; }
}
