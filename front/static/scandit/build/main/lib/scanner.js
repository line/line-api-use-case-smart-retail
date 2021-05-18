"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
var tslib_1 = require("tslib");
var eventemitter3_1 = require("eventemitter3");
var index_1 = require("../index");
var barcode_1 = require("./barcode");
var browserHelper_1 = require("./browserHelper");
var customError_1 = require("./customError");
var engineLoader_1 = require("./engineLoader");
var imageSettings_1 = require("./imageSettings");
var parser_1 = require("./parser");
var scanResult_1 = require("./scanResult");
var scanSettings_1 = require("./scanSettings");
var unsupportedBrowserError_1 = require("./unsupportedBrowserError");
/**
 * @hidden
 */
var ScannerEventEmitter = /** @class */ (function (_super) {
    tslib_1.__extends(ScannerEventEmitter, _super);
    function ScannerEventEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ScannerEventEmitter;
}(eventemitter3_1.EventEmitter));
/**
 * A low-level scanner interacting with the external Scandit Engine library.
 * Used to set up scan / image settings and to process single image frames.
 *
 * The loading of the external Scandit Engine library can take some time, the [[on]] method targeting the [[ready]]
 * event can be used to set up a listener function to be called when the library is loaded and the [[isReady]] method
 * can return the current status. The scanner will be ready to start scanning when the library is fully loaded.
 *
 * By default the external Scandit Engine library is preloaded in order to reduce the initialization time as much as
 * possible.
 *
 * In the special case where a single [[Scanner]] instance is shared between multiple active [[BarcodePicker]]
 * instances, the fairness in resource allocation for processing images between the different pickers is not guaranteed.
 */
