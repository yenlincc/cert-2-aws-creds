"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extractValue(value) {
    if (!value) {
        throw new Error("failed to extract value because it's undefined");
    }
    return value;
}
exports.extractValue = extractValue;
