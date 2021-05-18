"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarcodePicker = void 0;
var tslib_1 = require("tslib");
var eventemitter3_1 = require("eventemitter3");
var howler_core_min_js_1 = require("howler/dist/howler.core.min.js");
var base64assets_1 = require("../assets/base64assets");
var index_1 = require("../../index");
var browserHelper_1 = require("../browserHelper");
var camera_1 = require("../camera");
var customError_1 = require("../customError");
var scanner_1 = require("../scanner");
var scanResult_1 = require("../scanResult");
var scanSettings_1 = require("../scanSettings");
var singleImageModeSettings_1 = require("../singleImageModeSettings");
var unsupportedBrowserError_1 = require("../unsupportedBrowserError");
var cameraManager_1 = require("./cameraManager");
var dummyCameraManager_1 = require("./dummyCameraManager");
var gui_1 = require("./gui");
/**
 * @hidden
 */
var BarcodePickerEventEmitter = /** @class */ (function (_super) {
    tslib_1.__extends(BarcodePickerEventEmitter, _super);
    function BarcodePickerEventEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BarcodePickerEventEmitter;
}(eventemitter3_1.EventEmitter));
/**
 * A barcode picker element used to get and show camera input and perform scanning operations.
 *
 * The barcode picker will automatically fit and scale inside the given *originElement*.
 *
 * Each barcode picker internally contains a [[Scanner]] object with its own WebWorker thread running a
 * separate copy of the external Scandit Engine library. To optimize loading times and performance it's
 * recommended to reuse the same picker and to already create the picker in advance (hidden) and just
 * display it when needed whenever possible.
 *
 * As the loading of the external Scandit Engine library can take some time, the picker always starts inactive
 * (but showing GUI and video) and then activates, if not paused, as soon as the library is ready to scan.
 * The [[on]] method targeting the [[ready]] event can be used to set up a listener function to be called when the
 * library is loaded. The picker will be ready to start scanning when the library is fully loaded.
 *
 * By default the external Scandit Engine library is preloaded in order to reduce the initialization time as much as
 * possible.
 *
 * The picker can also operate in Single Image Mode: letting the user click/tap to take a single image to be scanned
 * via the camera (mobile) or a file select dialog (desktop). This is provided automatically as fallback by
 * default when the OS/browser only supports part of the needed features and cannot provide direct access to the camera
 * for video streaming and continuous scanning, or can also be forced on/off. This behaviour can be set up on creation
 * via the *singleImageModeSettings* option. Note that in this mode some of the functions provided by the picker will
 * have no effect.
 *
 * By default an alert is shown if an internal error during scanning is encountered which prevents the scanning
 * procedure from continuing when running on a local IP address. As this uses the built-in [[scanError]] event
 * functionality, if unwanted it can be disabled by calling [[removeAllListeners]] on the BarcodePicker
 * instance (right after creation).
 *
 * In accordance with our license terms, the Scandit logo displayed in the bottom right corner of the barcode picker
 * must be displayed and cannot be hidden by any method. Workarounds are not allowed.
 */
