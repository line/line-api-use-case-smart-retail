"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraSettings = void 0;
var CameraSettings;
(function (CameraSettings) {
    /**
     * Video frame resolution request.
     *
     * Not guaranteed to be precise: depending on device, browser and camera it could be different/lower than requested.
     *
     * Note that higher resolutions lead to slower processing times and higher memory requirements.
     */
    var ResolutionPreference;
    (function (ResolutionPreference) {
        /**
         * Resolution of around 3840 x 2160.
         */
        ResolutionPreference["ULTRA_HD"] = "ultra-hd";
        /**
         * Resolution of around 1920 x 1080.
         */
        ResolutionPreference["FULL_HD"] = "full-hd";
        /**
         * Resolution of around 1280 x 720.
         */
        ResolutionPreference["HD"] = "hd";
    })(ResolutionPreference = CameraSettings.ResolutionPreference || (CameraSettings.ResolutionPreference = {}));
})(CameraSettings = exports.CameraSettings || (exports.CameraSettings = {}));
//# sourceMappingURL=cameraSettings.js.map