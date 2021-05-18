import { EventEmitter } from "eventemitter3";
import { Howl, Howler } from "howler/dist/howler.core.min.js";
import { beepSound } from "../assets/base64assets";
import { configurePhase } from "../../index";
import { BrowserHelper } from "../browserHelper";
import { Camera } from "../camera";
import { CustomError } from "../customError";
import { Scanner } from "../scanner";
import { ScanResult } from "../scanResult";
import { ScanSettings } from "../scanSettings";
import { SingleImageModeSettings } from "../singleImageModeSettings";
import { UnsupportedBrowserError } from "../unsupportedBrowserError";
import { CameraManager } from "./cameraManager";
import { DummyCameraManager } from "./dummyCameraManager";
import { GUI } from "./gui";
/**
 * @hidden
 */
class BarcodePickerEventEmitter extends EventEmitter {
}
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
export class BarcodePicker {
    constructor(originElement, { visible, singleImageModeEnabled, singleImageModeSettings, playSoundOnScan, vibrateOnScan, scanningPaused, guiStyle, videoFit, laserArea, viewfinderArea, scanner, scanSettings, cameraType, targetScanningFPS, hideLogo, }) {
        this.isReadyToWork = false;
        this.destroyed = false;
        this.scanningPaused = scanningPaused;
        Howler.autoSuspend = false;
        this.beepSound = new Howl({
            src: beepSound,
        });
        this.vibrateFunction = navigator.vibrate ?? navigator.webkitVibrate ?? navigator.mozVibrate ?? navigator.msVibrate;
        this.eventEmitter = new EventEmitter();
        this.setPlaySoundOnScanEnabled(playSoundOnScan);
        this.setVibrateOnScanEnabled(vibrateOnScan);
        this.setTargetScanningFPS(targetScanningFPS);
        this.scanner = scanner?.applyScanSettings(scanSettings) ?? new Scanner({ scanSettings });
        this.scannerReadyEventListener = this.handleScannerReady.bind(this);
        this.scanner.on("ready", this.scannerReadyEventListener);
        this.gui = new GUI({
            scanner: this.scanner,
            originElement,
            singleImageModeEnabled,
            singleImageModeSettings,
            scanningPaused,
            visible,
            guiStyle,
            videoFit,
            hideLogo,
            laserArea,
            viewfinderArea,
            cameraUploadCallback: this.processVideoFrame.bind(this, true),
        });
        if (singleImageModeEnabled) {
            this.cameraManager = new DummyCameraManager(this.scanner, this.triggerFatalError.bind(this), this.gui);
            this.gui.setCameraType(cameraType);
        }
        else {
            this.cameraManager = new CameraManager(this.scanner, this.triggerFatalError.bind(this), this.gui);
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
    static ready() { }
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
    static submitFrame(scanResult) { }
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
    static processFrame(scanResult) { }
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
    static scan(scanResult) { }
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
    static scanError(error) { }
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
    static async create(originElement, { visible = true, singleImageModeSettings = {}, playSoundOnScan = false, vibrateOnScan = false, scanningPaused = false, guiStyle = BarcodePicker.GuiStyle.LASER, videoFit = BarcodePicker.ObjectFit.CONTAIN, laserArea, viewfinderArea, scanner, scanSettings = new ScanSettings(), enableCameraSwitcher = true, enableTorchToggle = true, enableTapToFocus = true, enablePinchToZoom = true, accessCamera = true, camera, cameraType = Camera.Type.BACK, cameraSettings, targetScanningFPS = 30, 
    /**
     * @hidden
     */
    hideLogo = false, } = {}) {
        const deviceType = BrowserHelper.userAgentInfo.getDevice().type;
        const isMobileDevice = deviceType === "mobile" || deviceType === "tablet";
        const singleImageModePlatformSettings = (isMobileDevice ? singleImageModeSettings.mobile : singleImageModeSettings.desktop) ?? {};
        const singleImageModeDisallowed = singleImageModePlatformSettings.usageStrategy === SingleImageModeSettings.UsageStrategy.NEVER;
        const singleImageModeForced = singleImageModePlatformSettings.usageStrategy === SingleImageModeSettings.UsageStrategy.ALWAYS;
        const browserCompatibility = BrowserHelper.checkBrowserCompatibility();
        if (!browserCompatibility.scannerSupport || (singleImageModeDisallowed && !browserCompatibility.fullSupport)) {
            throw new UnsupportedBrowserError(browserCompatibility);
        }
        if (!browserCompatibility.fullSupport && !singleImageModeForced) {
            console.log("BarcodePicker's Single Image Mode is being used as fallback as the OS/browser combination doesn't " +
                "support camera video stream scanning (https://caniuse.com/#feat=stream). " +
                'You can configure this behaviour via the "singleImageModeSettings" option.', browserCompatibility);
        }
        if (configurePhase !== "done") {
            throw new CustomError({
                name: "LibraryNotConfiguredError",
                message: configurePhase === "started"
                    ? `The library has not completed its configuration yet, please call 'configure' and wait for the returned
              promise's resolution`
                    : `The library was not configured, 'configure' must be called with valid parameters before instantiating
              the BarcodePicker`,
            });
        }
        if (!BrowserHelper.isValidHTMLElement(originElement)) {
            throw new CustomError({
                name: "NoOriginElementError",
                message: "A valid origin HTML element must be given",
            });
        }
        const barcodePicker = new BarcodePicker(originElement, {
            visible,
            singleImageModeEnabled: browserCompatibility.fullSupport ? singleImageModeForced : true,
            singleImageModeSettings: singleImageModePlatformSettings,
            playSoundOnScan,
            vibrateOnScan,
            scanningPaused,
            guiStyle,
            videoFit,
            laserArea,
            viewfinderArea,
            scanner,
            scanSettings,
            cameraType,
            targetScanningFPS,
            hideLogo,
        });
        barcodePicker.cameraManager.setInteractionOptions(enableCameraSwitcher, enableTorchToggle, enableTapToFocus, enablePinchToZoom);
        barcodePicker.cameraManager.setInitialCameraType(cameraType);
        barcodePicker.cameraManager.setSelectedCamera(camera);
        barcodePicker.cameraManager.setSelectedCameraSettings(cameraSettings);
        barcodePicker.cameraAccess = accessCamera;
        // Show error in alert on ScanError by default when running on local IP address for easier customer debugging
        barcodePicker.on("scanError", (error) => {
            // istanbul ignore if
            if (["localhost", "127.0.0.1", ""].includes(window.location.hostname)) {
                alert(error);
            }
        });
        if (accessCamera) {
            await barcodePicker.cameraManager.setupCameras();
        }
        return barcodePicker;
    }
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
    destroy(destroyScanner = true) {
        this.pauseScanning(true);
        this.scanner.removeListener("ready", this.scannerReadyEventListener);
        this.destroyed = true;
        if (destroyScanner) {
            this.scanner.destroy();
        }
        this.gui.destroy();
        this.eventEmitter.removeAllListeners();
    }
    /**
     * Apply a new set of scan settings to the internal scanner (replacing old settings).
     *
     * @param scanSettings The scan configuration object to be applied to the scanner.
     * @returns The updated [[BarcodePicker]] object.
     */
    applyScanSettings(scanSettings) {
        this.scanner.applyScanSettings(scanSettings);
        return this;
    }
    /**
     * @returns Whether the scanning is currently paused.
     */
    isScanningPaused() {
        return this.scanningPaused;
    }
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
    pauseScanning(pauseCamera = false) {
        this.scanningPaused = true;
        if (pauseCamera) {
            this.cameraManager.stopStream();
        }
        if (this.scanner.isReady()) {
            this.gui.pauseScanning();
        }
        return this;
    }
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
    async resumeScanning() {
        this.scanningPaused = false;
        if (this.scanner.isReady()) {
            this.gui.resumeScanning();
        }
        if (this.cameraAccess && this.getActiveCamera() == null) {
            await this.cameraManager.setupCameras();
        }
        return this;
    }
    /**
     * @returns The currently active camera.
     */
    getActiveCamera() {
        return this.cameraManager.activeCamera;
    }
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
    async setActiveCamera(camera, cameraSettings) {
        if (camera == null || !this.cameraAccess) {
            this.cameraManager.setSelectedCamera(camera);
            this.cameraManager.setSelectedCameraSettings(cameraSettings);
            if (this.cameraAccess) {
                await this.cameraManager.setupCameras();
            }
        }
        else {
            await this.cameraManager.initializeCameraWithSettings(camera, cameraSettings);
        }
        return this;
    }
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
    async setCameraType(cameraType) {
        this.gui.setCameraType(cameraType);
        if (this.cameraAccess) {
            await this.cameraManager.setCameraType(cameraType);
        }
        else {
            this.cameraManager.setInitialCameraType(cameraType);
        }
        return this;
    }
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
    async applyCameraSettings(cameraSettings) {
        if (!this.cameraAccess) {
            this.cameraManager.setSelectedCameraSettings(cameraSettings);
        }
        else {
            await this.cameraManager.applyCameraSettings(cameraSettings);
        }
        return this;
    }
    /**
     * @returns Whether the picker is in a visible state or not.
     */
    isVisible() {
        return this.gui.isVisible();
    }
    /**
     * Enable or disable picker visibility.
     *
     * Note that this does not affect camera access, frame processing or any other picker logic.
     *
     * @param visible Whether the picker is in a visible state or not.
     * @returns The updated [[BarcodePicker]] object.
     */
    setVisible(visible) {
        this.gui.setVisible(visible);
        return this;
    }
    /**
     * @returns Whether the currently selected camera's video is mirrored along the vertical axis.
     */
    isMirrorImageEnabled() {
        return this.gui.isMirrorImageEnabled();
    }
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
    setMirrorImageEnabled(enabled) {
        this.gui.setMirrorImageEnabled(enabled, true);
        return this;
    }
    /**
     * @returns Whether a sound should be played on barcode recognition (iOS requires user input).
     * Note that the sound is played if there's at least a barcode not rejected via [[ScanResult.rejectCode]].
     */
    isPlaySoundOnScanEnabled() {
        return this.playSoundOnScan;
    }
    /**
     * Enable or disable playing a sound on barcode recognition (iOS requires user input).
     *
     * The sound is played if there's at least a barcode not rejected via [[ScanResult.rejectCode]].
     *
     * @param enabled Whether a sound should be played on barcode recognition.
     * @returns The updated [[BarcodePicker]] object.
     */
    setPlaySoundOnScanEnabled(enabled) {
        this.playSoundOnScan = enabled;
        return this;
    }
    /**
     * @returns Whether the device should vibrate on barcode recognition (only Chrome & Firefox, requires user input).
     * Note that the vibration is triggered if there's at least a barcode not rejected via [[ScanResult.rejectCode]].
     */
    isVibrateOnScanEnabled() {
        return this.vibrateOnScan;
    }
    /**
     * Enable or disable vibrating the device on barcode recognition (only Chrome & Firefox, requires user input).
     *
     * The vibration is triggered if there's at least a barcode not rejected via [[ScanResult.rejectCode]].
     *
     * @param enabled Whether the device should vibrate on barcode recognition.
     * @returns The updated [[BarcodePicker]] object.
     */
    setVibrateOnScanEnabled(enabled) {
        this.vibrateOnScan = enabled;
        return this;
    }
    /**
     * @returns Whether a GUI button to switch between different cameras is shown (when available).
     */
    isCameraSwitcherEnabled() {
        return this.cameraManager.isCameraSwitcherEnabled();
    }
    /**
     * Show or hide a GUI button to switch between different cameras (when available).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether to show a GUI button to switch between different cameras.
     * @returns The updated [[BarcodePicker]] object.
     */
    setCameraSwitcherEnabled(enabled) {
        this.cameraManager.setCameraSwitcherEnabled(enabled).catch(
        /* istanbul ignore next */ () => {
            // Ignored
        });
        return this;
    }
    /**
     * @returns Whether a GUI button to toggle device torch on/off is shown (when available, only Chrome).
     */
    isTorchToggleEnabled() {
        return this.cameraManager.isTorchToggleEnabled();
    }
    /**
     * Show or hide a GUI button to toggle device torch on/off (when available, only Chrome).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether to show a GUI button to toggle device torch on/off.
     * @returns The updated [[BarcodePicker]] object.
     */
    setTorchToggleEnabled(enabled) {
        this.cameraManager.setTorchToggleEnabled(enabled);
        return this;
    }
    /**
     * @returns Whether manual camera focus when clicking/tapping on the video is enabled (when available, only Chrome).
     */
    isTapToFocusEnabled() {
        return this.cameraManager.isTapToFocusEnabled();
    }
    /**
     * Enable or disable manual camera focus when clicking/tapping on the video (when available, only Chrome).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether to enable manual camera focus when clicking/tapping on the video.
     * @returns The updated [[BarcodePicker]] object.
     */
    setTapToFocusEnabled(enabled) {
        this.cameraManager.setTapToFocusEnabled(enabled);
        return this;
    }
    /**
     * @returns Whether camera zoom control via pinching gesture on the video is enabled (when available, only Chrome).
     */
    isPinchToZoomEnabled() {
        return this.cameraManager.isPinchToZoomEnabled();
    }
    /**
     * Enable or disable camera zoom control via pinching gesture on the video (when available, only Chrome).
     *
     * In Single Image Mode this method has no effect.
     *
     * @param enabled Whether to enable camera zoom control via pinching gesture on the video.
     * @returns The updated [[BarcodePicker]] object.
     */
    setPinchToZoomEnabled(enabled) {
        this.cameraManager.setPinchToZoomEnabled(enabled);
        return this;
    }
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
    async setTorchEnabled(enabled) {
        await this.cameraManager.setTorchEnabled(enabled);
        return this;
    }
    /**
     * Set the zoom level of the device (when available, only Chrome).
     * Changing active camera or camera settings will cause the zoom to be reset.
     *
     * In Single Image Mode this method has no effect.
     *
     * @param zoomPercentage The percentage of the max zoom (between 0 and 1).
     * @returns The updated [[BarcodePicker]] object.
     */
    async setZoom(zoomPercentage) {
        await this.cameraManager.setZoom(zoomPercentage);
        return this;
    }
    /**
     * @returns Whether the barcode picker has loaded the external Scandit Engine library and is ready to scan.
     */
    isReady() {
        return this.isReadyToWork;
    }
    on(eventName, listener, once = false) {
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
    }
    /**
     * Remove the specified listener from the given event's listener array.
     *
     * @param eventName The name of the event from which to remove the listener.
     * @param listener The listener function to be removed.
     * @returns The updated [[BarcodePicker]] object.
     */
    removeListener(eventName, listener) {
        this.eventEmitter.removeListener(eventName, listener);
        return this;
    }
    /**
     * Remove all listeners from the given event's listener array.
     *
     * @param eventName The name of the event from which to remove all listeners.
     * @returns The updated [[BarcodePicker]] object.
     */
    removeAllListeners(eventName) {
        this.eventEmitter.removeAllListeners(eventName);
        return this;
    }
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
    addListener(eventName, listener, once) {
        return this.on(eventName, listener, once);
    }
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
    setGuiStyle(guiStyle) {
        this.gui.setGuiStyle(guiStyle);
        return this;
    }
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
    setVideoFit(objectFit) {
        this.gui.setVideoFit(objectFit);
        return this;
    }
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
    async accessCamera() {
        if (!this.cameraAccess || this.getActiveCamera() == null) {
            await this.cameraManager.setupCameras();
            this.cameraAccess = true;
        }
        return this;
    }
    /**
     * Create a new parser object.
     *
     * @param dataFormat The format of the input data for the parser.
     * @returns The newly created parser.
     */
    createParserForFormat(dataFormat) {
        return this.scanner.createParserForFormat(dataFormat);
    }
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
    reassignOriginElement(originElement) {
        if (!BrowserHelper.isValidHTMLElement(originElement)) {
            throw new CustomError({
                name: "NoOriginElementError",
                message: "A valid origin HTML element must be given",
            });
        }
        this.gui.reassignOriginElement(originElement);
        return this;
    }
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
    setTargetScanningFPS(targetScanningFPS) {
        if (targetScanningFPS <= 0) {
            targetScanningFPS = 30;
        }
        this.targetScanningFPS = targetScanningFPS;
        return this;
    }
    /**
     * @returns The internally used initialized (and possibly configured) [[Scanner]] object instance.
     */
    getScanner() {
        return this.scanner;
    }
    /**
     * Clear the internal scanner session.
     *
     * This removes all recognized barcodes from the scanner session and allows them to be scanned again in case a custom
     * *codeDuplicateFilter* option was set in the [[ScanSettings]].
     *
     * @returns The updated [[BarcodePicker]] object.
     */
    clearSession() {
        this.scanner.clearSession();
        return this;
    }
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
    setLaserArea(area) {
        this.gui.setLaserArea(area);
        return this;
    }
    /**
     * Set the area of the viewfinder displayed when the GUI style is set to *viewfinder*.
     * Note that this functionality affects UI only and doesn't change the actual search area set via [[ScanSettings]].
     * If no area is passed, the default automatic size behaviour is set, where the viewfinder will match the current area
     * of the image in which barcodes are searched, controlled via the *searchArea* option in [[ScanSettings]].
     *
     * @param area The new search area, by default the area will match the [[ScanSettings]]'s *searchArea*.
     * @returns The updated [[BarcodePicker]] object.
     */
    setViewfinderArea(area) {
        this.gui.setViewfinderArea(area);
        return this;
    }
    /**
     * @hidden
     *
     * Pause the camera stream (camera access is fully interrupted).
     *
     * @returns The updated [[BarcodePicker]] object.
     */
    pauseCameraAccess() {
        this.cameraAccess = false;
        this.cameraManager.stopStream();
        return this;
    }
    triggerFatalError(error) {
        this.fatalError = error;
        console.error(error);
    }
    handleScanResult(scanResult) {
        scanResult = new ScanResult(scanResult.barcodes, this.externalImageData, scanResult.imageSettings);
        this.eventEmitter.emit("processFrame", scanResult);
        if (scanResult.barcodes.length !== 0) {
            // This will get executed only after the other existing listeners for "processFrame" and "scan" are executed
            this.eventEmitter.once("scan", () => {
                if (scanResult.barcodes.some((barcode) => {
                    return !scanResult.rejectedCodes.has(barcode);
                })) {
                    this.gui.flashGUI();
                    if (this.playSoundOnScan) {
                        this.beepSound.play();
                    }
                    if (this.vibrateOnScan) {
                        this.vibrateFunction?.call(navigator, 300);
                    }
                }
            });
            this.eventEmitter.emit("scan", scanResult);
        }
    }
    scheduleVideoProcessing(timeout = 0) {
        window.setTimeout(async () => {
            await this.videoProcessing();
        }, timeout); // Leave some breathing room for other operations
    }
    async scheduleNextVideoProcessing(processingStartTime) {
        if (this.targetScanningFPS < 60) {
            if (this.averageProcessingTime == null) {
                this.averageProcessingTime = performance.now() - processingStartTime;
            }
            else {
                this.averageProcessingTime = this.averageProcessingTime * 0.9 + (performance.now() - processingStartTime) * 0.1;
            }
            const nextProcessingCallDelay = Math.max(0, 1000 / this.targetScanningFPS - this.averageProcessingTime);
            if (Math.round(nextProcessingCallDelay) <= 16) {
                await this.videoProcessing();
            }
            else {
                this.scheduleVideoProcessing(nextProcessingCallDelay);
            }
        }
        else {
            await this.videoProcessing();
        }
    }
    async processVideoFrame(highQualitySingleFrameMode) {
        this.internalImageData = this.gui.getImageData(this.internalImageData);
        // This could happen in unexpected situations and should be temporary
        // istanbul ignore if
        if (this.internalImageData == null) {
            return;
        }
        if (this.externalImageData == null ||
            this.externalImageData.byteLength === 0 ||
            this.externalImageData.byteLength !== this.internalImageData.byteLength) {
            this.externalImageData = new Uint8Array(this.internalImageData);
        }
        else {
            this.externalImageData.set(this.internalImageData);
        }
        if (!this.scanningPaused) {
            if (this.eventEmitter.listenerCount("submitFrame") > 0) {
                this.eventEmitter.emit("submitFrame", new ScanResult([], this.externalImageData, this.scanner.getImageSettings()));
            }
            try {
                const scanResult = await this.scanner.processImage(this.internalImageData, highQualitySingleFrameMode);
                this.internalImageData = scanResult.imageData;
                // Paused status could have changed in the meantime
                if (!this.scanningPaused) {
                    this.handleScanResult(scanResult);
                }
            }
            catch (error) {
                this.internalImageData = undefined;
                if (error.name === "ImageSettingsDataMismatch") {
                    // This could happen in unexpected situations and should be temporary
                    return;
                }
                this.pauseScanning();
                this.eventEmitter.emit("scanError", error);
            }
        }
    }
    async videoProcessing() {
        if (this.destroyed) {
            return;
        }
        if (this.getActiveCamera()?.currentResolution == null ||
            this.fatalError != null ||
            this.scanningPaused ||
            !this.scanner.isReady() ||
            this.scanner.isBusyProcessing() ||
            this.latestVideoTimeProcessed === this.gui.getVideoCurrentTime()) {
            this.scheduleVideoProcessing();
            return;
        }
        if (this.latestVideoTimeProcessed == null) {
            // Show active GUI if needed, as now it's the moment the scanner is ready and used for the first time
            await this.resumeScanning();
        }
        const processingStartTime = performance.now();
        this.latestVideoTimeProcessed = this.gui.getVideoCurrentTime();
        await this.processVideoFrame(false);
        await this.scheduleNextVideoProcessing(processingStartTime);
    }
    handleScannerReady() {
        this.isReadyToWork = true;
        this.eventEmitter.emit("ready");
    }
}
// istanbul ignore next
(function (BarcodePicker) {
    /**
     * GUI style to be used by a barcode picker, used to hint barcode placement in the frame.
     */
    let GuiStyle;
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
    let ObjectFit;
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
})(BarcodePicker || (BarcodePicker = {}));
//# sourceMappingURL=barcodePicker.js.map