var BarcodePicker = /** @class */ (function () {
    function BarcodePicker(originElement, _a) {
        var visible = _a.visible, singleImageModeEnabled = _a.singleImageModeEnabled, singleImageModeSettings = _a.singleImageModeSettings, playSoundOnScan = _a.playSoundOnScan, vibrateOnScan = _a.vibrateOnScan, scanningPaused = _a.scanningPaused, guiStyle = _a.guiStyle, videoFit = _a.videoFit, laserArea = _a.laserArea, viewfinderArea = _a.viewfinderArea, scanner = _a.scanner, scanSettings = _a.scanSettings, cameraType = _a.cameraType, targetScanningFPS = _a.targetScanningFPS, hideLogo = _a.hideLogo;
        var _b, _c, _d, _e;
        this.isReadyToWork = false;
        this.destroyed = false;
        this.scanningPaused = scanningPaused;
        howler_core_min_js_1.Howler.autoSuspend = false;
        this.beepSound = new howler_core_min_js_1.Howl({
            src: base64assets_1.beepSound,
        });
        this.vibrateFunction = (_d = (_c = (_b = navigator.vibrate) !== null && _b !== void 0 ? _b : navigator.webkitVibrate) !== null && _c !== void 0 ? _c : navigator.mozVibrate) !== null && _d !== void 0 ? _d : navigator.msVibrate;
        this.eventEmitter = new eventemitter3_1.EventEmitter();
        this.setPlaySoundOnScanEnabled(playSoundOnScan);
        this.setVibrateOnScanEnabled(vibrateOnScan);
        this.setTargetScanningFPS(targetScanningFPS);
        this.scanner = (_e = scanner === null || scanner === void 0 ? void 0 : scanner.applyScanSettings(scanSettings)) !== null && _e !== void 0 ? _e : new scanner_1.Scanner({ scanSettings: scanSettings });
        this.scannerReadyEventListener = this.handleScannerReady.bind(this);
        this.scanner.on("ready", this.scannerReadyEventListener);
        this.gui = new gui_1.GUI({
            scanner: this.scanner,
            originElement: originElement,
            singleImageModeEnabled: singleImageModeEnabled,
            singleImageModeSettings: singleImageModeSettings,
            scanningPaused: scanningPaused,
            visible: visible,
            guiStyle: guiStyle,
            videoFit: videoFit,
            hideLogo: hideLogo,
            laserArea: laserArea,
            viewfinderArea: viewfinderArea,
            cameraUploadCallback: this.processVideoFrame.bind(this, true),
        });
        if (singleImageModeEnabled) {
            this.cameraManager = new dummyCameraManager_1.DummyCameraManager(this.scanner, this.triggerFatalError.bind(this), this.gui);
            this.gui.setCameraType(cameraType);
        }
        else {
            this.cameraManager = new cameraManager_1.CameraManager(this.scanner, this.triggerFatalError.bind(this), this.gui);
            this.scheduleVideoProcessing();
        }
        this.gui.setCameraManager(this.cameraManager);
    }
    /**
     * Fired when the external Scandit Engine library has been loaded and the barcode picker can thus start to scan
     * barcodes.
     *
     * @asMemberOf BarcodePicker
     * @event
     */
    // tslint:disable-next-line: no-empty
    BarcodePicker.ready = function () { };
    /**
     * Fired when a new frame is submitted to the engine to be processed. As the frame is not processed yet, the
     * [[ScanResult.barcodes]] property will always be empty (no results yet).
     *
     * @asMemberOf BarcodePicker
     * @event
     * @param scanResult The result of the scanning operation on the image.
     */
    // @ts-ignore
    // tslint:disable-next-line: no-empty
    BarcodePicker.submitFrame = function (scanResult) { };
    /**
     * Fired when a new frame is processed by the engine. This event is fired on every frame, independently from the
     * number of recognized barcodes (can be none). The returned barcodes are affected by [[ScanSettings]]'s
     * *codeDuplicateFilter* option.
     *
     * @asMemberOf BarcodePicker
     * @event
     * @param scanResult The result of the scanning operation on the image.
     */
    // @ts-ignore
    // tslint:disable-next-line: no-empty
    BarcodePicker.processFrame = function (scanResult) { };
    /**
     * Fired when new barcodes are recognized in the image frame. The returned barcodes are affected by [[ScanSettings]]'s
     * *codeDuplicateFilter* option.
     *
     * @asMemberOf BarcodePicker
     * @event
     * @param scanResult The result of the scanning operation on the image.
     */
    // @ts-ignore
    // tslint:disable-next-line: no-empty
    BarcodePicker.scan = function (scanResult) { };
    /**
     * Fired when an error occurs during scanning initialization and execution. The barcode picker will be automatically
     * paused when this happens.
     *
     * @asMemberOf BarcodePicker
     * @event
     * @param error The ScanditEngineError that was triggered.
     */
    // @ts-ignore
    // tslint:disable-next-line: no-empty
    BarcodePicker.scanError = function (error) { };
    /**
     * Create a [[BarcodePicker]] instance, creating the needed HTML in the given origin element.
     * If the *accessCamera* option is enabled (active by default) and the picker is not in Single Image Mode,
     * the available cameras are accessed and camera access permission is requested to the user if needed.
     * This object expects that at least a camera is available. The active camera is accessed and kept active during the
     * lifetime of the picker (also when hidden or scanning is paused), and is only released when [[destroy]] is called.
     *
     * It is required to having configured the library via [[configure]] before this object can be created.
     *
     * Depending on library configuration, parameters, device/browser features and user permissions for camera access, any
     * of the following errors could be the rejected result of the returned promise:
     * - `AbortError`
     * - `LibraryNotConfiguredError`
     * - `NoCameraAvailableError`
     * - `NoOriginElementError`
     * - `NotAllowedError`
     * - `NotFoundError`
     * - `NotReadableError`
     * - `SecurityError`
     * - `UnsupportedBrowserError`
     *
     * @param originElement The HTMLElement inside which all the necessary elements for the picker will be added.
     * @param visible <div class="tsd-signature-symbol">Default =&nbsp;true</div>
     * Whether the picker starts in a visible state.
     * @param singleImageModeSettings <div class="tsd-signature-symbol">Default =&nbsp;</div>
     * <pre><code>{
     *   desktop: {
     *     usageStrategy: SingleImageModeSettings.UsageStrategy.FALLBACK,
     *     informationElement: &lt;HTMLElement&gt;,
     *     buttonElement: &lt;SVGElement&gt;,
     *     containerStyle: { backgroundColor: "#333333" },
     *     informationStyle: { color: "#FFFFFF" },
     *     buttonStyle: { borderColor: "#FFFFFF", color: "#FFFFFF", fill: "#FFFFFF" }
     *   },
     *   mobile: {
     *     usageStrategy: SingleImageModeSettings.UsageStrategy.FALLBACK,
     *     informationElement: &lt;HTMLElement&gt;,
     *     buttonElement: &lt;SVGElement&gt;,
     *     containerStyle: { backgroundColor: "#333333" },
     *     informationStyle: { color: "#FFFFFF" },
     *     buttonStyle: { borderColor: "#FFFFFF", color: "#FFFFFF", fill: "#FFFFFF" }
     *   }
     * }</code></pre>
     * Settings for Single Image Mode: an alternative/fallback mode for a barcode picker to provide single camera
     * pictures to be scanned instead of continuous camera video stream access. In Single Image Mode users click/tap to
     * directly take a picture with the camera (mobile) or upload a file (desktop). Its usage depends on the given
     * settings and the camera video stream features provided by the OS/browser.
     * @param playSoundOnScan <div class="tsd-signature-symbol">Default =&nbsp;false</div>
     * Whether a sound is played on barcode recognition (iOS requires user input).
     * @param vibrateOnScan <div class="tsd-signature-symbol">Default =&nbsp;false</div>
     * Whether the device vibrates on barcode recognition (only Chrome & Firefox, requires user input).
     * @param scanningPaused <div class="tsd-signature-symbol">Default =&nbsp;false</div>
     * Whether the picker starts in a paused scanning state.
     * @param guiStyle <div class="tsd-signature-symbol">Default =&nbsp;GuiStyle.LASER</div>
     * The GUI style for the picker.
     * @param videoFit <div class="tsd-signature-symbol">Default =&nbsp;ObjectFit.CONTAIN</div>
     * The fit type for the video element of the picker.
     * @param laserArea <div class="tsd-signature-symbol">Default =&nbsp;undefined</div>
     * The area of the laser displayed when the GUI style is set to <em>laser</em> (the laser will match the width and be
     * vertically centered), by default the area will match the current [[ScanSettings]]'s <em>searchArea</em> option.
     * @param viewfinderArea <div class="tsd-signature-symbol">Default =&nbsp;undefined</div>
     * The area of the viewfinder displayed when the GUI style is set to <em>viewfinder</em>, by default the area will
     * match the current [[ScanSettings]]'s <em>searchArea</em> option.
     * @param enableCameraSwitcher <div class="tsd-signature-symbol">Default =&nbsp;true</div>
     * Whether to show a GUI button to switch between different cameras (when available).
     * @param enableTorchToggle <div class="tsd-signature-symbol">Default =&nbsp;true</div>
     * Whether to show a GUI button to toggle device torch on/off (when available, only Chrome).
     * @param enableTapToFocus <div class="tsd-signature-symbol">Default =&nbsp;true</div>
     * Whether to trigger a manual focus of the camera when clicking/tapping on the video (when available, only Chrome).
     * @param enablePinchToZoom <div class="tsd-signature-symbol">Default =&nbsp;true</div>
     * Whether to control the zoom of the camera when doing a pinching gesture on the video (when available, only Chrome).
     * @param accessCamera <div class="tsd-signature-symbol">Default =&nbsp;true</div>
     * Whether to immediately access the camera (and requesting user permissions if needed) on picker creation.
     * @param camera <div class="tsd-signature-symbol">Default =&nbsp;undefined</div>
     * The initial camera to be used for video input, if not specified the camera automatically selected depending on
     * the <em>cameraType</em> option will be used.
     * @param cameraType <div class="tsd-signature-symbol">Default =&nbsp;Camera.Type.BACK</div>
     * The preferred initial camera type (facing mode/direction) to be used for video input and Single Image Mode
     * (when available), by default the back or only camera will be used. If the <em>camera</em> option is provided then
     * <em>cameraType</em> is ignored.
     * @param cameraSettings <div class="tsd-signature-symbol">Default =&nbsp;undefined</div>
     * The camera options used when accessing the camera, by default <code>hd</code> resolution is used.
     * @param scanner <div class="tsd-signature-symbol">Default =&nbsp;undefined</div>
     * The scanner object responsible for scanning via the external Scandit Engine library
     * (a new scanner will be created and initialized if not provided).
     * @param scanSettings <div class="tsd-signature-symbol">Default =&nbsp;new ScanSettings()</div>
     * The configuration object for scanning options to be applied to the scanner (all symbologies disabled by default).
     * @param targetScanningFPS <div class="tsd-signature-symbol">Default =&nbsp;30</div>
     * The target frames per second to be processed, the final speed is limited by the camera framerate (usually 30 FPS)
     * and the frame processing time of the device. By setting this to lower numbers devices can save power by performing
     * less work during scanning operations, depending on device speed (faster devices can "sleep" for longer periods).
     * Must be a number bigger than 0.
     * @returns A promise resolving to the created ready [[BarcodePicker]] object.
     */
    BarcodePicker.create = function (originElement, _a) {
        var _b;
        var _c = _a === void 0 ? {} : _a, _d = _c.visible, visible = _d === void 0 ? true : _d, _e = _c.singleImageModeSettings, singleImageModeSettings = _e === void 0 ? {} : _e, _f = _c.playSoundOnScan, playSoundOnScan = _f === void 0 ? false : _f, _g = _c.vibrateOnScan, vibrateOnScan = _g === void 0 ? false : _g, _h = _c.scanningPaused, scanningPaused = _h === void 0 ? false : _h, _j = _c.guiStyle, guiStyle = _j === void 0 ? BarcodePicker.GuiStyle.LASER : _j, _k = _c.videoFit, videoFit = _k === void 0 ? BarcodePicker.ObjectFit.CONTAIN : _k, laserArea = _c.laserArea, viewfinderArea = _c.viewfinderArea, scanner = _c.scanner, _l = _c.scanSettings, scanSettings = _l === void 0 ? new scanSettings_1.ScanSettings() : _l, _m = _c.enableCameraSwitcher, enableCameraSwitcher = _m === void 0 ? true : _m, _o = _c.enableTorchToggle, enableTorchToggle = _o === void 0 ? true : _o, _p = _c.enableTapToFocus, enableTapToFocus = _p === void 0 ? true : _p, _q = _c.enablePinchToZoom, enablePinchToZoom = _q === void 0 ? true : _q, _r = _c.accessCamera, accessCamera = _r === void 0 ? true : _r, camera = _c.camera, _s = _c.cameraType, cameraType = _s === void 0 ? camera_1.Camera.Type.BACK : _s, cameraSettings = _c.cameraSettings, _t = _c.targetScanningFPS, targetScanningFPS = _t === void 0 ? 30 : _t, 
        /**
         * @hidden
         */
        _u = _c.hideLogo, 
        /**
         * @hidden
         */
        hideLogo = _u === void 0 ? false : _u;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var deviceType, isMobileDevice, singleImageModePlatformSettings, singleImageModeDisallowed, singleImageModeForced, browserCompatibility, barcodePicker;
            return tslib_1.__generator(this, function (_v) {
                switch (_v.label) {
                    case 0:
                        deviceType = browserHelper_1.BrowserHelper.userAgentInfo.getDevice().type;
                        isMobileDevice = deviceType === "mobile" || deviceType === "tablet";
                        singleImageModePlatformSettings = (_b = (isMobileDevice ? singleImageModeSettings.mobile : singleImageModeSettings.desktop)) !== null && _b !== void 0 ? _b : {};
                        singleImageModeDisallowed = singleImageModePlatformSettings.usageStrategy === singleImageModeSettings_1.SingleImageModeSettings.UsageStrategy.NEVER;
                        singleImageModeForced = singleImageModePlatformSettings.usageStrategy === singleImageModeSettings_1.SingleImageModeSettings.UsageStrategy.ALWAYS;
                        browserCompatibility = browserHelper_1.BrowserHelper.checkBrowserCompatibility();
                        if (!browserCompatibility.scannerSupport || (singleImageModeDisallowed && !browserCompatibility.fullSupport)) {
                            throw new unsupportedBrowserError_1.UnsupportedBrowserError(browserCompatibility);
                        }
                        if (!browserCompatibility.fullSupport && !singleImageModeForced) {
                            console.log("BarcodePicker's Single Image Mode is being used as fallback as the OS/browser combination doesn't " +
                                "support camera video stream scanning (https://caniuse.com/#feat=stream). " +
                                'You can configure this behaviour via the "singleImageModeSettings" option.', browserCompatibility);
                        }
                        if (index_1.configurePhase !== "done") {
                            throw new customError_1.CustomError({
                                name: "LibraryNotConfiguredError",
                                message: index_1.configurePhase === "started"
                                    ? "The library has not completed its configuration yet, please call 'configure' and wait for the returned\n              promise's resolution"
                                    : "The library was not configured, 'configure' must be called with valid parameters before instantiating\n              the BarcodePicker",
                            });
                        }
                        if (!browserHelper_1.BrowserHelper.isValidHTMLElement(originElement)) {
                            throw new customError_1.CustomError({
                                name: "NoOriginElementError",
                                message: "A valid origin HTML element must be given",
                            });
                        }
                        barcodePicker = new BarcodePicker(originElement, {
                            visible: visible,
                            singleImageModeEnabled: browserCompatibility.fullSupport ? singleImageModeForced : true,
                            singleImageModeSettings: singleImageModePlatformSettings,
                            playSoundOnScan: playSoundOnScan,
                            vibrateOnScan: vibrateOnScan,
                            scanningPaused: scanningPaused,
                            guiStyle: guiStyle,
                            videoFit: videoFit,
                            laserArea: laserArea,
                            viewfinderArea: viewfinderArea,
                            scanner: scanner,
                            scanSettings: scanSettings,
                            cameraType: cameraType,
                            targetScanningFPS: targetScanningFPS,
                            hideLogo: hideLogo,
                        });
                        barcodePicker.cameraManager.setInteractionOptions(enableCameraSwitcher, enableTorchToggle, enableTapToFocus, enablePinchToZoom);
                        barcodePicker.cameraManager.setInitialCameraType(cameraType);
                        barcodePicker.cameraManager.setSelectedCamera(camera);
                        barcodePicker.cameraManager.setSelectedCameraSettings(cameraSettings);
                        barcodePicker.cameraAccess = accessCamera;
                        // Show error in alert on ScanError by default when running on local IP address for easier customer debugging
                        barcodePicker.on("scanError", function (error) {
                            // istanbul ignore if
                            if (["localhost", "127.0.0.1", ""].includes(window.location.hostname)) {
                                alert(error);
                            }
                        });
                        if (!accessCamera) return [3 /*break*/, 2];
                        return [4 /*yield*/, barcodePicker.cameraManager.setupCameras()];
                    case 1:
                        _v.sent();
                        _v.label = 2;
                    case 2: return [2 /*return*/, barcodePicker];
                }
            });
        });
    };
    /**
     * Stop scanning and displaying video output, remove HTML elements added to the page,
     * destroy the internal [[Scanner]] (by default) and destroy the barcode picker itself; ensuring complete cleanup.
     *
     * This method should be called after you don't plan to use the picker anymore,
     * before the object is automatically cleaned up by JavaScript.
     * The barcode picker must not be used in any way after this call.
     *
     * If the [[Scanner]] is or will be in use for other purposes, the relative option can be passed to prevent
     * its destruction.
     *
     * @param destroyScanner Whether to destroy the internally used [[Scanner]] or not.
     */
    BarcodePicker.prototype.destroy = function (destroyScanner) {
        if (destroyScanner === void 0) { destroyScanner = true; }
        this.pauseScanning(true);
        this.scanner.removeListener("ready", this.scannerReadyEventListener);
        this.destroyed = true;
        if (destroyScanner) {
            this.scanner.destroy();
        }
        this.gui.destroy();
        this.eventEmitter.removeAllListeners();
    };
    /**
     * Apply a new set of scan settings to the internal scanner (replacing old settings).
     *
     * @param scanSettings The scan configuration object to be applied to the scanner.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.applyScanSettings = function (scanSettings) {
        this.scanner.applyScanSettings(scanSettings);
        return this;
    };
    /**
     * @returns Whether the scanning is currently paused.
     */
    BarcodePicker.prototype.isScanningPaused = function () {
        return this.scanningPaused;
    };
    /**
     * Pause the recognition of codes in the input image.
     *
     * By default video from the camera is still shown, if the *pauseCamera* option is enabled the camera stream
     * is paused (camera access is fully interrupted) and will be resumed when calling [[resumeScanning]],
     * [[setActiveCamera]], [[setCameraType]] or [[accessCamera]], possibly requesting user permissions if needed.
     *
     * In Single Image Mode the input for submitting a picture is disabled.
     *
     * @param pauseCamera Whether to also pause the camera stream.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.pauseScanning = function (pauseCamera) {
        if (pauseCamera === void 0) { pauseCamera = false; }
        this.scanningPaused = true;
        if (pauseCamera) {
            this.cameraManager.stopStream();
        }
        if (this.scanner.isReady()) {
            this.gui.pauseScanning();
        }
        return this;
    };
    /**
     * Resume the recognition of codes in the input image.
     *
     * If the camera stream was stopped when calling [[pauseScanning]], the camera stream is also resumed and
     * user permissions are requested if needed to resume video input.
     *
     * In Single Image Mode the input for submitting a picture is enabled.
     *
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.resumeScanning = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.scanningPaused = false;
                        if (this.scanner.isReady()) {
                            this.gui.resumeScanning();
                        }
                        if (!(this.cameraAccess && this.getActiveCamera() == null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cameraManager.setupCameras()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * @returns The currently active camera.
     */
    BarcodePicker.prototype.getActiveCamera = function () {
        return this.cameraManager.activeCamera;
    };
    /**
     * Select a camera to be used for video input, if no camera is passed, the default one (based on *cameraType*) is
     * selected.
     *
     * If camera access is enabled, the camera is enabled and accessed. If not, the camera is stored and used for the
     * future initial camera access.
     *
     * Depending on device features and user permissions for camera access, any of the following errors
     * could be the rejected result of the returned promise:
     * - `AbortError`
     * - `NoCameraAvailableError`
     * - `NotAllowedError`
     * - `NotFoundError`
     * - `NotReadableError`
     * - `SecurityError`
     *
     * In Single Image Mode this method has no effect.
     *
     * @param camera The new camera to be used, by default the automatically detected back camera is used.
     * @param cameraSettings The camera options used when accessing the camera, by default `hd` resolution is used.
     * @returns A promise resolving to the updated [[BarcodePicker]] object when the camera is set
     * (and accessed, if camera access is currently enabled).
     */
    BarcodePicker.prototype.setActiveCamera = function (camera, cameraSettings) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(camera == null || !this.cameraAccess)) return [3 /*break*/, 3];
                        this.cameraManager.setSelectedCamera(camera);
                        this.cameraManager.setSelectedCameraSettings(cameraSettings);
                        if (!this.cameraAccess) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cameraManager.setupCameras()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.cameraManager.initializeCameraWithSettings(camera, cameraSettings)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Select a camera to be used for video input by specifying the wanted camera type (facing mode/direction): the main
     * camera detected for the given camera type will be used.
     *
     * If camera access is enabled, the camera is enabled and accessed. If not, the camera type is stored and used for the
     * future initial camera access.
     *
     * If the target camera is already in use or no camera with the given type is found this method has no effect.
     *
     * Depending on device features and user permissions for camera access, any of the following errors
     * could be the rejected result of the returned promise:
     * - `AbortError`
     * - `NoCameraAvailableError`
     * - `NotAllowedError`
     * - `NotFoundError`
     * - `NotReadableError`
     * - `SecurityError`
     *
     * @param cameraType The new camera type (facing mode/direction) to be used for video input and Single Image Mode
     * (when available).
     * @returns A promise resolving to the updated [[BarcodePicker]] object when the camera is updated
     * (and accessed, if camera access is currently enabled).
     */
    BarcodePicker.prototype.setCameraType = function (cameraType) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.gui.setCameraType(cameraType);
                        if (!this.cameraAccess) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cameraManager.setCameraType(cameraType)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.cameraManager.setInitialCameraType(cameraType);
                        _a.label = 3;
                    case 3: return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Try to apply new settings to the currently used camera for video input,
     * if no settings are passed the default ones are set.
     *
     * If camera access is enabled, the camera is updated and accessed with the new settings. If not, the camera settings
     * are stored and used for the future initial camera access.
     *
     * Depending on device features and user permissions for camera access, any of the following errors
     * could be the rejected result of the returned promise:
     * - `AbortError`
     * - `NoCameraAvailableError`
     * - `NotAllowedError`
     * - `NotFoundError`
     * - `NotReadableError`
     * - `SecurityError`
     *
     * In Single Image Mode this method has no effect.
     *
     * @param cameraSettings The new camera options used when accessing the camera, by default `hd` resolution is used.
     * @returns A promise resolving to the updated [[BarcodePicker]] object when the camera is updated
     * (and accessed, if camera access is currently enabled).
     */
    BarcodePicker.prototype.applyCameraSettings = function (cameraSettings) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.cameraAccess) return [3 /*break*/, 1];
                        this.cameraManager.setSelectedCameraSettings(cameraSettings);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.cameraManager.applyCameraSettings(cameraSettings)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * @returns Whether the picker is in a visible state or not.
     */
    BarcodePicker.prototype.isVisible = function () {
        return this.gui.isVisible();
    };
    /**
     * Enable or disable picker visibility.
     *
     * Note that this does not affect camera access, frame processing or any other picker logic.
     *
     * @param visible Whether the picker is in a visible state or not.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.setVisible = function (visible) {
        this.gui.setVisible(visible);
        return this;
    };
    /**
     * @returns Whether the currently selected camera's video is mirrored along the vertical axis.
     */
    BarcodePicker.prototype.isMirrorImageEnabled = function () {
        return this.gui.isMirrorImageEnabled();
    };
    /**
     * Enable or disable camera video mirroring along the vertical axis.
     * By default front cameras are automatically mirrored.
     * This setting is applied per camera and the method has no effect if no camera is currently selected.
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether the camera video is mirrored along the vertical axis.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.setMirrorImageEnabled = function (enabled) {
        this.gui.setMirrorImageEnabled(enabled, true);
        return this;
    };
    /**
     * @returns Whether a sound should be played on barcode recognition (iOS requires user input).
     * Note that the sound is played if there's at least a barcode not rejected via [[ScanResult.rejectCode]].
     */
    BarcodePicker.prototype.isPlaySoundOnScanEnabled = function () {
        return this.playSoundOnScan;
    };
    /**
     * Enable or disable playing a sound on barcode recognition (iOS requires user input).
     *
     * The sound is played if there's at least a barcode not rejected via [[ScanResult.rejectCode]].
     *
     * @param enabled Whether a sound should be played on barcode recognition.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.setPlaySoundOnScanEnabled = function (enabled) {
        this.playSoundOnScan = enabled;
        return this;
    };
    /**
     * @returns Whether the device should vibrate on barcode recognition (only Chrome & Firefox, requires user input).
     * Note that the vibration is triggered if there's at least a barcode not rejected via [[ScanResult.rejectCode]].
     */
    BarcodePicker.prototype.isVibrateOnScanEnabled = function () {
        return this.vibrateOnScan;
    };
    /**
     * Enable or disable vibrating the device on barcode recognition (only Chrome & Firefox, requires user input).
     *
     * The vibration is triggered if there's at least a barcode not rejected via [[ScanResult.rejectCode]].
     *
     * @param enabled Whether the device should vibrate on barcode recognition.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.setVibrateOnScanEnabled = function (enabled) {
        this.vibrateOnScan = enabled;
        return this;
    };
    /**
     * @returns Whether a GUI button to switch between different cameras is shown (when available).
     */
    BarcodePicker.prototype.isCameraSwitcherEnabled = function () {
        return this.cameraManager.isCameraSwitcherEnabled();
    };
    /**
     * Show or hide a GUI button to switch between different cameras (when available).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether to show a GUI button to switch between different cameras.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.setCameraSwitcherEnabled = function (enabled) {
        this.cameraManager.setCameraSwitcherEnabled(enabled).catch(
        /* istanbul ignore next */ function () {
            // Ignored
        });
        return this;
    };
    /**
     * @returns Whether a GUI button to toggle device torch on/off is shown (when available, only Chrome).
     */
    BarcodePicker.prototype.isTorchToggleEnabled = function () {
        return this.cameraManager.isTorchToggleEnabled();
    };
    /**
     * Show or hide a GUI button to toggle device torch on/off (when available, only Chrome).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether to show a GUI button to toggle device torch on/off.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.setTorchToggleEnabled = function (enabled) {
        this.cameraManager.setTorchToggleEnabled(enabled);
        return this;
    };
    /**
     * @returns Whether manual camera focus when clicking/tapping on the video is enabled (when available, only Chrome).
     */
    BarcodePicker.prototype.isTapToFocusEnabled = function () {
        return this.cameraManager.isTapToFocusEnabled();
    };
    /**
     * Enable or disable manual camera focus when clicking/tapping on the video (when available, only Chrome).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether to enable manual camera focus when clicking/tapping on the video.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.setTapToFocusEnabled = function (enabled) {
        this.cameraManager.setTapToFocusEnabled(enabled);
        return this;
    };
    /**
     * @returns Whether camera zoom control via pinching gesture on the video is enabled (when available, only Chrome).
     */
    BarcodePicker.prototype.isPinchToZoomEnabled = function () {
        return this.cameraManager.isPinchToZoomEnabled();
    };
    /**
     * Enable or disable camera zoom control via pinching gesture on the video (when available, only Chrome).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether to enable camera zoom control via pinching gesture on the video.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.setPinchToZoomEnabled = function (enabled) {
        this.cameraManager.setPinchToZoomEnabled(enabled);
        return this;
    };
    /**
     * Enable or disable the torch/flashlight of the device (when available, only Chrome).
     * Changing active camera or camera settings will cause the torch to become disabled.
     *
     * A button on the [[BarcodePicker]] GUI to let the user toggle this functionality can also be set
     * on creation via the *enableTorchToggle* option (enabled by default, when available).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether the torch should be enabled or disabled.
     * @returns A promise resolving to the updated [[BarcodePicker]] object when the torch is enabled/disabled.
     */
    BarcodePicker.prototype.setTorchEnabled = function (enabled) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cameraManager.setTorchEnabled(enabled)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Set the zoom level of the device (when available, only Chrome).
     * Changing active camera or camera settings will cause the zoom to be reset.
     *
     * In Single Image Mode this method has no effect.
     *
     * @param zoomPercentage The percentage of the max zoom (between 0 and 1).
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.setZoom = function (zoomPercentage) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cameraManager.setZoom(zoomPercentage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * @returns Whether the barcode picker has loaded the external Scandit Engine library and is ready to scan.
     */
    BarcodePicker.prototype.isReady = function () {
        return this.isReadyToWork;
    };
    BarcodePicker.prototype.on = function (eventName, listener, once) {
        if (once === void 0) { once = false; }
        if (eventName === "ready") {
            if (this.isReadyToWork) {
                listener();
            }
            else {
                this.eventEmitter.once(eventName, listener, this);
            }
        }
        else {
            if (once === true) {
                this.eventEmitter.once(eventName, listener, this);
            }
            else {
                this.eventEmitter.on(eventName, listener, this);
            }
        }
        return this;
    };
    /**
     * Remove the specified listener from the given event's listener array.
     *
     * @param eventName The name of the event from which to remove the listener.
     * @param listener The listener function to be removed.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.removeListener = function (eventName, listener) {
        this.eventEmitter.removeListener(eventName, listener);
        return this;
    };
    /**
     * Remove all listeners from the given event's listener array.
     *
     * @param eventName The name of the event from which to remove all listeners.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.removeAllListeners = function (eventName) {
        this.eventEmitter.removeAllListeners(eventName);
        return this;
    };
    /**
     * *See the [[on]] method.*
     *
     * @param eventName The name of the event to listen to.
     * @param listener The listener function.
     * @param once <div class="tsd-signature-symbol">Default =&nbsp;false</div>
     * Whether the listener should just be triggered only once and then discarded.
     * @returns The updated [[BarcodePicker]] object.
     */
    // tslint:disable-next-line:bool-param-default
    BarcodePicker.prototype.addListener = function (eventName, listener, once) {
        return this.on(eventName, listener, once);
    };
    /**
     * Set the GUI style for the picker.
     *
     * In Single Image Mode this method has no effect.
     *
     * When the GUI style is set to *laser* or *viewfinder*, the GUI will flash on barcode recognition.
     * Note that the GUI will flash if there's at least a barcode not rejected via [[ScanResult.rejectCode]].
     *
     * @param guiStyle The new GUI style to be applied.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.setGuiStyle = function (guiStyle) {
        this.gui.setGuiStyle(guiStyle);
        return this;
    };
    /**
     * Set the fit type for the video element of the picker.
     *
     * If the "cover" type is selected the maximum available search area for barcode detection is (continuously) adjusted
     * automatically according to the visible area of the picker.
     *
     * In Single Image Mode this method has no effect.
     *
     * @param objectFit The new fit type to be applied.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.setVideoFit = function (objectFit) {
        this.gui.setVideoFit(objectFit);
        return this;
    };
    /**
     * Access the currently set or default camera, requesting user permissions if needed.
     * This method is meant to be used after the picker has been initialized with disabled camera access
     * (*accessCamera*=false) or after [[pauseScanning]] has been called with the pause camera stream option.
     * Calling this doesn't do anything if the camera is already being accessed.
     *
     * Depending on device features and user permissions for camera access, any of the following errors
     * could be the rejected result of the returned promise:
     * - `AbortError`
     * - `NoCameraAvailableError`
     * - `NotAllowedError`
     * - `NotFoundError`
     * - `NotReadableError`
     * - `SecurityError`
     *
     * In Single Image Mode this method has no effect.
     *
     * @returns A promise resolving to the updated [[BarcodePicker]] object when the camera is accessed.
     */
    BarcodePicker.prototype.accessCamera = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.cameraAccess || this.getActiveCamera() == null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cameraManager.setupCameras()];
                    case 1:
                        _a.sent();
                        this.cameraAccess = true;
                        _a.label = 2;
                    case 2: return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Create a new parser object.
     *
     * @param dataFormat The format of the input data for the parser.
     * @returns The newly created parser.
     */
    BarcodePicker.prototype.createParserForFormat = function (dataFormat) {
        return this.scanner.createParserForFormat(dataFormat);
    };
    /**
     * Reassign the barcode picker to a different HTML element.
     *
     * All the barcode picker elements inside the current origin element will be moved to the new given one.
     *
     * If an invalid element is given, a `NoOriginElementError` error is thrown.
     *
     * @param originElement The HTMLElement into which all the necessary elements for the picker will be moved.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.reassignOriginElement = function (originElement) {
        if (!browserHelper_1.BrowserHelper.isValidHTMLElement(originElement)) {
            throw new customError_1.CustomError({
                name: "NoOriginElementError",
                message: "A valid origin HTML element must be given",
            });
        }
        this.gui.reassignOriginElement(originElement);
        return this;
    };
    /**
     * Set the target frames per second to be processed by the scanning engine.
     *
     * The final speed is limited by the camera framerate (usually 30 FPS) and the frame processing time of the device.
     * By setting this to lower numbers devices can save power by performing less work during scanning operations,
     * depending on device speed (faster devices can "sleep" for longer periods).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param targetScanningFPS The target frames per second to be processed.
     * Must be a number bigger than 0, by default set to 30.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.setTargetScanningFPS = function (targetScanningFPS) {
        if (targetScanningFPS <= 0) {
            targetScanningFPS = 30;
        }
        this.targetScanningFPS = targetScanningFPS;
        return this;
    };
    /**
     * @returns The internally used initialized (and possibly configured) [[Scanner]] object instance.
     */
    BarcodePicker.prototype.getScanner = function () {
        return this.scanner;
    };
    /**
     * Clear the internal scanner session.
     *
     * This removes all recognized barcodes from the scanner session and allows them to be scanned again in case a custom
     * *codeDuplicateFilter* option was set in the [[ScanSettings]].
     *
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.clearSession = function () {
        this.scanner.clearSession();
        return this;
    };
    /**
     * Set the area of the laser displayed when the GUI style is set to *laser* (the laser will match the width and be
     * vertically centered).
     * Note that this functionality affects UI only and doesn't change the actual *searchArea* option set via
     * [[ScanSettings]]. If no area is passed, the default automatic size behaviour is set, where the laser will match
     * the current area of the image in which barcodes are searched, controlled via the *searchArea* option in
     * [[ScanSettings]].
     *
     * @param area The new search area, by default the area will match [[ScanSettings]]'s *searchArea* option.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.setLaserArea = function (area) {
        this.gui.setLaserArea(area);
        return this;
    };
    /**
     * Set the area of the viewfinder displayed when the GUI style is set to *viewfinder*.
     * Note that this functionality affects UI only and doesn't change the actual search area set via [[ScanSettings]].
     * If no area is passed, the default automatic size behaviour is set, where the viewfinder will match the current area
     * of the image in which barcodes are searched, controlled via the *searchArea* option in [[ScanSettings]].
     *
     * @param area The new search area, by default the area will match the [[ScanSettings]]'s *searchArea*.
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.setViewfinderArea = function (area) {
        this.gui.setViewfinderArea(area);
        return this;
    };
    /**
     * @hidden
     *
     * Pause the camera stream (camera access is fully interrupted).
     *
     * @returns The updated [[BarcodePicker]] object.
     */
    BarcodePicker.prototype.pauseCameraAccess = function () {
        this.cameraAccess = false;
        this.cameraManager.stopStream();
        return this;
    };
    BarcodePicker.prototype.triggerFatalError = function (error) {
        this.fatalError = error;
        console.error(error);
    };
    BarcodePicker.prototype.handleScanResult = function (scanResult) {
        var _this = this;
        scanResult = new scanResult_1.ScanResult(scanResult.barcodes, this.externalImageData, scanResult.imageSettings);
        this.eventEmitter.emit("processFrame", scanResult);
        if (scanResult.barcodes.length !== 0) {
            // This will get executed only after the other existing listeners for "processFrame" and "scan" are executed
            this.eventEmitter.once("scan", function () {
                var _a;
                if (scanResult.barcodes.some(function (barcode) {
                    return !scanResult.rejectedCodes.has(barcode);
                })) {
                    _this.gui.flashGUI();
                    if (_this.playSoundOnScan) {
                        _this.beepSound.play();
                    }
                    if (_this.vibrateOnScan) {
                        (_a = _this.vibrateFunction) === null || _a === void 0 ? void 0 : _a.call(navigator, 300);
                    }
                }
            });
            this.eventEmitter.emit("scan", scanResult);
        }
    };
    BarcodePicker.prototype.scheduleVideoProcessing = function (timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = 0; }
        window.setTimeout(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.videoProcessing()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, timeout); // Leave some breathing room for other operations
    };
    BarcodePicker.prototype.scheduleNextVideoProcessing = function (processingStartTime) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var nextProcessingCallDelay;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.targetScanningFPS < 60)) return [3 /*break*/, 4];
                        if (this.averageProcessingTime == null) {
                            this.averageProcessingTime = performance.now() - processingStartTime;
                        }
                        else {
                            this.averageProcessingTime = this.averageProcessingTime * 0.9 + (performance.now() - processingStartTime) * 0.1;
                        }
                        nextProcessingCallDelay = Math.max(0, 1000 / this.targetScanningFPS - this.averageProcessingTime);
                        if (!(Math.round(nextProcessingCallDelay) <= 16)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.videoProcessing()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.scheduleVideoProcessing(nextProcessingCallDelay);
                        _a.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.videoProcessing()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    BarcodePicker.prototype.processVideoFrame = function (highQualitySingleFrameMode) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var scanResult, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.internalImageData = this.gui.getImageData(this.internalImageData);
                        // This could happen in unexpected situations and should be temporary
                        // istanbul ignore if
                        if (this.internalImageData == null) {
                            return [2 /*return*/];
                        }
                        if (this.externalImageData == null ||
                            this.externalImageData.byteLength === 0 ||
                            this.externalImageData.byteLength !== this.internalImageData.byteLength) {
                            this.externalImageData = new Uint8Array(this.internalImageData);
                        }
                        else {
                            this.externalImageData.set(this.internalImageData);
                        }
                        if (!!this.scanningPaused) return [3 /*break*/, 4];
                        if (this.eventEmitter.listenerCount("submitFrame") > 0) {
                            this.eventEmitter.emit("submitFrame", new scanResult_1.ScanResult([], this.externalImageData, this.scanner.getImageSettings()));
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.scanner.processImage(this.internalImageData, highQualitySingleFrameMode)];
                    case 2:
                        scanResult = _a.sent();
                        this.internalImageData = scanResult.imageData;
                        // Paused status could have changed in the meantime
                        if (!this.scanningPaused) {
                            this.handleScanResult(scanResult);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.internalImageData = undefined;
                        if (error_1.name === "ImageSettingsDataMismatch") {
                            // This could happen in unexpected situations and should be temporary
                            return [2 /*return*/];
                        }
                        this.pauseScanning();
                        this.eventEmitter.emit("scanError", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BarcodePicker.prototype.videoProcessing = function () {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var processingStartTime;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.destroyed) {
                            return [2 /*return*/];
                        }
                        if (((_a = this.getActiveCamera()) === null || _a === void 0 ? void 0 : _a.currentResolution) == null ||
                            this.fatalError != null ||
                            this.scanningPaused ||
                            !this.scanner.isReady() ||
                            this.scanner.isBusyProcessing() ||
                            this.latestVideoTimeProcessed === this.gui.getVideoCurrentTime()) {
                            this.scheduleVideoProcessing();
                            return [2 /*return*/];
                        }
                        if (!(this.latestVideoTimeProcessed == null)) return [3 /*break*/, 2];
                        // Show active GUI if needed, as now it's the moment the scanner is ready and used for the first time
                        return [4 /*yield*/, this.resumeScanning()];
                    case 1:
                        // Show active GUI if needed, as now it's the moment the scanner is ready and used for the first time
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        processingStartTime = performance.now();
                        this.latestVideoTimeProcessed = this.gui.getVideoCurrentTime();
                        return [4 /*yield*/, this.processVideoFrame(false)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.scheduleNextVideoProcessing(processingStartTime)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BarcodePicker.prototype.handleScannerReady = function () {
        this.isReadyToWork = true;
        this.eventEmitter.emit("ready");
    };
    return BarcodePicker;
}());
exports.BarcodePicker = BarcodePicker;
// istanbul ignore next
(function (BarcodePicker) {
    /**
     * GUI style to be used by a barcode picker, used to hint barcode placement in the frame.
     */
    var GuiStyle;
    (function (GuiStyle) {
        /**
         * No GUI is shown to indicate where the barcode should be placed.
         * Be aware that the Scandit logo continues to be displayed as showing it is part of the license agreement.
         */
        GuiStyle["NONE"] = "none";
        /**
         * A laser line is shown.
         */
        GuiStyle["LASER"] = "laser";
        /**
         * A rectangular viewfinder with rounded corners is shown.
         */
        GuiStyle["VIEWFINDER"] = "viewfinder";
    })(GuiStyle = BarcodePicker.GuiStyle || (BarcodePicker.GuiStyle = {}));
    /**
     * Fit type used to control the resizing (scale) of the barcode picker to fit in its container *originElement*.
     */
    var ObjectFit;
    (function (ObjectFit) {
        /**
         * Scale to maintain aspect ratio while fitting within the *originElement*'s content box.
         * Aspect ratio is preserved, so the barcode picker will be "letterboxed" if its aspect ratio
         * does not match the aspect ratio of the box.
         */
        ObjectFit["CONTAIN"] = "contain";
        /**
         * Scale to maintain aspect ratio while filling the *originElement*'s entire content box.
         * Aspect ratio is preserved, so the barcode picker will be clipped to fit if its aspect ratio
         * does not match the aspect ratio of the box.
         */
        ObjectFit["COVER"] = "cover";
    })(ObjectFit = BarcodePicker.ObjectFit || (BarcodePicker.ObjectFit = {}));
})(BarcodePicker = exports.BarcodePicker || (exports.BarcodePicker = {}));
exports.BarcodePicker = BarcodePicker;
//# sourceMappingURL=barcodePicker.js.map