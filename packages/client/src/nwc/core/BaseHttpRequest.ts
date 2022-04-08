/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { CancelablePromise } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';

export class BaseHttpRequest {

	constructor(public readonly config: OpenAPIConfig) {}

	public request<T>(options: ApiRequestOptions): CancelablePromise<T> {
		throw new Error('Not Implemented');
	}
}