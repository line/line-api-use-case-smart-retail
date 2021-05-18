"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertProperty = void 0;
var tsHelper_1 = require("./tsHelper");
/**
 * Convert the given value to a string aimed to be used as an attribute value
 *
 * @param schema description of the attribute
 * @param value the value in its primary form
 * @returns the converted value as a string
 */
// tslint:disable-next-line: no-any
function convertProperty(schema, value) {
    switch (schema.type) {
        case "boolean":
            return value ? "true" : "false";
        case "guiStyle":
        case "integer":
        case "string":
        case "videoFit":
        case "codeDirection":
            return value.toString();
        case "array":
        case "camera":
        case "cameraSettings":
        case "searchArea":
        case "singleImageModeSettings":
            return JSON.stringify(value);
        case "cameraType":
            return value.cameraType.toString();
        default:
            break;
    }
    // Trick to make sure all cases are covered:
    return tsHelper_1.assertUnreachable(schema);
}
exports.convertProperty = convertProperty;
//# sourceMappingURL=propertyConverter.js.map