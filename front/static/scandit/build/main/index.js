"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configure = exports.resetConfigure = exports.configurePromise = exports.configurePhase = exports.engineLoader = exports.blurryRecognitionPreloader = exports.scanditEngineLocation = exports.userLicenseKey = exports.deviceId = void 0;
var tslib_1 = require("tslib");
require("objectFitPolyfill");
var blurryRecognitionPreloader_1 = require("./lib/blurryRecognitionPreloader");
var browserHelper_1 = require("./lib/browserHelper");
var customError_1 = require("./lib/customError");
var engineLoader_1 = require("./lib/engineLoader");
var unsupportedBrowserError_1 = require("./lib/unsupportedBrowserError");
require("./styles/styles.scss");
tslib_1.__exportStar(require("./lib/barcodePicker/barcodePicker"), exports);
tslib_1.__exportStar(require("./lib/barcode"), exports);
tslib_1.__exportStar(require("./lib/barcodeEncodingRange"), exports);
tslib_1.__exportStar(require("./lib/browserCompatibility"), exports);
tslib_1.__exportStar(require("./lib/browserHelper"), exports);
tslib_1.__exportStar(require("./lib/camera"), exports);
tslib_1.__exportStar(require("./lib/cameraAccess"), exports);
tslib_1.__exportStar(require("./lib/cameraSettings"), exports);
tslib_1.__exportStar(require("./lib/customError"), exports);
tslib_1.__exportStar(require("./lib/imageSettings"), exports);
tslib_1.__exportStar(require("./lib/point"), exports);
tslib_1.__exportStar(require("./lib/quadrilateral"), exports);
tslib_1.__exportStar(require("./lib/parser"), exports);
tslib_1.__exportStar(require("./lib/parserField"), exports);
tslib_1.__exportStar(require("./lib/parserResult"), exports);
tslib_1.__exportStar(require("./lib/scanResult"), exports);
tslib_1.__exportStar(require("./lib/scanner"), exports);
tslib_1.__exportStar(require("./lib/scanSettings"), exports);
tslib_1.__exportStar(require("./lib/singleImageModeSettings"), exports);
tslib_1.__exportStar(require("./lib/searchArea"), exports);
tslib_1.__exportStar(require("./lib/symbologySettings"), exports);
tslib_1.__exportStar(require("./lib/workers/engineWorker"), exports);
var webComponent_1 = require("./webComponent");
webComponent_1.ScanditBarcodePicker.registerComponent();
/**
 * @hidden
 */
exports.deviceId = browserHelper_1.BrowserHelper.getDeviceId();
/**
 * @hidden
 *
 * Flag describing if configure() was called and if it could execute in its entirety.
 */
exports.configurePhase = "unconfigured";
/**
 * @hidden
 * Mainly used by tests.
 */
function resetConfigure() {
    exports.configurePhase = "unconfigured";
    exports.configurePromise = undefined;
}
exports.resetConfigure = resetConfigure;
/**
 * Initialize and configure the Scandit Barcode Scanner SDK library. This function must be called (once) before
 * instantiating the main library components (`BarcodePicker` and `Scanner` objects) and returns a promise. In case this
 * is called again after a successful call, parameters from subsequent calls are ignored and the same promise returned
 * from the successful call will be returned.
 *
 * Depending on parameters and browser features, any of the following errors could be the rejected result of the
 * returned promise:
 * - `NoLicenseKeyError`
 * - `UnsupportedBrowserError`
 *
 * The external external Scandit Engine library and data needed for blurry recognition are preloaded asynchronously
 * eagerly by default after library configuration to ensure the best performance. If needed this behaviour can be
 * changed via the *preloadEngine* and *preloadBlurryRecognition* options.
 *
 * For optimal performance, it is recommended to call this function as soon as possible to ensure needed components are
 * preloaded and initialized ahead of time.
 *
 * Camera access requests are done lazily only when needed by a [[BarcodePicker]] (or [[Scanner]]) object. You can also
 * eagerly ask only for camera access permissions by calling the [[CameraAccess.getCameras]] function.
 *
 * Ideally, to make the scanning process faster, it is recommended depending on the use case to create in
 * advance a (hidden and paused) [[BarcodePicker]] or [[Scanner]] object, to later show and unpause it when needed.
 * Depending on the options this can also be used to correctly ask for camera access permissions whenever preferred.
 *
 * @param licenseKey The Scandit license key to be used by the library.
 * @param engineLocation <div class="tsd-signature-symbol">Default =&nbsp;"/"</div>
 * The location of the folder containing the external scandit-engine-sdk.min.js and
 * scandit-engine-sdk.wasm files (external Scandit Engine library).
 * By default they are retrieved from the root of the web application.
 * Can be a full URL to folder or an absolute folder path.
 * @param preloadBlurryRecognition <div class="tsd-signature-symbol">Default =&nbsp;true</div>
 * Whether to preload (load or generate if needed) data needed for blurry recognition as soon as possible via a separate
 * asynchronous WebWorker thread running the Scandit Engine library. Data for all symbologies is generated over time.
 *
 * If enabled, any [[BarcodePicker]] or [[Scanner]] object will be able to start processing video frames much faster, as
 * it won't need to generate blurry recognition data lazily only when needed. If necessary, depending on given
 * [[ScanSettings]] options and on readiness of the data, processing is also initially performed without blurry
 * recognition until this data becomes available, at which point the new data will be loaded and used.
 *
 * If disabled, [[BarcodePicker]] or [[Scanner]] objects will load or generate blurry recognition data lazily when
 * needed to process the first frame, depending on given [[ScanSettings]] options, and will thus require more time the
 * first time the library is actively used with the given active symbologies. As this needs to be done in the same
 * WebWorker, the processing of the frame will then be blocked until the needed data is loaded or generated.
 *
 * Note that in either case the data for blurry recognition will be cached for later successive uses of the library.
 *
 * Note that preloading does not trigger a device activation for licensing purposes.
 * @param preloadEngine <div class="tsd-signature-symbol">Default =&nbsp;true</div>
 * Whether to preload (download if needed, compile/instantiate WebAssembly code and initialize) the external Scandit
 * Engine library, used by [[BarcodePicker]] and [[Scanner]] objects to perform scan operations.
 *
 * If enabled, any [[BarcodePicker]] or [[Scanner]] object will be ready to start processing video frames much faster,
 * as the needed external Scandit Engine library will already be in a partially or fully initialized state thanks to it
 * being preloaded now.
 *
 * If disabled, [[BarcodePicker]] and [[Scanner]] objects will load the external Scandit Engine library on creation
 * (if it wasn't already loaded before by a previously created object), and will thus require more time to be
 * initialized and ready.
 *
 * Note that in either case the loaded external Scandit Engine library will be reused whenever possible for later
 * successive uses of the library.
 *
 * Note that preloading does not trigger a device activation for licensing purposes.
 *
 * @returns A promise resolving when the library has been configured (preloading is done independently asynchronously).
 */
