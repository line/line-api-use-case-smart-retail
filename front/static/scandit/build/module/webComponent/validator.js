import { __decorate } from "tslib";
import { BarcodePicker, Camera, ScanSettings } from "..";
// tslint:disable:no-any no-unnecessary-class
export class Validator {
    static isBooleanAttribute(value) {
        return value === "true" || value === "false";
    }
    static isBooleanProperty(value) {
        return typeof value === "boolean";
    }
    static isIntegerAttribute(value) {
        return typeof value === "string" && /^-?\d+$/.test(value);
    }
    static isIntegerProperty(value) {
        return Number.isInteger(value);
    }
    static isValidCameraType(value) {
        return Object.values(Camera.Type).includes(value);
    }
    static isValidGuiStyle(value) {
        return Object.values(BarcodePicker.GuiStyle).includes(value);
    }
    static isValidVideoFit(value) {
        return Object.values(BarcodePicker.ObjectFit).includes(value);
    }
    static isValidCodeDirection(value) {
        return Object.values(ScanSettings.CodeDirection).includes(value);
    }
    static isArray(value) {
        return Array.isArray(value);
    }
    static isValidJsonArray(value) {
        let json;
        try {
            json = JSON.parse(value);
        }
        catch (e) {
            return false;
        }
        return Array.isArray(json);
    }
    static isValidSearchAreaAttribute(value) {
        let areaObject;
        try {
            areaObject = JSON.parse(value);
        }
        catch (e) {
            return false;
        }
        return Validator.isValidSearchAreaProperty(areaObject);
    }
    static isValidSearchAreaProperty(areaObject) {
        if (areaObject == null || typeof areaObject !== "object") {
            return false;
        }
        return (areaObject.x >= 0 &&
            areaObject.x <= 1 &&
            areaObject.y >= 0 &&
            areaObject.y <= 1 &&
            areaObject.width >= 0 &&
            areaObject.width <= 1 &&
            areaObject.height >= 0 &&
            areaObject.height <= 1);
    }
    static isValidCameraObject(value) {
        let camera;
        try {
            camera = JSON.parse(value);
        }
        catch (e) {
            return false;
        }
        return typeof camera?.deviceId === "string";
    }
    static isValidCameraSettingsObject(value) {
        let settings;
        try {
            settings = JSON.parse(value);
        }
        catch (e) {
            return false;
        }
        return typeof settings?.resolutionPreference === "string";
    }
    static isValidSingleImageModeSettingsObject(value) {
        let settings;
        try {
            settings = JSON.parse(value);
        }
        catch (e) {
            return false;
        }
        // TODO: improve checks
        return settings != null && typeof settings === "object";
    }
    static getExpectationMessageForType(type) {
        const messageByType = {
            booleanAttribute: `Expected one of "true" or "false"`,
            boolean: `Boolean expected`,
            integer: `Integer expected`,
            array: `Array expected`,
            jsonArray: `Expected JSON array`,
            videoFit: `Expected one of "${Object.values(BarcodePicker.ObjectFit).join('", "')}"`,
            camera: `Expected JSON object having properties of a Camera object`,
            cameraSettings: `Expected JSON object having properties of a CameraSettings object`,
            cameraType: `Expected one of "${Object.values(Camera.Type).join('", "')}"`,
            codeDirection: `Expected one of "${Object.values(ScanSettings.CodeDirection).join('", "')}"`,
            guiStyle: `Expected one of "${Object.values(BarcodePicker.GuiStyle).join('", "')}"`,
            searchArea: `Expected JSON object having properties of a SearchArea object`,
            singleImageModeSettings: `Expected JSON object having properties of a SingleImageModeSettings object`,
        };
        return messageByType[type];
    }
}
Validator.expectationMessage = new Map();
__decorate([
    validationMessage("booleanAttribute")
], Validator, "isBooleanAttribute", null);
__decorate([
    validationMessage("boolean")
], Validator, "isBooleanProperty", null);
__decorate([
    validationMessage("integer")
], Validator, "isIntegerAttribute", null);
__decorate([
    validationMessage("integer")
], Validator, "isIntegerProperty", null);
__decorate([
    validationMessage("cameraType")
], Validator, "isValidCameraType", null);
__decorate([
    validationMessage("guiStyle")
], Validator, "isValidGuiStyle", null);
__decorate([
    validationMessage("videoFit")
], Validator, "isValidVideoFit", null);
__decorate([
    validationMessage("codeDirection")
], Validator, "isValidCodeDirection", null);
__decorate([
    validationMessage("array")
], Validator, "isArray", null);
__decorate([
    validationMessage("jsonArray")
], Validator, "isValidJsonArray", null);
__decorate([
    validationMessage("searchArea")
], Validator, "isValidSearchAreaAttribute", null);
__decorate([
    validationMessage("searchArea")
], Validator, "isValidSearchAreaProperty", null);
__decorate([
    validationMessage("camera")
], Validator, "isValidCameraObject", null);
__decorate([
    validationMessage("cameraSettings")
], Validator, "isValidCameraSettingsObject", null);
__decorate([
    validationMessage("singleImageModeSettings")
], Validator, "isValidSingleImageModeSettingsObject", null);
function validationMessage(type) {
    return (target, key) => {
        target.expectationMessage.set(target[key], target.getExpectationMessageForType(type));
    };
}
//# sourceMappingURL=validator.js.map