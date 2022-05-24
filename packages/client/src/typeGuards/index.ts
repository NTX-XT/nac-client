
import { ApiError } from "../nwc/core/ApiError"

export const isError = (value: (any | ApiError)): value is ApiError => value.name !== undefined && value.name === 'ApiError'
export const isNotError = <T>(value: (T | ApiError)): value is T => !isError(value)
export const unWrapResponse = <T>(value: (T | ApiError)): T | undefined => isNotError(value) ? value as T : undefined
export const unWrapError = (value: (any | ApiError)): ApiError | undefined => isError(value) ? value as ApiError : undefined

export const unWrapResponseOrThrow = <T>(value: (T | ApiError)): T => {
    const unWrappedValue = unWrapResponse<T>(value)
    if (unWrappedValue) {
        return unWrappedValue
    }
    throw new Error('value does not match unwrapping type')
}

export const unWrapErrorOrThrow = (value: (any | ApiError)): ApiError => {
    const unWrappedValue = unWrapError(value)
    if (unWrappedValue) {
        return unWrappedValue
    }
    throw new Error('value was not an ApiError')
}

