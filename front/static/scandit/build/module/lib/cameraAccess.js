import { CameraResolutionConstraint } from "./barcodePicker/cameraManager";
import { BrowserCompatibility } from "./browserCompatibility";
import { BrowserHelper } from "./browserHelper";
import { Camera } from "./camera";
import { CustomError } from "./customError";
import { UnsupportedBrowserError } from "./unsupportedBrowserError";
/**
 * A helper object to interact with cameras.
 */
export var CameraAccess;
(function (CameraAccess) {
    /**
     * @hidden
     *
     * Standard error names mapping.
     */
    const standardErrorNamesMapping = new Map([
        ["DeviceCaptureError", "AbortError"],
        ["NotSupportedError", "AbortError"],
        ["ScreenCaptureError", "AbortError"],
        ["TabCaptureError", "AbortError"],
        ["TypeError", "AbortError"],
        ["InvalidStateError", "NotAllowedError"],
        ["MediaDeviceFailedDueToShutdown", "NotAllowedError"],
        ["MediaDeviceKillSwitchOn", "NotAllowedError"],
        ["PermissionDeniedError", "NotAllowedError"],
        ["PermissionDismissedError", "NotAllowedError"],
        ["DevicesNotFoundError", "NotFoundError"],
        ["SourceUnavailableError", "NotReadableError"],
        ["TrackStartError", "NotReadableError"],
        ["ConstraintNotSatisfiedError", "OverconstrainedError"],
    ]);
    /**
     * @hidden
     *
     * Handle localized camera labels. Supported languages:
     * English, German, French, Spanish (spain), Portuguese (brasil), Portuguese (portugal), Italian,
     * Chinese (simplified), Chinese (traditional), Japanese, Russian, Turkish, Dutch, Arabic, Thai, Swedish,
     * Danish, Vietnamese, Norwegian, Polish, Finnish, Indonesian, Hebrew, Greek, Romanian, Hungarian, Czech,
     * Catalan, Slovak, Ukraininan, Croatian, Malay, Hindi.
     */
    const backCameraKeywords = [
        "rear",
        "back",
        "rück",
        "arrière",
        "trasera",
        "trás",
        "traseira",
        "posteriore",
        "后面",
        "後面",
        "背面",
        "后置",
        "後置",
        "背置",
        "задней",
        "الخلفية",
        "후",
        "arka",
        "achterzijde",
        "หลัง",
        "baksidan",
        "bagside",
        "sau",
        "bak",
        "tylny",
        "takakamera",
        "belakang",
        "אחורית",
        "πίσω",
        "spate",
        "hátsó",
        "zadní",
        "darrere",
        "zadná",
        "задня",
        "stražnja",
        "belakang",
        "बैक",
    ];
    /**
     * @hidden
     *
     * The (cached) list of available video devices, updated when [[getCameras]] is called for the first time and after
     * subsequent calls with the *refreshDevices* parameter enabled. The contained devices' order never changes, howver
     * their deviceIds could change when they are retrieved again after a camera access and stop in some situations.
     */
    let availableVideoDevices;
    /**
     * @hidden
     *
     * Whether the currently cached available devices are out of date because of a `devicechange` event.
     */
    let outdatedDevices = false;
    /**
     * @hidden
     *
     * Overrides for main camera for a given camera type on a desktop/laptop device, set when accessing an initial camera.
     */
    CameraAccess.mainCameraForTypeOverridesOnDesktop = new Map();
    /**
     * @hidden
     *
     * To be accessed directly only for tests.
     *
     * The mapping from deviceIds to camera objects.
     */
    CameraAccess.deviceIdToCameraObjects = new Map();
    /**
     * @hidden
     *
     * To be accessed directly only for tests.
     *
     * The list of inaccessible deviceIds.
     */
    CameraAccess.inaccessibleDeviceIds = new Set();
    /**
     * @hidden
     *
     * Listen to `devicechange` events.
     */
    function deviceChangeListener() {
        outdatedDevices = true;
    }
    /**
     * @hidden
     *
     * @param label The camera label.
     * @returns Whether the label mentions the camera being a back-facing one.
     */
    function isBackCameraLabel(label) {
        const lowercaseLabel = label.toLowerCase();
        return backCameraKeywords.some((keyword) => {
            return lowercaseLabel.includes(keyword);
        });
    }
    /**
     * @hidden
     *
     * Map non-standard error names to standard ones.
     *
     * @param error The error object.
     */
    function mapNonStandardErrorName(error) {
        let name;
        if (error.message === "Invalid constraint") {
            name = "OverconstrainedError";
        }
        else {
            name = standardErrorNamesMapping.get(error.name) ?? error.name;
        }
        Object.defineProperty(error, "name", {
            value: name,
        });
    }
    /**
     * @hidden
     *
     * Get the main camera for the given camera type.
     *
     * @param cameras The array of available [[Camera]] objects.
     * @param cameraType The wanted camera type.
     * @returns The main camera matching the wanted camera type.
     */
    function getMainCameraForType(cameras, cameraType) {
        let mainCameraForType;
        if (BrowserHelper.isDesktopDevice()) {
            // When the device is a desktop/laptop, the overridden camera for the given type or, if not present, the first
            // camera of the given type is the main one.
            if (CameraAccess.mainCameraForTypeOverridesOnDesktop.has(cameraType)) {
                mainCameraForType = CameraAccess.mainCameraForTypeOverridesOnDesktop.get(cameraType);
            }
            else {
                // Note that if the device is a desktop/laptop, with no labels all cameras are assumed to be front ones,
                // so this will return the first camera as the main front one and none for the back one.
                mainCameraForType = cameras.filter((camera) => {
                    return camera.cameraType === cameraType;
                })[0];
            }
        }
        else if (cameras.every((camera) => {
            return camera.label === "";
        })) {
            // When no camera label is available cameras are already in front to back order, assume main front camera is the
            // first one and main back camera is the last one.
            mainCameraForType = cameras[cameraType === Camera.Type.FRONT ? 0 : cameras.length - 1];
        }
        else {
            mainCameraForType = cameras
                .filter((camera) => {
                return camera.cameraType === cameraType;
            })
                .sort((camera1, camera2) => {
                return camera1.label.localeCompare(camera2.label);
            })[0];
        }
        return mainCameraForType;
    }
    CameraAccess.getMainCameraForType = getMainCameraForType;
    /**
     * @hidden
     *
     * Sort the given cameras in order of priority of access based on the given camera type.
     *
     * @param cameras The array of available [[Camera]] objects.
     * @param cameraType The preferred camera type.
     * @returns The sorted cameras.
     */
    function sortCamerasForCameraType(cameras, cameraType) {
        function prioritizeMainCameraOverride(prioritizedCameras, currentCameraType) {
            const mainCameraOverride = CameraAccess.mainCameraForTypeOverridesOnDesktop.get(currentCameraType);
            if (mainCameraOverride != null && prioritizedCameras.includes(mainCameraOverride)) {
                prioritizedCameras = prioritizedCameras.filter((camera) => {
                    return camera !== mainCameraOverride;
                });
                prioritizedCameras.unshift(mainCameraOverride);
            }
            return prioritizedCameras;
        }
        let frontCameras = cameras.filter((camera) => {
            return camera.cameraType === Camera.Type.FRONT;
        });
        let backCameras = cameras.filter((camera) => {
            return camera.cameraType === Camera.Type.BACK;
        });
        if (BrowserHelper.isDesktopDevice()) {
            // When the device is a desktop/laptop, the cameras for each type are already ordered, we move the overrides
            // first if present and change front / back group order if needed.
            frontCameras = prioritizeMainCameraOverride(frontCameras, Camera.Type.FRONT);
            backCameras = prioritizeMainCameraOverride(backCameras, Camera.Type.BACK);
        }
        else if (cameras.every((camera) => {
            return camera.label === "";
        })) {
            // When no camera label is available cameras are already in front to back order, we assume front cameras are
            // ordered and back cameras are in reversed order (try to access last first), and we change front / back group
            // order if needed.
            backCameras.reverse();
        }
        else {
            frontCameras.sort((camera1, camera2) => {
                return camera1.label.localeCompare(camera2.label);
            });
            backCameras.sort((camera1, camera2) => {
                return camera1.label.localeCompare(camera2.label);
            });
        }
        return cameraType === Camera.Type.FRONT ? [...frontCameras, ...backCameras] : [...backCameras, ...frontCameras];
    }
    CameraAccess.sortCamerasForCameraType = sortCamerasForCameraType;
    /**
     * @hidden
     *
     * Adjusts the camera's information based on the given currently active video stream.
     *
     * @param mediaStream The currently active `MediaStream` object.
     * @param camera The currently active [[Camera]] object associated with the video stream.
     */
    function adjustCameraFromMediaStream(mediaStream, camera) {
        const videoTracks = mediaStream.getVideoTracks();
        if (videoTracks.length !== 0) {
            const mediaStreamTrack = videoTracks[0];
            let mediaTrackSettings;
            if (typeof mediaStreamTrack.getSettings === "function") {
                mediaTrackSettings = mediaStreamTrack.getSettings();
                if (mediaTrackSettings?.facingMode != null && mediaTrackSettings.facingMode.length > 0) {
                    camera.cameraType =
                        mediaTrackSettings.facingMode === "environment" ? Camera.Type.BACK : Camera.Type.FRONT;
                }
            }
            if (mediaStreamTrack.label != null && mediaStreamTrack.label.length > 0) {
                camera.label = mediaStreamTrack.label;
            }
        }
    }
    CameraAccess.adjustCameraFromMediaStream = adjustCameraFromMediaStream;
    /**
     * @hidden
     *
     * @param devices The list of available devices.
     * @returns The extracted list of accessible camera objects initialized from the given devices.
     */
    function extractAccessibleCamerasFromDevices(devices) {
        function createCamera(videoDevice, index, videoDevices) {
            if (CameraAccess.deviceIdToCameraObjects.has(videoDevice.deviceId)) {
                return CameraAccess.deviceIdToCameraObjects.get(videoDevice.deviceId);
            }
            const label = videoDevice.label ?? "";
            let cameraType;
            if (!BrowserHelper.isDesktopDevice() &&
                videoDevices.every((device) => {
                    return device.label === "" && !CameraAccess.deviceIdToCameraObjects.has(device.deviceId);
                })) {
                // When the device is not a desktop/laptop and no camera label is available, assume the camera is a front one
                // if it's the only one or comes in the first half of the list of cameras (if an odd number of cameras is
                // available, it's more likely to have more back than front ones).
                cameraType =
                    videoDevices.length === 1 || index + 1 <= Math.floor(videoDevices.length / 2)
                        ? Camera.Type.FRONT
                        : Camera.Type.BACK;
            }
            else {
                // Note that if the device is a desktop/laptop, unless the label specifies a back camera, a front one is assumed
                cameraType = isBackCameraLabel(label) ? Camera.Type.BACK : Camera.Type.FRONT;
            }
            return {
                deviceId: videoDevice.deviceId,
                label,
                cameraType,
            };
        }
        const cameras = devices
            .map(createCamera)
            .map((camera) => {
            // If it's the initial camera, do nothing
            if (camera.deviceId !== "") {
                CameraAccess.deviceIdToCameraObjects.set(camera.deviceId, camera);
            }
            return camera;
        })
            .filter((camera) => {
            // Ignore infrared cameras as they often fail to be accessed and are not useful in any case
            return !/\b(?:ir|infrared)\b/i.test(camera.label);
        })
            .filter((camera) => {
            return !CameraAccess.inaccessibleDeviceIds.has(camera.deviceId);
        });
        if (!BrowserHelper.isDesktopDevice() &&
            cameras.length > 1 &&
            !cameras.some((camera) => {
                return camera.cameraType === Camera.Type.BACK;
            })) {
            // When the device is not a desktop/laptop check if cameras are labeled with resolution information, if that's the
            // case, take the higher - resolution one, otherwise pick the last camera (it's not true that the primary camera
            // is first in most scenarios) and mark it as the back one.
            let backCameraIndex = cameras.length - 1;
            const cameraResolutions = cameras.map((camera) => {
                const match = camera.label.match(/\b([0-9]+)MP?\b/i);
                if (match != null) {
                    return parseInt(match[1], 10);
                }
                return NaN;
            });
            if (!cameraResolutions.some((cameraResolution) => {
                return isNaN(cameraResolution);
            })) {
                backCameraIndex = cameraResolutions.lastIndexOf(Math.max(...cameraResolutions));
            }
            cameras[backCameraIndex].cameraType = Camera.Type.BACK;
        }
        return cameras;
    }
    /**
     * @hidden
     *
     * @returns The stream, if necessary, accessed to provide access to complete device information
     */
    async function getStreamForDeviceAccessPermission() {
        availableVideoDevices = await enumerateVideoDevices();
        // If there are video devices and all of them have no label it means we need to access a camera before we can get
        // the needed information
        if (availableVideoDevices.length > 0 &&
            availableVideoDevices.every((device) => {
                return device.label === "" && !CameraAccess.deviceIdToCameraObjects.has(device.deviceId);
            })) {
            try {
                return await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
            }
            catch {
                // Ignored
            }
        }
    }
    /**
     * @hidden
     *
     * Checks and adjust cameras' deviceId information and related information if a change is detected. We can rely on the
     * fact that devices are returned in the same order even when deviceId information changes.
     *
     * @param oldAvailableDevices The old list of available devices before deviceId information was refreshed.
     * @param newAvailableDevices The new list of available devices after deviceId information was refreshed.
     */
    function checkAndUpdateCameraDeviceIdInformation(oldAvailableDevices, newAvailableDevices) {
        if (newAvailableDevices.length > 0 &&
            oldAvailableDevices.length === newAvailableDevices.length &&
            !newAvailableDevices.every((device, index) => {
                return oldAvailableDevices[index].deviceId === device.deviceId;
            })) {
            const deviceIdChanges = {};
            oldAvailableDevices.forEach((device, index) => {
                const camera = CameraAccess.deviceIdToCameraObjects.get(device.deviceId);
                if (camera == null || camera.label !== (newAvailableDevices[index].label ?? "")) {
                    return;
                }
                const newDeviceId = newAvailableDevices[index].deviceId;
                deviceIdChanges[camera.deviceId] = newDeviceId;
                if (CameraAccess.inaccessibleDeviceIds.has(camera.deviceId)) {
                    CameraAccess.inaccessibleDeviceIds.add(newDeviceId);
                }
                camera.deviceId = newDeviceId;
                CameraAccess.deviceIdToCameraObjects.set(newDeviceId, camera);
            });
            console.debug("Detected updated camera deviceId information and updated it accordingly", deviceIdChanges);
        }
    }
    /**
     * Get a list of cameras (if any) available on the device, a camera access permission is requested to the user
     * the first time this method is called if needed.
     *
     * If the browser is incompatible the returned promise is rejected with a `UnsupportedBrowserError` error.
     *
     * When refreshing available devices, if updated deviceId information is detected, cameras' deviceId are updated
     * accordingly. This could happen after a camera access and stop in some situations.
     *
     * @param refreshDevices Force a call to refresh available video devices even when information is already available.
     * @returns A promise resolving to the array of available [[Camera]] objects (could be empty).
     */
    async function getCameras(refreshDevices = false) {
        const browserCompatibility = BrowserHelper.checkBrowserCompatibility();
        if (!browserCompatibility.fullSupport) {
            throw new UnsupportedBrowserError(browserCompatibility);
        }
        // This will add the listeners only once in case of multiple calls: identical listeners are ignored
        navigator.mediaDevices.addEventListener("devicechange", deviceChangeListener);
        if (availableVideoDevices == null || refreshDevices || outdatedDevices) {
            outdatedDevices = false;
            let stream;
            const oldAvailableDevices = availableVideoDevices ?? [];
            availableVideoDevices = [];
            try {
                stream = await getStreamForDeviceAccessPermission();
                if (stream != null) {
                    console.debug("Camera list (accessed stream for information permissions):", stream);
                    availableVideoDevices = await enumerateVideoDevices();
                }
                console.debug("Camera list (devices):", ...availableVideoDevices);
                checkAndUpdateCameraDeviceIdInformation(oldAvailableDevices, availableVideoDevices);
            }
            catch (error) {
                mapNonStandardErrorName(error);
                throw error;
            }
            finally {
                if (stream != null) {
                    stream.getVideoTracks().forEach((track) => {
                        track.stop();
                    });
                }
            }
        }
        const cameras = extractAccessibleCamerasFromDevices(availableVideoDevices);
        console.debug("Camera list (cameras): ", ...cameras);
        // Return a copy of the array to allow for array mutations in other functions
        return [...cameras];
    }
    CameraAccess.getCameras = getCameras;
    /**
     * @hidden
     *
     * Call `navigator.mediaDevices.getUserMedia` asynchronously in a `setTimeout` call.
     *
     * @param getUserMediaParams The parameters for the `navigator.mediaDevices.getUserMedia` call.
     * @returns A promise resolving when the camera is accessed.
     */
    function getUserMediaDelayed(getUserMediaParams) {
        console.debug("Attempt to access camera (parameters):", getUserMediaParams.video);
        return new Promise((resolve, reject) => {
            window.setTimeout(() => {
                (navigator.mediaDevices.getUserMedia(getUserMediaParams) ??
                    Promise.reject(new CustomError({ name: "AbortError" })))
                    .then(resolve)
                    .catch(reject);
            }, 0);
        });
    }
    /**
     * @hidden
     *
     * Get the *getUserMedia* *video* parameters to be used given a resolution fallback level and the browser used.
     *
     * @param cameraResolutionConstraint The resolution constraint.
     * @returns The resulting *getUserMedia* *video* parameters.
     */
    function getUserMediaVideoParams(cameraResolutionConstraint) {
        const userMediaVideoParams = {
            resizeMode: "none",
        };
        switch (cameraResolutionConstraint) {
            case CameraResolutionConstraint.ULTRA_HD:
                return {
                    ...userMediaVideoParams,
                    width: { min: 3200, ideal: 3840, max: 4096 },
                    height: { min: 1800, ideal: 2160, max: 2400 },
                };
            case CameraResolutionConstraint.FULL_HD:
                return {
                    ...userMediaVideoParams,
                    width: { min: 1400, ideal: 1920, max: 2160 },
                    height: { min: 900, ideal: 1080, max: 1440 },
                };
            case CameraResolutionConstraint.HD:
                return {
                    ...userMediaVideoParams,
                    width: { min: 960, ideal: 1280, max: 1440 },
                    height: { min: 480, ideal: 720, max: 960 },
                };
            case CameraResolutionConstraint.SD:
                return {
                    ...userMediaVideoParams,
                    width: { min: 640, ideal: 640, max: 800 },
                    height: { min: 480, ideal: 480, max: 600 },
                };
            case CameraResolutionConstraint.NONE:
            default:
                return {};
        }
    }
    /**
     * @hidden
     *
     * Try to access a given camera for video input at the given resolution level.
     *
     * If a camera is inaccessible because of errors, then it's added to the inaccessible device list. If the specific
     * error is of type `OverconstrainedError` however, this procedure is done later on via a separate external logic.
     * This is done to allow checking if the camera can still be accessed via an updated deviceId when deviceId
     * information changes, or if it should then be confirmed to be considered inaccessible.
     *
     * Depending on parameters, device features and user permissions for camera access, any of the following errors
     * could be the rejected result of the returned promise:
     * - `AbortError`
     * - `NotAllowedError`
     * - `NotFoundError`
     * - `NotReadableError`
     * - `SecurityError`
     * - `OverconstrainedError`
     *
     * @param cameraResolutionConstraint The resolution constraint.
     * @param camera The camera to try to access for video input.
     * @returns A promise resolving to the `MediaStream` object coming from the accessed camera.
     */
    async function accessCameraStream(cameraResolutionConstraint, camera) {
        console.debug("Attempt to access camera (camera):", camera);
        const getUserMediaParams = {
            audio: false,
            video: getUserMediaVideoParams(cameraResolutionConstraint),
        };
        // If it's the initial camera, use the given cameraType, otherwise use the given deviceId
        if (camera.deviceId === "") {
            getUserMediaParams.video.facingMode = {
                ideal: camera.cameraType === Camera.Type.BACK ? "environment" : "user",
            };
        }
        else {
            getUserMediaParams.video.deviceId = {
                exact: camera.deviceId,
            };
        }
        try {
            const mediaStream = await getUserMediaDelayed(getUserMediaParams);
            adjustCameraFromMediaStream(mediaStream, camera);
            return mediaStream;
        }
        catch (error) {
            mapNonStandardErrorName(error);
            if (error.name !== "OverconstrainedError") {
                markCameraAsInaccessible(camera);
            }
            throw error;
        }
    }
    CameraAccess.accessCameraStream = accessCameraStream;
    /**
     * @hidden
     *
     * Mark a camera to be inaccessible and thus excluded from the camera list returned by [[getCameras]].
     *
     * @param camera The camera to mark to be inaccessible.
     */
    function markCameraAsInaccessible(camera) {
        // If it's the initial camera, do nothing
        if (camera.deviceId !== "") {
            console.debug("Camera marked to be inaccessible:", camera);
            CameraAccess.inaccessibleDeviceIds.add(camera.deviceId);
        }
    }
    CameraAccess.markCameraAsInaccessible = markCameraAsInaccessible;
    /**
     * @hidden
     *
     * Get a list of available video devices in a cross-browser compatible way.
     *
     * @returns A promise resolving to the `MediaDeviceInfo` array of all available video devices.
     */
    async function enumerateVideoDevices() {
        let devices;
        if (typeof navigator.enumerateDevices === "function") {
            devices = await navigator.enumerateDevices();
        }
        else if (typeof navigator.mediaDevices === "object" &&
            typeof navigator.mediaDevices.enumerateDevices === "function") {
            devices = await navigator.mediaDevices.enumerateDevices();
        }
        else {
            try {
                if (window.MediaStreamTrack?.getSources == null) {
                    throw new Error();
                }
                devices = await new Promise((resolve) => {
                    window.MediaStreamTrack?.getSources?.(resolve);
                });
                devices = devices
                    .filter((device) => {
                    return device.kind.toLowerCase() === "video" || device.kind.toLowerCase() === "videoinput";
                })
                    .map((device) => {
                    return {
                        deviceId: device.deviceId ?? "",
                        groupId: device.groupId,
                        kind: "videoinput",
                        label: device.label,
                        toJSON: /* istanbul ignore next */ function () {
                            return this;
                        },
                    };
                });
            }
            catch {
                throw new UnsupportedBrowserError({
                    fullSupport: false,
                    scannerSupport: true,
                    missingFeatures: [BrowserCompatibility.Feature.MEDIA_DEVICES],
                });
            }
        }
        return devices.filter((device) => {
            return device.kind === "videoinput";
        });
    }
})(CameraAccess || (CameraAccess = {}));
//# sourceMappingURL=cameraAccess.js.map