"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
var tslib_1 = require("tslib");
var __1 = require("..");
// tslint:disable:no-any no-unnecessary-class
var Validator = /** @class */ (function () {
    function Validator() {
    }
    Validator.isBooleanAttribute = function (value) {
        return value === "true" || value === "false";
    };
    Validator.isBooleanProperty = function (value) {
        return typeof value === "boolean";
    };
    Validator.isIntegerAttribute = function (value) {
        return typeof value === "string" && /^-?\d+$/.test(value);
    };
    Validator.isIntegerProperty = function (value) {
        return Number.isInteger(value);
    };
    Validator.isValidCameraType = function (value) {
        return Object.values(__1.Camera.Type).includes(value);
    };
    Validator.isValidGuiStyle = function (value) {
        return Object.values(__1.BarcodePicker.GuiStyle).includes(value);
    };
    Validator.isValidVideoFit = function (value) {
        return Object.values(__1.BarcodePicker.ObjectFit).includes(value);
    };
    Validator.isValidCodeDirection = function (value) {
        return Object.values(__1.ScanSettings.CodeDirection).includes(value);
    };
    Validator.isArray = function (value) {
        return Array.isArray(value);
    };
    Validator.isValidJsonArray = function (value) {
        var json;
        try {
            json = JSON.parse(value);
        }
        catch (e) {
            return false;
        }
        return Array.isArray(json);
    };
    Validator.isValidSearchAreaAttribute = function (value) {
        var areaObject;
        try {
            areaObject = JSON.parse(value);
        }
        catch (e) {
            return false;
        }
        return Validator.isValidSearchAreaProperty(areaObject);
    };
    Validator.isValidSearchAreaProperty = function (areaObject) {
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
    };
    Validator.isValidCameraObject = function (value) {
        var camera;
        try {
            camera = JSON.parse(value);
        }
        catch (e) {
            return false;
        }
        return typeof (camera === null || camera === void 0 ? void 0 : camera.deviceId) === "string";
    };
    Validator.isValidCameraSettingsObject = function (value) {
        var settings;
        try {
            settings = JSON.parse(value);
        }
        catch (e) {
            return false;
        }
        return typeof (settings === null || settings === void 0 ? void 0 : settings.resolutionPreference) === "string";
    };
    Validator.isValidSingleImageModeSettingsObject = function (value) {
        var settings;
        try {
            settings = JSON.parse(value);
        }
        catch (e) {
            return false;
        }
        // TODO: improve checks
        return settings != null && typeof settings === "object";
    };
    Validator.getExpectationMessageForType = function (type) {
        var messageByType = {
            booleanAttribute: "Expected one of \"true\" or \"false\"",
            boolean: "Boolean expected",
            integer: "Integer expected",
            array: "Array expected",
            jsonArray: "Expected JSON array",
            videoFit: "Expected one of \"" + Object.values(__1.BarcodePicker.ObjectFit).join('", "') + "\"",
            camera: "Expected JSON object having properties of a Camera object",
            cameraSettings: "Expected JSON object having properties of a CameraSettings object",
            cameraType: "Expected one of \"" + Object.values(__1.Camera.Type).join('", "') + "\"",
            codeDirection: "Expected one of \"" + Object.values(__1.ScanSettings.CodeDirection).join('", "') + "\"",
            guiStyle: "Expected one of \"" + Object.values(__1.BarcodePicker.GuiStyle).join('", "') + "\"",
            searchArea: "Expected JSON object having properties of a SearchArea object",
            singleImageModeSettings: "Expected JSON object having properties of a SingleImageModeSettings object",
        };
        return messageByType[type];
    };
    Validator.expectationMessage = new Map();
    tslib_1.__decorate([
        validationMessage("booleanAttribute")
    ], Validator, "isBooleanAttribute", null);
    tslib_1.__decorate([
        validationMessage("boolean")
    ], Validator, "isBooleanProperty", null);
    tslib_1.__decorate([
        validationMessage("integer")
    ], Validator, "isIntegerAttribute", null);
    tslib_1.__decorate([
        validationMessage("integer")
    ], Validator, "isIntegerProperty", null);
    tslib_1.__decorate([
        validationMessage("cameraType")
    ], Validator, "isValidCameraType", null);
    tslib_1.__decorate([
        validationMessage("guiStyle")
    ], Validator, "isValidGuiStyle", null);
    tslib_1.__decorate([
        validationMessage("videoFit")
    ], Validator, "isValidVideoFit", null);
    tslib_1.__decorate([
        validationMessage("codeDirection")
    ], Validator, "isValidCodeDirection", null);
    tslib_1.__decorate([
        validationMessage("array")
    ], Validator, "isArray", null);
    tslib_1.__decorate([
        validationMessage("jsonArray")
    ], Validator, "isValidJsonArray", null);
    tslib_1.__decorate([
        validationMessage("searchArea")
    ], Validator, "isValidSearchAreaAttribute", null);
    tslib_1.__decorate([
        validationMessage("searchArea")
    ], Validator, "isValidSearchAreaProperty", null);
    tslib_1.__decorate([
        validationMessage("camera")
    ], Validator, "isValidCameraObject", null);
    tslib_1.__decorate([
        validationMessage("cameraSettings")
    ], Validator, "isValidCameraSettingsObject", null);
    tslib_1.__decorate([
        validationMessage("singleImageModeSettings")
    ], Validator, "isValidSingleImageModeSettingsObject", null);
    return Validator;
}());
exports.Validator = Validator;
function validationMessage(type) {
    return function (target, key) {
        target.expectationMessage.set(target[key], target.getExpectationMessageForType(type));
    };
}
//# sourceMappingURL=validator.js.map