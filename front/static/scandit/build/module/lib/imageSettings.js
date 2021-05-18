export var ImageSettings;
(function (ImageSettings) {
    // Warning: the values of Format are important as the engine web worker relies on them without type checking.
    /**
     * Image bytes format/layout.
     */
    let Format;
    (function (Format) {
        /**
         * Single-channel 8-bit gray scale image.
         */
        Format[Format["GRAY_8U"] = 0] = "GRAY_8U";
        /**
         * RGB image with 8 bits per color channel.
         */
        Format[Format["RGB_8U"] = 1] = "RGB_8U";
        /**
         * RGBA image with 8 bits per color channel.
         */
        Format[Format["RGBA_8U"] = 2] = "RGBA_8U";
    })(Format = ImageSettings.Format || (ImageSettings.Format = {}));
})(ImageSettings || (ImageSettings = {}));
//# sourceMappingURL=imageSettings.js.map