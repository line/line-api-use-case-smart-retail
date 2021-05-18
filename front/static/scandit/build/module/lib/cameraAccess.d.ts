import { CameraResolutionConstraint } from "./barcodePicker/cameraManager";
import { Camera } from "./camera";
/**
 * A helper object to interact with cameras.
 */
export declare namespace CameraAccess {
    /**
     * @hidden
     *
     * Overrides for main camera for a given camera type on a desktop/laptop device, set when accessing an initial camera.
     */
    const mainCameraForTypeOverridesOnDesktop: Map<Camera.Type, Camera>;
    /**
     * @hidden
     *
     * To be accessed directly only for tests.
     *
     * The mapping from deviceIds to camera objects.
     */
    const deviceIdToCameraObjects: Map<string, Camera>;
    /**
     * @hidden
     *
     * To be accessed directly only for tests.
     *
     * The list of inaccessible deviceIds.
     */
    const inaccessibleDeviceIds: Set<string>;
    /**
     * @hidden
     *
     * Get the main camera for the given camera type.
     *
     * @param cameras The array of available [[Camera]] objects.
     * @param cameraType The wanted camera type.
     * @returns The main camera matching the wanted camera type.
     */
    function getMainCameraForType(cameras: Camera[], cameraType: Camera.Type): Camera | undefined;
    /**
     * @hidden
     *
     * Sort the given cameras in order of priority of access based on the given camera type.
     *
     * @param cameras The array of available [[Camera]] objects.
     * @param cameraType The preferred camera type.
     * @returns The sorted cameras.
     */
    function sortCamerasForCameraType(cameras: Camera[], cameraType: Camera.Type): Camera[];
    /**
     * @hidden
     *
     * Adjusts the camera's information based on the given currently active video stream.
     *
     * @param mediaStream The currently active `MediaStream` object.
     * @param camera The currently active [[Camera]] object associated with the video stream.
     */
    function adjustCameraFromMediaStream(mediaStream: MediaStream, camera: Camera): void;
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
    function getCameras(refreshDevices?: boolean): Promise<Camera[]>;
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
    function accessCameraStream(cameraResolutionConstraint: CameraResolutionConstraint, camera: Camera): Promise<MediaStream>;
    /**
     * @hidden
     *
     * Mark a camera to be inaccessible and thus excluded from the camera list returned by [[getCameras]].
     *
     * @param camera The camera to mark to be inaccessible.
     */
    function markCameraAsInaccessible(camera: Camera): void;
}
