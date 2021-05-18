import { BrowserHelper } from "../browserHelper";
import { Camera } from "../camera";
import { CameraAccess } from "../cameraAccess";
import { CameraSettings } from "../cameraSettings";
import { CustomError } from "../customError";
export var MeteringMode;
(function (MeteringMode) {
    MeteringMode["CONTINUOUS"] = "continuous";
    MeteringMode["MANUAL"] = "manual";
    MeteringMode["NONE"] = "none";
    MeteringMode["SINGLE_SHOT"] = "single-shot";
})(MeteringMode || (MeteringMode = {}));
export var CameraResolutionConstraint;
(function (CameraResolutionConstraint) {
    CameraResolutionConstraint[CameraResolutionConstraint["ULTRA_HD"] = 0] = "ULTRA_HD";
    CameraResolutionConstraint[CameraResolutionConstraint["FULL_HD"] = 1] = "FULL_HD";
    CameraResolutionConstraint[CameraResolutionConstraint["HD"] = 2] = "HD";
    CameraResolutionConstraint[CameraResolutionConstraint["SD"] = 3] = "SD";
    CameraResolutionConstraint[CameraResolutionConstraint["NONE"] = 4] = "NONE";
})(CameraResolutionConstraint || (CameraResolutionConstraint = {}));
/**
 * A barcode picker utility class used to handle camera interaction.
 */
