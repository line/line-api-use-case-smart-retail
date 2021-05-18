"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
var Camera;
(function (Camera) {
    /**
     * Camera type (facing mode/direction).
     *
     * Not guaranteed to be correct: depending on device, browser and camera it could not correspond to the camera's real
     * type.
     */
    var Type;
    (function (Type) {
        /**
         * Front (user) facing camera.
         */
        Type["FRONT"] = "front";
        /**
         * Back (environment) facing camera.
         */
        Type["BACK"] = "back";
    })(Type = Camera.Type || (Camera.Type = {}));
})(Camera = exports.Camera || (exports.Camera = {}));
//# sourceMappingURL=camera.js.map