function configure(licenseKey, _a) {
    var _this = this;
    var _b = _a === void 0 ? {} : _a, _c = _b.engineLocation, engineLocation = _c === void 0 ? "/" : _c, _d = _b.preloadBlurryRecognition, preloadBlurryRecognition = _d === void 0 ? true : _d, _e = _b.preloadEngine, preloadEngine = _e === void 0 ? true : _e;
    if (exports.configurePromise != null) {
        return exports.configurePromise;
    }
    exports.configurePromise = new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var browserCompatibility;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Scandit Web SDK version: 5.5.3");
                    exports.configurePhase = "started";
                    browserCompatibility = browserHelper_1.BrowserHelper.checkBrowserCompatibility();
                    if (!browserCompatibility.fullSupport && !browserCompatibility.scannerSupport) {
                        return [2 /*return*/, reject(new unsupportedBrowserError_1.UnsupportedBrowserError(browserCompatibility))];
                    }
                    if (licenseKey == null || licenseKey.trim().length < 64) {
                        return [2 /*return*/, reject(new customError_1.CustomError({ name: "NoLicenseKeyError", message: "No license key provided" }))];
                    }
                    exports.userLicenseKey = licenseKey;
                    engineLocation += engineLocation.slice(-1) === "/" ? "" : "/";
                    if (/^https?:\/\//.test(engineLocation)) {
                        exports.scanditEngineLocation = "" + engineLocation;
                    }
                    else {
                        engineLocation = engineLocation
                            .split("/")
                            .filter(function (s) {
                            return s.length > 0;
                        })
                            .join("/");
                        if (engineLocation === "") {
                            engineLocation = "/";
                        }
                        else {
                            engineLocation = "/" + engineLocation + "/";
                        }
                        if (location.protocol === "file:" || location.origin === "null") {
                            exports.scanditEngineLocation = "" + location.href.split("/").slice(0, -1).join("/") + engineLocation;
                        }
                        else {
                            exports.scanditEngineLocation = "" + location.origin + engineLocation;
                        }
                    }
                    return [4 /*yield*/, blurryRecognitionPreloader_1.BlurryRecognitionPreloader.create(preloadBlurryRecognition)];
                case 1:
                    exports.blurryRecognitionPreloader = _a.sent();
                    return [4 /*yield*/, exports.blurryRecognitionPreloader.prepareBlurryTables()];
                case 2:
                    _a.sent();
                    exports.engineLoader = new engineLoader_1.EngineLoader(preloadEngine);
                    exports.configurePhase = "done";
                    return [2 /*return*/, resolve()];
            }
        });
    }); });
    exports.configurePromise = exports.configurePromise.catch(function (e) {
        resetConfigure();
        throw e;
    });
    return exports.configurePromise;
}
exports.configure = configure;
//# sourceMappingURL=index.js.map