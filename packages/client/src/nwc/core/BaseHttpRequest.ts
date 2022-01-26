/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { CancelablePromise } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';

export class BaseHttpRequest {

	protected readonly config: OpenAPIConfig;

	constructor(config: OpenAPIConfig) {
		this.config = config;
	}

	public request<T>(options: ApiRequestOptions): CancelablePromise<T> {
		throw new Error('Not Implemented');
	}
}