export class CameraManager {
    constructor(scanner, triggerFatalError, gui) {
        this.postStreamInitializationListener = this.postStreamInitialization.bind(this);
        this.videoResizeListener = this.videoResizeHandle.bind(this);
        this.videoTrackEndedListener = this.videoTrackEndedRecovery.bind(this);
        this.videoTrackMuteListener = this.videoTrackMuteRecovery.bind(this);
        this.triggerManualFocusListener = this.triggerManualFocus.bind(this);
        this.triggerZoomStartListener = this.triggerZoomStart.bind(this);
        this.triggerZoomMoveListener = this.triggerZoomMove.bind(this);
        this.scanner = scanner;
        this.triggerFatalError = triggerFatalError;
        this.gui = gui;
        this.cameraType = Camera.Type.BACK;
    }
    setInteractionOptions(cameraSwitcherEnabled, torchToggleEnabled, tapToFocusEnabled, pinchToZoomEnabled) {
        this.cameraSwitcherEnabled = cameraSwitcherEnabled;
        this.torchToggleEnabled = torchToggleEnabled;
        this.tapToFocusEnabled = tapToFocusEnabled;
        this.pinchToZoomEnabled = pinchToZoomEnabled;
    }
    isCameraSwitcherEnabled() {
        return this.cameraSwitcherEnabled;
    }
    async setCameraSwitcherEnabled(enabled) {
        this.cameraSwitcherEnabled = enabled;
        if (this.cameraSwitcherEnabled) {
            const cameras = await CameraAccess.getCameras();
            if (cameras.length > 1) {
                this.gui.setCameraSwitcherVisible(true);
            }
        }
        else {
            this.gui.setCameraSwitcherVisible(false);
        }
    }
    isTorchToggleEnabled() {
        return this.torchToggleEnabled;
    }
    setTorchToggleEnabled(enabled) {
        this.torchToggleEnabled = enabled;
        if (this.torchToggleEnabled) {
            if (this.mediaStream != null && this.mediaTrackCapabilities?.torch === true) {
                this.gui.setTorchTogglerVisible(true);
            }
        }
        else {
            this.gui.setTorchTogglerVisible(false);
        }
    }
    isTapToFocusEnabled() {
        return this.tapToFocusEnabled;
    }
    setTapToFocusEnabled(enabled) {
        this.tapToFocusEnabled = enabled;
        if (this.mediaStream != null) {
            if (this.tapToFocusEnabled) {
                this.enableTapToFocusListeners();
            }
            else {
                this.disableTapToFocusListeners();
            }
        }
    }
    isPinchToZoomEnabled() {
        return this.pinchToZoomEnabled;
    }
    setPinchToZoomEnabled(enabled) {
        this.pinchToZoomEnabled = enabled;
        if (this.mediaStream != null) {
            if (this.pinchToZoomEnabled) {
                this.enablePinchToZoomListeners();
            }
            else {
                this.disablePinchToZoomListeners();
            }
        }
    }
    setInitialCameraType(cameraType) {
        this.cameraType = cameraType;
    }
    async setCameraType(cameraType) {
        this.setInitialCameraType(cameraType);
        const mainCameraForType = CameraAccess.getMainCameraForType(await CameraAccess.getCameras(), cameraType);
        if (mainCameraForType != null && mainCameraForType !== this.selectedCamera) {
            return this.initializeCameraWithSettings(mainCameraForType, this.selectedCameraSettings);
        }
    }
    setSelectedCamera(camera) {
        this.selectedCamera = camera;
    }
    setSelectedCameraSettings(cameraSettings) {
        this.selectedCameraSettings = cameraSettings;
    }
    async setupCameras() {
        if (this.cameraSetupPromise != null) {
            return this.cameraSetupPromise;
        }
        this.cameraSetupPromise = this.setupCamerasAndStream();
        return this.cameraSetupPromise;
    }
    stopStream() {
        if (this.activeCamera != null) {
            this.activeCamera.currentResolution = undefined;
        }
        this.activeCamera = undefined;
        if (this.mediaStream != null) {
            console.debug("Stop camera video stream access (stream):", this.mediaStream);
            window.clearTimeout(this.cameraAccessTimeout);
            window.clearInterval(this.videoMetadataCheckInterval);
            window.clearTimeout(this.getCapabilitiesTimeout);
            window.clearTimeout(this.manualFocusWaitTimeout);
            window.clearTimeout(this.manualToAutofocusResumeTimeout);
            window.clearInterval(this.autofocusInterval);
            this.mediaStream.getVideoTracks().forEach((track) => {
                track.removeEventListener("ended", this.videoTrackEndedListener);
                track.stop();
            });
            this.gui.videoElement.srcObject = null;
            this.mediaStream = undefined;
            this.mediaTrackCapabilities = undefined;
        }
    }
    async applyCameraSettings(cameraSettings) {
        this.selectedCameraSettings = cameraSettings;
        if (this.activeCamera == null) {
            throw new CustomError(CameraManager.noCameraErrorParameters);
        }
        return this.initializeCameraWithSettings(this.activeCamera, cameraSettings);
    }
    async reinitializeCamera() {
        if (this.activeCamera == null) {
            // If the initial camera isn't active yet, do nothing: if and when the camera is later confirmed to be the correct
            // (main with wanted type or only) one this method will be called again after the camera is set to be active
            console.debug("Camera reinitialization delayed");
        }
        else {
            console.debug("Reinitialize camera:", this.activeCamera);
            try {
                await this.initializeCameraWithSettings(this.activeCamera, this.activeCameraSettings);
            }
            catch (error) {
                console.warn("Couldn't access camera:", this.activeCamera, error);
                this.triggerFatalError(error);
                throw error;
            }
        }
    }
    async initializeCameraWithSettings(camera, cameraSettings) {
        if (this.cameraInitializationPromise != null) {
            await this.cameraInitializationPromise;
        }
        this.setSelectedCamera(camera);
        this.selectedCameraSettings = this.activeCameraSettings = cameraSettings;
        this.cameraInitializationPromise = this.initializeCameraAndCheckUpdatedSettings(camera);
        return this.cameraInitializationPromise;
    }
    async setTorchEnabled(enabled) {
        if (this.mediaStream != null && this.mediaTrackCapabilities?.torch === true) {
            this.torchEnabled = enabled;
            const videoTracks = this.mediaStream.getVideoTracks();
            // istanbul ignore else
            if (videoTracks.length !== 0 && typeof videoTracks[0].applyConstraints === "function") {
                await videoTracks[0].applyConstraints({ advanced: [{ torch: enabled }] });
            }
        }
    }
    async toggleTorch() {
        this.torchEnabled = !this.torchEnabled;
        await this.setTorchEnabled(this.torchEnabled);
    }
    async setZoom(zoomPercentage, currentZoom) {
        if (this.mediaStream != null && this.mediaTrackCapabilities?.zoom != null) {
            const videoTracks = this.mediaStream.getVideoTracks();
            // istanbul ignore else
            if (videoTracks.length !== 0 && typeof videoTracks[0].applyConstraints === "function") {
                const zoomRange = this.mediaTrackCapabilities.zoom.max - this.mediaTrackCapabilities.zoom.min;
                const targetZoom = Math.max(this.mediaTrackCapabilities.zoom.min, Math.min((currentZoom ?? this.mediaTrackCapabilities.zoom.min) + zoomRange * zoomPercentage, this.mediaTrackCapabilities.zoom.max));
                await videoTracks[0].applyConstraints({
                    advanced: [{ zoom: targetZoom }],
                });
            }
        }
    }
    async recoverStreamIfNeeded() {
        // Due to non-standard behaviour, it could happen that the stream got interrupted while getting the list of
        // cameras, this isn't handled by the existing "ended" event listener as the active camera wasn't set until
        // before this, so manually reinitialize camera if needed
        const videoTracks = this.mediaStream?.getVideoTracks();
        if (videoTracks?.[0]?.readyState === "ended") {
            await this.reinitializeCamera();
        }
    }
    async setupCamerasAndStream() {
        try {
            let initialCamera;
            if (this.selectedCamera == null) {
                initialCamera = await this.accessInitialCamera();
            }
            const cameras = await CameraAccess.getCameras();
            if (this.cameraSwitcherEnabled && cameras.length > 1) {
                this.gui.setCameraSwitcherVisible(true);
            }
            // Get but don't save deviceId in initialCamera to differentiate it from final cameras
            const initialCameraDeviceId = this.mediaStream?.getVideoTracks()[0]?.getSettings?.().deviceId;
            if (this.mediaStream != null && initialCamera != null) {
                // We successfully accessed the initial camera
                const activeCamera = cameras.length === 1
                    ? cameras[0]
                    : cameras.find((camera) => {
                        return (camera.deviceId === initialCameraDeviceId ||
                            (camera.label !== "" && camera.label === initialCamera?.label));
                    });
                if (activeCamera != null) {
                    CameraAccess.adjustCameraFromMediaStream(this.mediaStream, activeCamera);
                    if (BrowserHelper.isDesktopDevice()) {
                        // When the device is a desktop/laptop, we store the initial camera as it should be considered the main one
                        // for its camera type and the currently set camera type (which might be different)
                        CameraAccess.mainCameraForTypeOverridesOnDesktop.set(this.cameraType, activeCamera);
                        CameraAccess.mainCameraForTypeOverridesOnDesktop.set(activeCamera.cameraType, activeCamera);
                    }
                    if (cameras.length === 1 || CameraAccess.getMainCameraForType(cameras, this.cameraType) === activeCamera) {
                        console.debug("Initial camera access was correct (main camera), keep camera:", activeCamera);
                        this.setSelectedCamera(activeCamera);
                        this.updateActiveCameraCurrentResolution(activeCamera);
                        await this.recoverStreamIfNeeded();
                        return;
                    }
                    else {
                        console.debug("Initial camera access was incorrect (not main camera), change camera", {
                            ...initialCamera,
                            deviceId: initialCameraDeviceId,
                        });
                    }
                }
                else {
                    console.debug("Initial camera access was incorrect (unknown camera), change camera", {
                        ...initialCamera,
                        deviceId: initialCameraDeviceId,
                    });
                }
            }
            if (this.selectedCamera == null) {
                return await this.accessAutoselectedCamera(cameras);
            }
            else {
                return await this.initializeCameraWithSettings(this.selectedCamera, this.selectedCameraSettings);
            }
        }
        finally {
            this.cameraSetupPromise = undefined;
        }
    }
    getInitialCameraResolutionConstraint() {
        let cameraResolutionConstraint;
        switch (this.activeCameraSettings?.resolutionPreference) {
            case CameraSettings.ResolutionPreference.ULTRA_HD:
                cameraResolutionConstraint = CameraResolutionConstraint.ULTRA_HD;
                break;
            case CameraSettings.ResolutionPreference.FULL_HD:
                cameraResolutionConstraint = CameraResolutionConstraint.FULL_HD;
                break;
            case CameraSettings.ResolutionPreference.HD:
            default:
                cameraResolutionConstraint = CameraResolutionConstraint.HD;
                break;
        }
        return cameraResolutionConstraint;
    }
    async accessAutoselectedCamera(cameras) {
        cameras = CameraAccess.sortCamerasForCameraType(cameras, this.cameraType);
        let autoselectedCamera = cameras.shift();
        while (autoselectedCamera != null) {
            try {
                return await this.initializeCameraWithSettings(autoselectedCamera, this.selectedCameraSettings);
            }
            catch (error) {
                this.setSelectedCamera();
                if (cameras.length === 1) {
                    this.gui.setCameraSwitcherVisible(false);
                }
                if (cameras.length >= 1) {
                    console.warn("Couldn't access camera:", autoselectedCamera, error);
                    autoselectedCamera = cameras.shift();
                    continue;
                }
                throw error;
            }
        }
        throw new CustomError(CameraManager.noCameraErrorParameters);
    }
    async accessInitialCamera() {
        // Note that the initial camera's information (except deviceId) will be updated after a successful access
        const initialCamera = {
            deviceId: "",
            label: "",
            cameraType: this.cameraType,
        };
        try {
            await this.initializeCameraWithSettings(initialCamera, this.selectedCameraSettings);
        }
        catch {
            // Ignored
        }
        finally {
            this.setSelectedCamera();
        }
        return initialCamera;
    }
    updateActiveCameraCurrentResolution(camera) {
        if (this.gui.videoElement.videoWidth > 2 && this.gui.videoElement.videoHeight > 2) {
            camera.currentResolution = {
                width: this.gui.videoElement.videoWidth,
                height: this.gui.videoElement.videoHeight,
            };
        }
        // If it's the initial camera, do nothing: if and when the camera is later confirmed to be the
        // correct (main with wanted type or only) one this method will be called again with the right camera object
        if (camera.deviceId !== "") {
            this.activeCamera = camera;
            this.gui.setMirrorImageEnabled(this.gui.isMirrorImageEnabled(), false);
        }
    }
    postStreamInitialization() {
        window.clearTimeout(this.getCapabilitiesTimeout);
        this.getCapabilitiesTimeout = window.setTimeout(() => {
            this.storeStreamCapabilities();
            this.setupAutofocus();
            if (this.torchToggleEnabled && this.mediaStream != null && this.mediaTrackCapabilities?.torch === true) {
                this.gui.setTorchTogglerVisible(true);
            }
        }, CameraManager.getCapabilitiesTimeoutMs);
    }
    videoResizeHandle() {
        if (this.activeCamera != null) {
            this.updateActiveCameraCurrentResolution(this.activeCamera);
        }
    }
    async videoTrackEndedRecovery() {
        try {
            console.debug('Detected video track "ended" event, try to reinitialize camera');
            await this.reinitializeCamera();
        }
        catch {
            // Ignored
        }
    }
    async videoTrackMuteRecovery() {
        try {
            console.debug('Detected video track "unmute" event, try to reinitialize camera');
            await this.reinitializeCamera();
        }
        catch {
            // Ignored
        }
    }
    async triggerManualFocusForContinuous() {
        this.manualToAutofocusResumeTimeout = window.setTimeout(async () => {
            await this.triggerFocusMode(MeteringMode.CONTINUOUS);
        }, CameraManager.manualToAutofocusResumeTimeoutMs);
        await this.triggerFocusMode(MeteringMode.CONTINUOUS);
        this.manualFocusWaitTimeout = window.setTimeout(async () => {
            await this.triggerFocusMode(MeteringMode.MANUAL);
        }, CameraManager.manualFocusWaitTimeoutMs);
    }
    async triggerManualFocusForSingleShot() {
        window.clearInterval(this.autofocusInterval);
        this.manualToAutofocusResumeTimeout = window.setTimeout(() => {
            this.autofocusInterval = window.setInterval(this.triggerAutoFocus.bind(this), CameraManager.autofocusIntervalMs);
        }, CameraManager.manualToAutofocusResumeTimeoutMs);
        try {
            await this.triggerFocusMode(MeteringMode.SINGLE_SHOT);
        }
        catch {
            // istanbul ignore next
        }
    }
    async triggerManualFocus(event) {
        if (event != null) {
            event.preventDefault();
            if (event.type === "touchend" && event.touches.length !== 0) {
                return;
            }
            // Check if we were using pinch-to-zoom
            if (this.pinchToZoomDistance != null) {
                this.pinchToZoomDistance = undefined;
                return;
            }
        }
        window.clearTimeout(this.manualFocusWaitTimeout);
        window.clearTimeout(this.manualToAutofocusResumeTimeout);
        if (this.mediaStream != null && this.mediaTrackCapabilities != null) {
            const focusModeCapability = this.mediaTrackCapabilities.focusMode;
            if (focusModeCapability instanceof Array && focusModeCapability.includes(MeteringMode.SINGLE_SHOT)) {
                if (focusModeCapability.includes(MeteringMode.CONTINUOUS) &&
                    focusModeCapability.includes(MeteringMode.MANUAL)) {
                    await this.triggerManualFocusForContinuous();
                }
                else if (!focusModeCapability.includes(MeteringMode.CONTINUOUS)) {
                    await this.triggerManualFocusForSingleShot();
                }
            }
        }
    }
    triggerZoomStart(event) {
        if (event?.touches.length !== 2) {
            return;
        }
        event.preventDefault();
        this.pinchToZoomDistance = Math.hypot((event.touches[1].screenX - event.touches[0].screenX) / screen.width, (event.touches[1].screenY - event.touches[0].screenY) / screen.height);
        if (this.mediaStream != null && this.mediaTrackCapabilities?.zoom != null) {
            const videoTracks = this.mediaStream.getVideoTracks();
            // istanbul ignore else
            if (videoTracks.length !== 0 && typeof videoTracks[0].getConstraints === "function") {
                this.pinchToZoomInitialZoom = this.mediaTrackCapabilities.zoom.min;
                const currentConstraints = videoTracks[0].getConstraints();
                if (currentConstraints.advanced != null) {
                    const currentZoomConstraint = currentConstraints.advanced.find((constraint) => {
                        return "zoom" in constraint;
                    });
                    if (currentZoomConstraint?.zoom != null) {
                        this.pinchToZoomInitialZoom = currentZoomConstraint.zoom;
                    }
                }
            }
        }
    }
    async triggerZoomMove(event) {
        if (this.pinchToZoomDistance == null || event?.touches.length !== 2) {
            return;
        }
        event.preventDefault();
        await this.setZoom((Math.hypot((event.touches[1].screenX - event.touches[0].screenX) / screen.width, (event.touches[1].screenY - event.touches[0].screenY) / screen.height) -
            this.pinchToZoomDistance) *
            2, this.pinchToZoomInitialZoom);
    }
    storeStreamCapabilities() {
        // istanbul ignore else
        if (this.mediaStream != null) {
            const videoTracks = this.mediaStream.getVideoTracks();
            // istanbul ignore else
            if (videoTracks.length !== 0 && typeof videoTracks[0].getCapabilities === "function") {
                this.mediaTrackCapabilities = videoTracks[0].getCapabilities();
            }
        }
        if (this.activeCamera != null) {
            this.scanner.reportCameraProperties(this.activeCamera.cameraType, this.mediaTrackCapabilities?.focusMode == null || // assume the camera supports autofocus by default
                this.mediaTrackCapabilities.focusMode.includes(MeteringMode.CONTINUOUS));
        }
    }
    setupAutofocus() {
        window.clearTimeout(this.manualFocusWaitTimeout);
        window.clearTimeout(this.manualToAutofocusResumeTimeout);
        // istanbul ignore else
        if (this.mediaStream != null && this.mediaTrackCapabilities != null) {
            const focusModeCapability = this.mediaTrackCapabilities.focusMode;
            if (focusModeCapability instanceof Array &&
                !focusModeCapability.includes(MeteringMode.CONTINUOUS) &&
                focusModeCapability.includes(MeteringMode.SINGLE_SHOT)) {
                window.clearInterval(this.autofocusInterval);
                this.autofocusInterval = window.setInterval(this.triggerAutoFocus.bind(this), CameraManager.autofocusIntervalMs);
            }
        }
    }
    async triggerAutoFocus() {
        await this.triggerFocusMode(MeteringMode.SINGLE_SHOT);
    }
    async triggerFocusMode(focusMode) {
        // istanbul ignore else
        if (this.mediaStream != null) {
            const videoTracks = this.mediaStream.getVideoTracks();
            if (videoTracks.length !== 0 && typeof videoTracks[0].applyConstraints === "function") {
                try {
                    await videoTracks[0].applyConstraints({ advanced: [{ focusMode }] });
                }
                catch {
                    // Ignored
                }
            }
        }
    }
    enableTapToFocusListeners() {
        ["touchend", "mousedown"].forEach((eventName) => {
            this.gui.videoElement.addEventListener(eventName, this.triggerManualFocusListener);
        });
    }
    enablePinchToZoomListeners() {
        this.gui.videoElement.addEventListener("touchstart", this.triggerZoomStartListener);
        this.gui.videoElement.addEventListener("touchmove", this.triggerZoomMoveListener);
    }
    disableTapToFocusListeners() {
        ["touchend", "mousedown"].forEach((eventName) => {
            this.gui.videoElement.removeEventListener(eventName, this.triggerManualFocusListener);
        });
    }
    disablePinchToZoomListeners() {
        this.gui.videoElement.removeEventListener("touchstart", this.triggerZoomStartListener);
        this.gui.videoElement.removeEventListener("touchmove", this.triggerZoomMoveListener);
    }
    async initializeCameraAndCheckUpdatedSettings(camera) {
        try {
            await this.initializeCamera(camera);
            // Check if due to asynchronous behaviour camera settings were changed while camera was initialized
            if (this.selectedCameraSettings !== this.activeCameraSettings &&
                (this.selectedCameraSettings == null ||
                    this.activeCameraSettings == null ||
                    Object.keys(this.selectedCameraSettings).some((cameraSettingsProperty) => {
                        return (this.selectedCameraSettings[cameraSettingsProperty] !==
                            this.activeCameraSettings[cameraSettingsProperty]);
                    }))) {
                this.activeCameraSettings = this.selectedCameraSettings;
                return await this.initializeCameraAndCheckUpdatedSettings(camera);
            }
        }
        finally {
            this.cameraInitializationPromise = undefined;
        }
    }
    async handleCameraInitializationError(camera, cameraResolutionConstraint, error) {
        if (error.name !== "OverconstrainedError") {
            // Camera is not accessible at all
            console.debug("Camera video stream access failure (unrecoverable error)", camera, error);
            throw error;
        }
        if (error.name === "OverconstrainedError" && cameraResolutionConstraint === CameraResolutionConstraint.NONE) {
            // Camera device has changed deviceId
            // We can't rely on checking whether the constraint error property in the browsers reporting it is equal to
            // "deviceId" as it is used even when the error is due to a too high resolution being requested.
            // Whenever we get an OverconstrainedError we keep trying until we are using no constraints except for deviceId
            // (cameraResolutionConstraint is NONE), if an error still happens we know said device doesn't exist anymore
            // (the device has changed deviceId).
            // If it's the initial camera, do nothing
            if (camera.deviceId === "") {
                console.debug("Camera video stream access failure (no camera with such type error)", camera, error);
                throw error;
            }
            console.debug("Detected non-existent deviceId error, attempt to find and reaccess updated camera", camera, error);
            const currentCameraDeviceId = camera.deviceId;
            // Refresh camera deviceId information
            await CameraAccess.getCameras(true);
            if (currentCameraDeviceId === camera.deviceId) {
                console.debug("Camera video stream access failure (updated camera not found after non-existent deviceId error)", camera, error);
                CameraAccess.markCameraAsInaccessible(camera);
                throw error;
            }
            else {
                console.debug("Updated camera found (recovered from non-existent deviceId error), attempt to access it", camera);
                return this.initializeCamera(camera);
            }
        }
        return this.initializeCamera(camera, cameraResolutionConstraint + 1);
    }
    async initializeCamera(camera, cameraResolutionConstraint) {
        if (camera == null) {
            throw new CustomError(CameraManager.noCameraErrorParameters);
        }
        this.stopStream();
        this.torchEnabled = false;
        this.gui.setTorchTogglerVisible(false);
        cameraResolutionConstraint ??= this.getInitialCameraResolutionConstraint();
        try {
            const stream = await CameraAccess.accessCameraStream(cameraResolutionConstraint, camera);
            // Detect weird browser behaviour that on unsupported resolution returns a 2x2 video instead
            if (typeof stream.getTracks()[0].getSettings === "function") {
                const mediaTrackSettings = stream.getTracks()[0].getSettings();
                if (mediaTrackSettings.width != null &&
                    mediaTrackSettings.height != null &&
                    (mediaTrackSettings.width === 2 || mediaTrackSettings.height === 2)) {
                    console.debug("Camera video stream access failure (invalid video metadata):", camera);
                    if (cameraResolutionConstraint === CameraResolutionConstraint.NONE) {
                        throw new CustomError(CameraManager.notReadableErrorParameters);
                    }
                    else {
                        return this.initializeCamera(camera, cameraResolutionConstraint + 1);
                    }
                }
            }
            this.mediaStream = stream;
            this.mediaStream.getVideoTracks().forEach((track) => {
                // Handle unexpected stream end events
                track.addEventListener("ended", this.videoTrackEndedListener);
                if (BrowserHelper.userAgentInfo.getBrowser().name === "Safari") {
                    // Safari only allows a single page to have the camera active at any time, if the track gets muted we need
                    // to reinitialize the camera to access it again (this is done automatically only once the page is visible)
                    // as soon as possible, other browsers use mute/unmute on page visibility changes, but not Safari.
                    // This will add the listeners only once in case of multiple calls: identical listeners are ignored
                    track.addEventListener("mute", this.videoTrackMuteListener);
                }
            });
            try {
                await this.setupCameraStreamVideo(camera, stream);
            }
            catch (error) {
                if (cameraResolutionConstraint === CameraResolutionConstraint.NONE) {
                    throw error;
                }
                else {
                    return this.initializeCamera(camera, cameraResolutionConstraint + 1);
                }
            }
        }
        catch (error) {
            return this.handleCameraInitializationError(camera, cameraResolutionConstraint, error);
        }
    }
    async checkCameraAccess(camera) {
        window.clearTimeout(this.cameraAccessTimeout);
        return new Promise((_, reject) => {
            this.cameraAccessTimeout = window.setTimeout(() => {
                console.debug("Camera video stream access failure (video data load timeout):", camera);
                this.stopStream();
                reject(new CustomError(CameraManager.notReadableErrorParameters));
            }, CameraManager.cameraAccessTimeoutMs);
        });
    }
    async checkVideoMetadata(camera) {
        return new Promise((resolve, reject) => {
            this.gui.videoElement.onloadeddata = () => {
                this.gui.videoElement.onloadeddata = null;
                window.clearTimeout(this.cameraAccessTimeout);
                // Detect weird browser behaviour that on unsupported resolution returns a 2x2 video instead
                // Also detect failed camera access with no error but also no video stream provided
                if (this.gui.videoElement.videoWidth > 2 &&
                    this.gui.videoElement.videoHeight > 2 &&
                    this.gui.videoElement.currentTime > 0) {
                    this.updateActiveCameraCurrentResolution(camera);
                    console.debug("Camera video stream access success:", camera);
                    return resolve();
                }
                const videoMetadataCheckStartTime = performance.now();
                window.clearInterval(this.videoMetadataCheckInterval);
                this.videoMetadataCheckInterval = window.setInterval(() => {
                    // Detect weird browser behaviour that on unsupported resolution returns a 2x2 video instead
                    // Also detect failed camera access with no error but also no video stream provided
                    if (this.gui.videoElement.videoWidth <= 2 ||
                        this.gui.videoElement.videoHeight <= 2 ||
                        this.gui.videoElement.currentTime === 0) {
                        if (performance.now() - videoMetadataCheckStartTime > CameraManager.videoMetadataCheckTimeoutMs) {
                            console.debug("Camera video stream access failure (valid video metadata timeout):", camera);
                            window.clearInterval(this.videoMetadataCheckInterval);
                            this.stopStream();
                            return reject(new CustomError(CameraManager.notReadableErrorParameters));
                        }
                        return;
                    }
                    window.clearInterval(this.videoMetadataCheckInterval);
                    this.updateActiveCameraCurrentResolution(camera);
                    console.debug("Camera video stream access success:", camera);
                    resolve();
                }, CameraManager.videoMetadataCheckIntervalMs);
            };
        });
    }
    setupCameraStreamVideo(camera, stream) {
        // These will add the listeners only once in the case of multiple calls, identical listeners are ignored
        this.gui.videoElement.addEventListener("loadedmetadata", this.postStreamInitializationListener);
        this.gui.videoElement.addEventListener("resize", this.videoResizeListener);
        if (this.tapToFocusEnabled) {
            this.enableTapToFocusListeners();
        }
        if (this.pinchToZoomEnabled) {
            this.enablePinchToZoomListeners();
        }
        const cameraStreamVideoCheck = Promise.race([
            this.checkCameraAccess(camera),
            this.checkVideoMetadata(camera),
        ]);
        this.gui.videoElement.srcObject = stream;
        this.gui.videoElement.load();
        this.gui.playVideo();
        // Report camera properties already now in order to have type information before autofocus information is available.
        // Even if later the initialization could fail nothing bad results from this.
        this.scanner.reportCameraProperties(camera.cameraType);
        return cameraStreamVideoCheck;
    }
}
CameraManager.cameraAccessTimeoutMs = 4000;
CameraManager.videoMetadataCheckTimeoutMs = 4000;
CameraManager.videoMetadataCheckIntervalMs = 50;
CameraManager.getCapabilitiesTimeoutMs = 500;
CameraManager.autofocusIntervalMs = 1500;
CameraManager.manualToAutofocusResumeTimeoutMs = 5000;
CameraManager.manualFocusWaitTimeoutMs = 400;
CameraManager.noCameraErrorParameters = {
    name: "NoCameraAvailableError",
    message: "No camera available",
};
CameraManager.notReadableErrorParameters = {
    name: "NotReadableError",
    message: "Could not initialize camera correctly",
};
//# sourceMappingURL=cameraManager.js.map