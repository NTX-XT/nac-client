/* eslint-disable @typescript-eslint/no-namespace */
import { OpenAPIV2 } from 'openapi-types'
import { Collection } from 'postman-collection'

import swaggerSpec from './NintexWorkflowCloudeXtended.swagger.json';
import postmanSpec from './NintexWorkflowCloudeXtended.postman_collection.json';

export namespace Specifications {
    export const swagger = (): OpenAPIV2.Document => JSON.parse(JSON.stringify(swaggerSpec));
    export const postman = (): Collection => JSON.parse(JSON.stringify(postmanSpec));
}
