import * as core from '@actions/core';

export function extractValue<T>(value: T|undefined): T {
    if (!value) {
        throw new Error("failed to extract value because it's undefined")
    }
    return value
}