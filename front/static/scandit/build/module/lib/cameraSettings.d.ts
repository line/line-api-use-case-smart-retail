/**
 * A configuration object to request custom capabilities when accessing a camera.
 */
export interface CameraSettings {
    /**
     * The preferred video frame resolution.
     *
     * Not guaranteed to be precise: depending on device, browser and camera it could be different/lower than requested.
     *
     * Note that higher resolutions lead to slower processing times and higher memory requirements.
     */
    readonly resolutionPreference: CameraSettings.ResolutionPreference;
}
export declare namespace CameraSettings {
    /**
     * Video frame resolution request.
     *
     * Not guaranteed to be precise: depending on device, browser and camera it could be different/lower than requested.
     *
     * Note that higher resolutions lead to slower processing times and higher memory requirements.
     */
    enum ResolutionPreference {
        /**
         * Resolution of around 3840 x 2160.
         */
        ULTRA_HD = "ultra-hd",
        /**
         * Resolution of around 1920 x 1080.
         */
        FULL_HD = "full-hd",
        /**
         * Resolution of around 1280 x 720.
         */
        HD = "hd"
    }
}
