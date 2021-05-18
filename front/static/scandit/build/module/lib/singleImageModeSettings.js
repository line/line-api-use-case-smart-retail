import { cameraImage, folderImage } from "./assets/base64assets";
export var SingleImageModeSettings;
(function (SingleImageModeSettings) {
    /**
     * @hidden
     *
     * Create a default [[SingleImageModePlatformSettings]] object.
     *
     * @param text The text to display at the top.
     * @param base64image The image to display at the bottom as a button.
     * @returns The generated [[SingleImageModePlatformSettings]] object.
     */
    function getDefaultSingleImageModeSettings(text, base64image) {
        return {
            informationElement: document.createRange().createContextualFragment(text).firstElementChild,
            buttonElement: document.createRange().createContextualFragment(atob(base64image)).firstElementChild,
            containerStyle: { backgroundColor: "#333333" },
            informationStyle: { color: "#FFFFFF" },
            buttonStyle: { borderColor: "#FFFFFF", color: "#FFFFFF", fill: "#FFFFFF" },
        };
    }
    /**
     * Single Image Mode usage strategy.
     */
    let UsageStrategy;
    (function (UsageStrategy) {
        /**
         * Never use Single Image Mode (an error is thrown on [[BarcodePicker]] creation if the OS/browser doesn't support
         * continuous camera video stream scanning).
         */
        UsageStrategy["NEVER"] = "never";
        /**
         * Use Single Image Mode as fallback: only if the OS/browser doesn't support continuous camera video stream
         * scanning.
         */
        UsageStrategy["FALLBACK"] = "fallback";
        /**
         * Force Single Image Mode over continuous camera video stream scanning in all situations.
         */
        UsageStrategy["ALWAYS"] = "always";
    })(UsageStrategy = SingleImageModeSettings.UsageStrategy || (SingleImageModeSettings.UsageStrategy = {}));
    /**
     * @hidden
     */
    SingleImageModeSettings.defaultDesktop = getDefaultSingleImageModeSettings("<p>To scan:<br>1. Click on the folder icon<br>2. Select the picture to scan</p>", folderImage);
    /**
     * @hidden
     */
    SingleImageModeSettings.defaultMobile = getDefaultSingleImageModeSettings("<p>To scan:<br>1. Tap the camera icon<br>2. Take a picture of the code(s)</p>", cameraImage);
})(SingleImageModeSettings || (SingleImageModeSettings = {}));
//# sourceMappingURL=singleImageModeSettings.js.map