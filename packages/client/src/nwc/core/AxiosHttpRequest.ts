/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import FormData from 'form-data';

import { ApiError } from './ApiError';
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';
import { CancelablePromise } from './CancelablePromise';
import type { OnCancel } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';
import { BaseHttpRequest } from './BaseHttpRequest';
function isDefined<T>(value: T | null | undefined): value is Exclude<T, null | undefined> {
    return value !== undefined && value !== null;
}

function isString(value: any): value is string {
    return typeof value === 'string';
}

function isStringWithValue(value: any): value is string {
    return isString(value) && value !== '';
}

function isBlob(value: any): value is Blob {
    return (
        typeof value === 'object' &&
        typeof value.type === 'string' &&
        typeof value.stream === 'function' &&
        typeof value.arrayBuffer === 'function' &&
        typeof value.constructor === 'function' &&
        typeof value.constructor.name === 'string' &&
        /^(Blob|File)$/.test(value.constructor.name) &&
        /^(Blob|File)$/.test(value[Symbol.toStringTag])
    );
}

function isSuccess(status: number): boolean {
    return status >= 200 && status < 300;
}

function base64(str: string): string {
    try {
        return btoa(str);
    } catch (err) {
        // @ts-ignore
        return Buffer.from(str).toString('base64');
    }
}

function getQueryString(params: Record<string, any>): string {
    const qs: string[] = [];

    const append = (key: string, value: any) => {
        qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    };

    Object.entries(params)
        .filter(([_, value]) => isDefined(value))
        .forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => append(key, v));
            } else {
                append(key, value);
            }
        });

    if (qs.length > 0) {
        return `?${qs.join('&')}`;
    }

    return '';
}

function getUrl(options: ApiRequestOptions, config: OpenAPIConfig): string {
    const path = config.ENCODE_PATH ? config.ENCODE_PATH(options.path) : options.path;
    const url = `${config.BASE}${path}`;
    if (options.query) {
        return `${url}${getQueryString(options.query)}`;
    }

    return url;
}

function getFormData(options: ApiRequestOptions): FormData | undefined {
    if (options.formData) {
        const formData = new FormData();

        const append = (key: string, value: any) => {
            if (isString(value) || isBlob(value)) {
                formData.append(key, value);
            } else {
                formData.append(key, JSON.stringify(value));
            }
        };

        Object.entries(options.formData)
            .filter(([_, value]) => isDefined(value))
            .forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => append(key, v));
                } else {
                    append(key, value);
                }
            });

        return formData;
    }
    return;
}

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;

async function resolve<T>(options: ApiRequestOptions, resolver?: T | Resolver<T>): Promise<T | undefined> {
    if (typeof resolver === 'function') {
        return (resolver as Resolver<T>)(options);
    }
    return resolver;
}

async function getHeaders(options: ApiRequestOptions, config: OpenAPIConfig, formData?: FormData): Promise<Record<string, string>> {
    const token = await resolve(options, config.TOKEN);
    const username = await resolve(options, config.USERNAME);
    const password = await resolve(options, config.PASSWORD);
    const additionalHeaders = await resolve(options, config.HEADERS);
    const formHeaders = typeof formData?.getHeaders === 'function' && formData?.getHeaders() || {}

    const headers = Object.entries({
        Accept: 'application/json',
        ...additionalHeaders,
        ...options.headers,
        ...formHeaders,
    })
    .filter(([_, value]) => isDefined(value))
    .reduce((headers, [key, value]) => ({
        ...headers,
        [key]: String(value),
    }), {} as Record<string, string>);

    if (isStringWithValue(token)) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (isStringWithValue(username) && isStringWithValue(password)) {
        const credentials = base64(`${username}:${password}`);
        headers['Authorization'] = `Basic ${credentials}`;
    }

    return headers;
}

function getRequestBody(options: ApiRequestOptions): any {
    if (options.body) {
        return options.body;
    }
    return;
}

async function sendRequest(
    options: ApiRequestOptions,
    url: string,
    formData: FormData | undefined,
    body: any,
    headers: Record<string, string>,
    onCancel: OnCancel,
    openApiConfig: OpenAPIConfig
): Promise<AxiosResponse<any>> {
    const source = axios.CancelToken.source();

    const config: AxiosRequestConfig = {
        url,
        headers,
        data: body || formData,
        method: options.method,
        withCredentials: openApiConfig.WITH_CREDENTIALS,
        cancelToken: source.token,
        validateStatus: () => true,
    };

    onCancel(() => source.cancel('The user aborted a request.'));

    try {
        return await axios.request(config);
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            return axiosError.response;
        }
        throw error;
    }
}

function getResponseHeader(response: AxiosResponse<any>, responseHeader?: string): string | undefined {
    if (responseHeader) {
        const content = response.headers[responseHeader];
        if (isString(content)) {
            return content;
        }
    }
    return;
}

function getResponseBody(response: AxiosResponse<any>): any {
    if (response.status !== 204) {
        return response.data;
    }
    return;
}

function catchErrors(options: ApiRequestOptions, result: ApiResult): void {
    const errors: Record<number, string> = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        ...options.errors,
    }

    const error = errors[result.status];
    if (error) {
        throw new ApiError(result, error);
    }

    if (!result.ok) {
        throw new ApiError(result, 'Generic Error');
    }
}

export class AxiosHttpRequest extends BaseHttpRequest {
    constructor(openApiConfig: OpenAPIConfig) {
        super(openApiConfig);
    }

    /**
    * Request using axios client
    * @param options The request options from the the service
    * @returns ApiResult
    * @throws ApiError
    */
    request<T>(options: ApiRequestOptions): CancelablePromise<T> {
        return new CancelablePromise(async (resolve, reject, onCancel) => {
            try {
                const url = getUrl(options, this.openApiConfig);
                const formData = getFormData(options);
                const body = getRequestBody(options);
                const headers = await getHeaders(options, this.openApiConfig, formData);

                if (!onCancel.isCancelled) {
                    const response = await sendRequest(options, url, formData, body, headers, onCancel, this.openApiConfig);
                    const responseBody = getResponseBody(response);
                    const responseHeader = getResponseHeader(response, options.responseHeader);

                    const result: ApiResult = {
                        url,
                        ok: isSuccess(response.status),
                        status: response.status,
                        statusText: response.statusText,
                        body: responseHeader || responseBody,
                    };

                    catchErrors(options, result);

                    resolve(result.body);
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}