var Scanner = /** @class */ (function () {
    /**
     * Create a Scanner instance.
     *
     * It is required to having configured the library via [[configure]] before this object can be created.
     *
     * Before processing an image the relative settings must also have been set.
     *
     * Depending on library configuration, browser features and user permissions for camera access, any of the following
     * errors could be thrown:
     * - `LibraryNotConfiguredError`
     * - `UnsupportedBrowserError`
     *
     * @param scanSettings <div class="tsd-signature-symbol">Default =&nbsp;new ScanSettings()</div>
     * The configuration object for scanning options.
     * @param imageSettings <div class="tsd-signature-symbol">Default =&nbsp;undefined</div>
     * The configuration object to define the properties of an image to be scanned.
     */
    function Scanner(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.scanSettings, scanSettings = _c === void 0 ? new scanSettings_1.ScanSettings() : _c, imageSettings = _b.imageSettings;
        var browserCompatibility = browserHelper_1.BrowserHelper.checkBrowserCompatibility();
        if (!browserCompatibility.scannerSupport) {
            throw new unsupportedBrowserError_1.UnsupportedBrowserError(browserCompatibility);
        }
        if (index_1.configurePhase !== "done") {
            throw new customError_1.CustomError({
                name: "LibraryNotConfiguredError",
                message: index_1.configurePhase === "started"
                    ? "The library has not completed its configuration yet, please call 'configure' and wait for the returned\n            promise's resolution"
                    : "The library was not configured yet, 'configure' must be called with valid parameters before instantiating\n            the Scanner",
            });
        }
        this.eventEmitter = new eventemitter3_1.EventEmitter();
        this.isReadyToWork = false;
        this.workerScanQueueLength = 0;
        this.workerParseRequestId = 0;
        this.engineWorker = index_1.engineLoader.getEngineWorker();
        this.engineWorker.onmessage = this.engineWorkerOnMessage.bind(this);
        engineLoader_1.EngineLoader.load(this.engineWorker);
        this.activeBlurryRecognitionSymbologies = new Set();
        this.blurryRecognitionAvailable = false;
        this.applyScanSettings(scanSettings);
        if (imageSettings != null) {
            this.applyImageSettings(imageSettings);
        }
        index_1.blurryRecognitionPreloader.on("blurryTablesUpdate", this.handleBlurryTablesUpdate.bind(this));
    }
    /**
     * Fired when the external Scandit Engine library has been loaded and the scanner can thus start to scan barcodes.
     *
     * @event
     */
    // tslint:disable-next-line: no-empty
    Scanner.ready = function () { };
    /**
     * Stop/reset the internal WebWorker and destroy the scanner itself; ensuring complete cleanup.
     *
     * This method should be called after you don't plan to use the scanner anymore,
     * before the object is automatically cleaned up by JavaScript.
     * The scanner must not be used in any way after this call.
     */
    Scanner.prototype.destroy = function () {
        if (this.engineWorker != null) {
            index_1.engineLoader.returnEngineWorker(this.engineWorker);
        }
        this.eventEmitter.removeAllListeners();
    };
    /**
     * Apply a new set of scan settings to the scanner (replacing old settings).
     *
     * @param scanSettings The scan configuration object to be applied to the scanner.
     * @returns The updated [[Scanner]] object.
     */
    Scanner.prototype.applyScanSettings = function (scanSettings) {
        var _this = this;
        this.scanSettings = scanSettings;
        index_1.blurryRecognitionPreloader.updateBlurryRecognitionPriority(this.scanSettings);
        var activeBlurryRecognitionSymbologies = index_1.blurryRecognitionPreloader.getEnabledSymbologies(this.scanSettings);
        this.blurryRecognitionAvailable = index_1.blurryRecognitionPreloader.isBlurryRecognitionAvailable(this.scanSettings);
        this.engineWorker.postMessage({
            type: "scan-settings",
            settings: this.scanSettings.toJSONString(),
            blurryRecognitionAvailable: this.blurryRecognitionAvailable,
            blurryRecognitionRequiresUpdate: activeBlurryRecognitionSymbologies.some(function (symbology) {
                return !_this.activeBlurryRecognitionSymbologies.has(symbology);
            }),
        });
        if (this.blurryRecognitionAvailable) {
            this.activeBlurryRecognitionSymbologies = new Set(tslib_1.__spread(this.activeBlurryRecognitionSymbologies, activeBlurryRecognitionSymbologies));
        }
        this.eventEmitter.emit("newScanSettings", this.scanSettings);
        return this;
    };
    /**
     * Apply a new set of image settings to the scanner (replacing old settings).
     *
     * @param imageSettings The image configuration object to be applied to the scanner.
     * @returns The updated [[Scanner]] object.
     */
    Scanner.prototype.applyImageSettings = function (imageSettings) {
        this.imageSettings = imageSettings;
        this.engineWorker.postMessage({
            type: "image-settings",
            imageSettings: imageSettings,
        });
        return this;
    };
    /**
     * Clear the scanner session.
     *
     * This removes all recognized barcodes from the scanner session and allows them to be scanned again in case a custom
     * *codeDuplicateFilter* was set in the [[ScanSettings]].
     *
     * @returns The updated [[Scanner]] object.
     */
    Scanner.prototype.clearSession = function () {
        this.engineWorker.postMessage({
            type: "clear-session",
        });
        return this;
    };
    /**
     * Process a given image using the previously set scanner and image settings,
     * recognizing codes and retrieving the result as a list of barcodes (if any).
     *
     * Multiple requests done without waiting for previous results will be queued and handled in order.
     *
     * If *highQualitySingleFrameMode* is enabled the image will be processed with really accurate internal settings,
     * resulting in much slower but more precise scanning results. This should be used only for single images not part
     * of a continuous video stream.
     *
     * Passing image data as a *Uint8Array* is the fastest option, passing a *HTMLImageElement*
     * will incur in additional operations.
     *
     * Data passed to this function is "detached"/"neutered" becoming unusable as it's being passed to the external
     * Scandit Engine library. You can access the same data once it's returned in the [[ScanResult.imageData]] property.
     *
     * Depending on the current image settings, given *imageData* and scanning execution, any of the following errors
     * could be the rejected result of the returned promise:
     * - `NoImageSettings`
     * - `ImageSettingsDataMismatch`
     * - `ScanditEngineError`
     *
     * @param imageData The image data given as byte array or image element, complying with the previously set
     * image settings.
     * @param highQualitySingleFrameMode Whether to process the image as a high quality single frame.
     * @returns A promise resolving to the [[ScanResult]] object.
     */
    Scanner.prototype.processImage = function (imageData, highQualitySingleFrameMode) {
        if (highQualitySingleFrameMode === void 0) { highQualitySingleFrameMode = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var channels;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                if (this.imageSettings == null) {
                    throw new customError_1.CustomError({ name: "NoImageSettings", message: "No image settings set up in the scanner" });
                }
                if (imageData instanceof HTMLImageElement) {
                    if (this.imageDataConversionContext == null) {
                        this.imageDataConversionContext = document.createElement("canvas").getContext("2d");
                    }
                    this.imageDataConversionContext.canvas.width = imageData.naturalWidth;
                    this.imageDataConversionContext.canvas.height = imageData.naturalHeight;
                    this.imageDataConversionContext.drawImage(imageData, 0, 0, imageData.naturalWidth, imageData.naturalHeight);
                    imageData = new Uint8Array(this.imageDataConversionContext.getImageData(0, 0, imageData.naturalWidth, imageData.naturalHeight).data.buffer);
                }
                switch (this.imageSettings.format.valueOf()) {
                    case imageSettings_1.ImageSettings.Format.GRAY_8U:
                        channels = 1;
                        break;
                    case imageSettings_1.ImageSettings.Format.RGB_8U:
                        channels = 3;
                        break;
                    case imageSettings_1.ImageSettings.Format.RGBA_8U:
                        channels = 4;
                        break;
                    default:
                        channels = 1;
                        break;
                }
                if (this.imageSettings.width * this.imageSettings.height * channels !== imageData.length) {
                    throw new customError_1.CustomError({
                        name: "ImageSettingsDataMismatch",
                        message: "The provided image data doesn't match the previously set image settings",
                    });
                }
                Scanner.workerScanRequestId++;
                this.workerScanQueueLength++;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var workResultEvent = "workResult-" + Scanner.workerScanRequestId;
                        var workErrorEvent = "workError-" + Scanner.workerScanRequestId;
                        _this.eventEmitter.once(workResultEvent, function (workResult, returnedImageData) {
                            _this.eventEmitter.removeAllListeners(workErrorEvent);
                            _this.workerScanQueueLength--;
                            resolve(new scanResult_1.ScanResult(workResult.scanResult.map(barcode_1.Barcode.createFromWASMResult), returnedImageData, _this.imageSettings));
                        });
                        _this.eventEmitter.once(workErrorEvent, function (error, _) {
                            console.error("Scandit Engine error (" + error.errorCode + "):", error.errorMessage);
                            _this.eventEmitter.removeAllListeners(workResultEvent);
                            _this.workerScanQueueLength--;
                            var errorObject = new customError_1.CustomError({
                                name: "ScanditEngineError",
                                message: error.errorMessage + " (" + error.errorCode + ")",
                            });
                            reject(errorObject);
                        });
                        _this.engineWorker.postMessage({
                            type: "scan-image",
                            requestId: Scanner.workerScanRequestId,
                            data: imageData,
                            highQualitySingleFrameMode: highQualitySingleFrameMode,
                        }, [imageData.buffer]);
                    })];
            });
        });
    };
    /**
     * @returns Whether the scanner is currently busy processing an image.
     */
    Scanner.prototype.isBusyProcessing = function () {
        return this.workerScanQueueLength !== 0;
    };
    /**
     * @returns Whether the scanner has loaded the external Scandit Engine library and is ready to scan.
     */
    Scanner.prototype.isReady = function () {
        return this.isReadyToWork;
    };
    Scanner.prototype.on = function (eventName, listener) {
        if (eventName === "ready") {
            if (this.isReadyToWork) {
                listener();
            }
            else {
                this.eventEmitter.once(eventName, listener, this);
            }
        }
        else if (eventName === "contextCreated") {
            if (this.licenseKeyFeatures != null) {
                listener(this.licenseKeyFeatures);
            }
            else {
                this.eventEmitter.once(eventName, listener, this);
            }
        }
        else {
            this.eventEmitter.on(eventName, listener, this);
        }
        return this;
    };
    /**
     * *See the [[on]] method.*
     *
     * @param eventName The name of the event to listen to.
     * @param listener The listener function.
     * @returns The updated [[Scanner]] object.
     */
    Scanner.prototype.addListener = function (eventName, listener) {
        return this.on(eventName, listener);
    };
    /**
     * Create a new parser object.
     *
     * @param dataFormat The format of the input data for the parser.
     * @returns The newly created parser.
     */
    Scanner.prototype.createParserForFormat = function (dataFormat) {
        return new parser_1.Parser(this, dataFormat);
    };
    /**
     * Return the current image settings.
     *
     * Note that modifying this object won't directly apply these settings: the [[applyImageSettings]] method must be
     * called with the updated object.
     *
     * @returns The current image settings.
     */
    Scanner.prototype.getImageSettings = function () {
        return this.imageSettings;
    };
    /**
     * Return the current scan settings.
     *
     * Note that modifying this object won't directly apply these settings: the [[applyScanSettings]] method must be
     * called with the updated object.
     *
     * @returns The current scan settings.
     */
    Scanner.prototype.getScanSettings = function () {
        return this.scanSettings;
    };
    /**
     * @hidden
     *
     * Process a given string or byte array using the Scandit Parser library,
     * parsing the data in the given format and retrieving the result as a [[ParserResult]] object.
     *
     * Multiple requests done without waiting for previous results will be queued and handled in order.
     *
     * If parsing of the data fails the returned promise is rejected with a `ScanditEngineError` error.
     *
     * @param dataFormat The format of the given data.
     * @param data The string or byte array containing the data to be parsed.
     * @param options Options for the specific data format parser.
     * @returns A promise resolving to the [[ParserResult]] object.
     */
    Scanner.prototype.parse = function (dataFormat, data, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.workerParseRequestId++;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var parseResultEvent = "parseResult-" + _this.workerParseRequestId;
                        var parseErrorEvent = "parseError-" + _this.workerParseRequestId;
                        _this.eventEmitter.once(parseResultEvent, function (result) {
                            _this.eventEmitter.removeAllListeners(parseErrorEvent);
                            var parserResult = {
                                jsonString: result,
                                fields: [],
                                fieldsByName: {},
                            };
                            JSON.parse(result).forEach(function (parserField) {
                                parserResult.fields.push(parserField);
                                parserResult.fieldsByName[parserField.name] = parserField;
                            });
                            resolve(parserResult);
                        });
                        _this.eventEmitter.once(parseErrorEvent, function (error) {
                            console.error("Scandit Engine error (" + error.errorCode + "):", error.errorMessage);
                            _this.eventEmitter.removeAllListeners(parseResultEvent);
                            var errorObject = new customError_1.CustomError({
                                name: "ScanditEngineError",
                                message: error.errorMessage + " (" + error.errorCode + ")",
                            });
                            reject(errorObject);
                        });
                        _this.engineWorker.postMessage({
                            type: "parse",
                            requestId: _this.workerParseRequestId,
                            dataFormat: dataFormat,
                            data: data,
                            options: options == null ? "{}" : JSON.stringify(options),
                        });
                    })];
            });
        });
    };
    /**
     * @hidden
     *
     * Report new camera properties.
     *
     * This ensures optimal settings usage and detailed analytics information.
     *
     * @param cameraType The camera type (facing mode/direction).
     * @param autofocus Whether the camera supports autofocus, by default it's assumed it does.
     * @returns The updated [[Scanner]] object.
     */
    Scanner.prototype.reportCameraProperties = function (cameraType, autofocus) {
        if (autofocus === void 0) { autofocus = true; }
        this.engineWorker.postMessage({
            type: "camera-properties",
            cameraType: cameraType,
            autofocus: autofocus,
        });
        return this;
    };
    /**
     * Remove the specified listener from the given event's listener array.
     *
     * @param eventName The name of the event from which to remove the listener.
     * @param listener The listener function to be removed.
     * @returns The updated [[Scanner]] object.
     */
    Scanner.prototype.removeListener = function (eventName, listener) {
        this.eventEmitter.removeListener(eventName, listener);
        return this;
    };
    /**
     * Remove all listeners from the given event's listener array.
     *
     * @param eventName The name of the event from which to remove all listeners.
     * @returns The updated [[Scanner]] object.
     */
    Scanner.prototype.removeAllListeners = function (eventName) {
        this.eventEmitter.removeAllListeners(eventName);
        return this;
    };
    Scanner.prototype.handleBlurryTablesUpdate = function () {
        if (this.blurryRecognitionAvailable) {
            return;
        }
        this.blurryRecognitionAvailable = index_1.blurryRecognitionPreloader.isBlurryRecognitionAvailable(this.scanSettings);
        if (this.blurryRecognitionAvailable) {
            this.activeBlurryRecognitionSymbologies = new Set(tslib_1.__spread(this.activeBlurryRecognitionSymbologies, index_1.blurryRecognitionPreloader.getEnabledSymbologies(this.scanSettings)));
            this.engineWorker.postMessage({
                type: "scan-settings",
                settings: this.scanSettings.toJSONString(),
                blurryRecognitionAvailable: true,
                blurryRecognitionRequiresUpdate: true,
            });
        }
    };
    Scanner.prototype.engineWorkerOnMessage = function (ev) {
        var data = ev.data;
        if (data[0] === "library-loaded") {
            this.isReadyToWork = true;
            this.eventEmitter.emit("ready");
            return;
        }
        if (data[1] != null) {
            switch (data[0]) {
                case "context-created":
                    this.licenseKeyFeatures = data[1];
                    this.eventEmitter.emit("contextCreated", this.licenseKeyFeatures);
                    break;
                case "work-result":
                    this.eventEmitter.emit("workResult-" + data[1].requestId, data[1].result, data[2]);
                    break;
                case "work-error":
                    this.eventEmitter.emit("workError-" + data[1].requestId, data[1].error, data[2]);
                    break;
                case "parse-result":
                    this.eventEmitter.emit("parseResult-" + data[1].requestId, data[1].result);
                    break;
                case "parse-error":
                    this.eventEmitter.emit("parseError-" + data[1].requestId, data[1].error);
                    break;
                // istanbul ignore next
                default:
                    break;
            }
        }
    };
    Scanner.workerScanRequestId = 0;
    return Scanner;
}());
exports.Scanner = Scanner;
//# sourceMappingURL=scanner.js.map