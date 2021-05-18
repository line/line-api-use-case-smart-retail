/**
 * A camera for video input available to be used on the device.
 */
export interface Camera {
    /**
     * The unique identifier for the device, can change between page loads.
     */
    readonly deviceId: string;
    /**
     * The label describing the device.
     */
    readonly label: string;
    /**
     * The type (facing mode/direction) of camera: back (environment) or front (user).
     *
     * Not guaranteed to be correct: depending on device, browser and camera it could not correspond to the camera's real
     * type.
     */
    readonly cameraType: Camera.Type;
    /**
     * The current video resolution if and when the camera is in use, given as width and height in pixels.
     */
    currentResolution?: {
        width: number;
        height: number;
    };
}
export declare namespace Camera {
    /**
     * Camera type (facing mode/direction).
     *
     * Not guaranteed to be correct: depending on device, browser and camera it could not correspond to the camera's real
     * type.
     */
    enum Type {
        /**
         * Front (user) facing camera.
         */
        FRONT = "front",
        /**
         * Back (environment) facing camera.
         */
        BACK = "back"
    }
}
