/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';
import { Service } from './services/Service';

export class Nwc extends Service {
    readonly request: BaseHttpRequest;

    constructor(openApiConfig?: OpenAPIConfig, HttpRequest: new (config: OpenAPIConfig) => BaseHttpRequest = AxiosHttpRequest) {
        const request = new HttpRequest({
            BASE: openApiConfig?.BASE ?? 'https://us.nintex.io',
            VERSION: openApiConfig?.VERSION ?? '1.0.0',
            WITH_CREDENTIALS: openApiConfig?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: openApiConfig?.CREDENTIALS ?? 'include',
            TOKEN: openApiConfig?.TOKEN,
            USERNAME: openApiConfig?.USERNAME,
            PASSWORD: openApiConfig?.PASSWORD,
            HEADERS: openApiConfig?.HEADERS,
            ENCODE_PATH: openApiConfig?.ENCODE_PATH,
        });
        super(request);
        this.request = request;
    }
}