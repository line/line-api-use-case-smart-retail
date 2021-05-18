"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertAttribute = void 0;
var tsHelper_1 = require("./tsHelper");
function convertAttribute(schema, value) {
    switch (schema.type) {
        case "boolean":
            return convertToBoolean(value, schema.default);
        case "string":
        case "guiStyle":
        case "cameraType":
        case "videoFit":
        case "codeDirection":
            return convertToString(value, schema.default);
        case "array":
            return convertToArray(value, schema.default);
        case "integer":
            return convertToInteger(value, schema.default);
        case "singleImageModeSettings":
        case "searchArea":
        case "camera":
        case "cameraSettings":
            return convertJsonToObject(value, schema.default);
        default:
            break;
    }
    // Trick to make sure all cases are covered:
    return tsHelper_1.assertUnreachable(schema);
}
exports.convertAttribute = convertAttribute;
function convertToString(input, defaultValue) {
    return input == null ? defaultValue : input;
}
function convertToBoolean(input, defaultValue) {
    if (input == null) {
        return defaultValue;
    }
    return input !== "false";
}
function convertToInteger(input, defaultValue) {
    if (input == null) {
        return defaultValue;
    }
    var parsed = parseInt(input, 10);
    if (isNaN(parsed)) {
        return defaultValue;
    }
    return parsed;
}
function convertToArray(input, defaultValue) {
    if (input == null) {
        return defaultValue;
    }
    var json = toJson(input);
    if (json == null || !Array.isArray(json)) {
        return defaultValue;
    }
    return json;
}
function convertJsonToObject(input, defaultValue) {
    if (input == null) {
        return defaultValue;
    }
    var json = toJson(input);
    if (json == null) {
        return defaultValue;
    }
    // must be an object
    if (Array.isArray(json) || typeof json === "number") {
        return defaultValue;
    }
    return json;
}
function toJson(input) {
    try {
        return JSON.parse(input);
    }
    catch (e) {
        return null;
    }
}
//# sourceMappingURL=attributeConverter.js.map