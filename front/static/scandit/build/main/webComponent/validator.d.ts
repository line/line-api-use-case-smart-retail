declare type ValidationType = "booleanAttribute" | "boolean" | "integer" | "array" | "jsonArray" | "videoFit" | "camera" | "cameraType" | "cameraSettings" | "codeDirection" | "guiStyle" | "searchArea" | "singleImageModeSettings";
export declare abstract class Validator {
    static expectationMessage: Map<Function, string>;
    static isBooleanAttribute(value: any): boolean;
    static isBooleanProperty(value: any): boolean;
    static isIntegerAttribute(value: any): boolean;
    static isIntegerProperty(value: any): boolean;
    static isValidCameraType(value: any): boolean;
    static isValidGuiStyle(value: any): boolean;
    static isValidVideoFit(value: any): boolean;
    static isValidCodeDirection(value: any): boolean;
    static isArray(value: any): boolean;
    static isValidJsonArray(value: any): boolean;
    static isValidSearchAreaAttribute(value: any): boolean;
    static isValidSearchAreaProperty(areaObject: any): boolean;
    static isValidCameraObject(value: any): boolean;
    static isValidCameraSettingsObject(value: any): boolean;
    static isValidSingleImageModeSettingsObject(value: any): boolean;
    static getExpectationMessageForType(type: ValidationType): string;
}
export {};
