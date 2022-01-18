/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { OpenAPIConfig } from './OpenAPI';
import type { CancelablePromise } from './CancelablePromise';

export class BaseHttpRequest {
    readonly openApiConfig: OpenAPIConfig;

    constructor(openApiConfig: OpenAPIConfig) {
        this.openApiConfig = openApiConfig;
    }

    request<T>(options: ApiRequestOptions): CancelablePromise<T> {
        throw new Error('Not Implemented');
    }
}