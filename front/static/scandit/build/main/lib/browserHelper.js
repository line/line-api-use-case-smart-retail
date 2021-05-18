"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserHelper = exports.UAParser = void 0;
var tslib_1 = require("tslib");
var js_cookie_1 = tslib_1.__importDefault(require("js-cookie"));
var ua_parser_js_1 = tslib_1.__importDefault(require("ua-parser-js"));
exports.UAParser = ua_parser_js_1.default;
var browserCompatibility_1 = require("./browserCompatibility");
var BrowserHelper;
(function (BrowserHelper) {
    /**
     * @hidden
     */
    BrowserHelper.userAgentInfo = new ua_parser_js_1.default(navigator.userAgent);
    /**
     * @hidden
     */
    BrowserHelper.canvas = document.createElement("canvas"); // For some reason, export is needed!
    /**
     * @hidden
     *
     * @returns Whether the device is a desktop/laptop for sure.
     */
    function isDesktopDevice() {
        var _a;
        if ("orientation" in window) {
            // Only mobile browsers have this (deprecated but still available) property
            return false;
        }
        else {
            // Query for no "coarse" pointing device available (finger, touchscreen)
            var query = "(any-pointer: coarse)"; // Spaces matter!
            var mediaQueryList = (_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, query);
            // If the device doesn't have a touchscreen, it's a computer
            if (navigator.maxTouchPoints === 0 || ((mediaQueryList === null || mediaQueryList === void 0 ? void 0 : mediaQueryList.media) === query && (mediaQueryList === null || mediaQueryList === void 0 ? void 0 : mediaQueryList.matches) === false)) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    BrowserHelper.isDesktopDevice = isDesktopDevice;
    /**
     * @returns The built [[BrowserCompatibility]] object representing the current OS/Browser's support for features.
     */
    function checkBrowserCompatibility() {
        function objectHasPropertyWithType(object, propertyNames, propertyType) {
            // tslint:disable-next-line:no-any
            var objectProperty = object[propertyNames[0]];
            if (objectProperty == null) {
                return false;
            }
            if (propertyNames.length === 1) {
                return typeof objectProperty === propertyType;
            }
            else {
                return ((typeof objectProperty === "function" || typeof objectProperty === "object") &&
                    objectHasPropertyWithType(objectProperty, propertyNames.slice(1), propertyType));
            }
        }
        function isBrokenWebAssemblyOS(os) {
            return os.name === "iOS" && os.version != null && ["11.2.2", "11.2.5", "11.2.6"].includes(os.version);
        }
        var fullSupport = true;
        var scannerSupport = true;
        var missingFeatures = [];
        if (!location.protocol.startsWith("http")) {
            missingFeatures.push(browserCompatibility_1.BrowserCompatibility.Feature.HTTP_PROTOCOL);
            fullSupport = scannerSupport = false;
        }
        if (objectHasPropertyWithType(window, ["isSecureContext"], "boolean") && window.isSecureContext === false) {
            missingFeatures.push(browserCompatibility_1.BrowserCompatibility.Feature.SECURE_CONTEXT);
            // Don't disable full support in case browser is set to allow camera video streaming access in insecure contexts
        }
        if (!objectHasPropertyWithType(navigator, ["mediaDevices", "getUserMedia"], "function") &&
            !objectHasPropertyWithType(navigator, ["enumerateDevices"], "function") &&
            !objectHasPropertyWithType(window, ["MediaStreamTrack", "getSources"], "function")) {
            missingFeatures.push(browserCompatibility_1.BrowserCompatibility.Feature.MEDIA_DEVICES);
            fullSupport = false;
        }
        if (!objectHasPropertyWithType(window, ["Worker"], "function")) {
            missingFeatures.push(browserCompatibility_1.BrowserCompatibility.Feature.WEB_WORKERS);
            fullSupport = scannerSupport = false;
        }
        if (!objectHasPropertyWithType(window, ["WebAssembly"], "object")) {
            missingFeatures.push(browserCompatibility_1.BrowserCompatibility.Feature.WEB_ASSEMBLY);
            fullSupport = scannerSupport = false;
        }
        if (!objectHasPropertyWithType(window, ["Blob"], "function")) {
            missingFeatures.push(browserCompatibility_1.BrowserCompatibility.Feature.BLOB);
            fullSupport = scannerSupport = false;
        }
        if (!objectHasPropertyWithType(window, ["URL", "createObjectURL"], "function")) {
            missingFeatures.push(browserCompatibility_1.BrowserCompatibility.Feature.URL_OBJECT);
            fullSupport = scannerSupport = false;
        }
        if (!objectHasPropertyWithType(window, ["OffscreenCanvas"], "function")) {
            missingFeatures.push(browserCompatibility_1.BrowserCompatibility.Feature.OFFSCREEN_CANVAS);
        }
        try {
            if (!objectHasPropertyWithType(window, ["WebGLRenderingContext"], "function") ||
                (BrowserHelper.canvas.getContext("webgl") == null && BrowserHelper.canvas.getContext("experimental-webgl") == null)) {
                throw new Error();
            }
        }
        catch (_a) {
            missingFeatures.push(browserCompatibility_1.BrowserCompatibility.Feature.WEBGL);
        }
        var userAgentOS = BrowserHelper.userAgentInfo.getOS();
        if (isBrokenWebAssemblyOS(userAgentOS)) {
            missingFeatures.push(browserCompatibility_1.BrowserCompatibility.Feature.WEB_ASSEMBLY_ERROR_FREE);
            fullSupport = scannerSupport = false;
        }
        return {
            fullSupport: fullSupport,
            scannerSupport: scannerSupport,
            missingFeatures: missingFeatures,
        };
    }
    BrowserHelper.checkBrowserCompatibility = checkBrowserCompatibility;
    /**
     * @hidden
     *
     * Get a device id for the current browser.
     *
     * When available it's retrieved from localStorage, as fallback from cookies (used by older library versions),
     * when not available it's randomly generated and stored in localStorage to be retrieved by later calls and returned.
     *
     * @returns The device id for the current browser.
     */
    function getDeviceId() {
        var devideIdKey = "scandit-device-id";
        var deviceId = localStorage.getItem(devideIdKey);
        if (deviceId != null && deviceId !== "") {
            return deviceId;
        }
        deviceId = js_cookie_1.default.get(devideIdKey);
        if (deviceId != null && deviceId !== "") {
            localStorage.setItem(devideIdKey, deviceId);
            return deviceId;
        }
        var randomDeviceIdBytes = new Uint8Array(20);
        crypto.getRandomValues(randomDeviceIdBytes);
        deviceId = Array.from(randomDeviceIdBytes)
            .map(function (byteNumber) {
            var byteHex = byteNumber.toString(16);
            return byteHex.length === 1 ? /* istanbul ignore next */ "0" + byteHex : byteHex;
        })
            .join("");
        localStorage.setItem(devideIdKey, deviceId);
        return deviceId;
    }
    BrowserHelper.getDeviceId = getDeviceId;
    /**
     * @hidden
     *
     * Check if a given object is a valid HTMLElement
     *
     * @param object The object to check.
     * @returns Whether the given object is a valid HTMLElement.
     */
    // tslint:disable-next-line:no-any
    function isValidHTMLElement(object) {
        return (object instanceof HTMLElement ||
            (object != null && typeof object === "object" && typeof object.tagName === "string"));
    }
    BrowserHelper.isValidHTMLElement = isValidHTMLElement;
})(BrowserHelper = exports.BrowserHelper || (exports.BrowserHelper = {}));
//# sourceMappingURL=browserHelper.js.map