import * as CSS from "csstype";
/**
 * A configuration object for Single Image Mode options for multiple platforms.
 */
export interface SingleImageModeSettings {
    /**
     * Settings to be applied when the device is a desktop/laptop.
     * On these devices the user will be requested to pick an image from the filesystem (see
     * [https://w3c.github.io/html-media-capture/](https://w3c.github.io/html-media-capture/).
     */
    desktop?: SingleImageModePlatformSettings;
    /**
     * Settings to be applied when the device is a smartphone/tablet.
     * On these devices the user will be requested to take a picture directly via the camera (see
     * [https://w3c.github.io/html-media-capture/](https://w3c.github.io/html-media-capture/).
     */
    mobile?: SingleImageModePlatformSettings;
}
/**
 * A configuration object for Single Image Mode options for a specific platform.
 *
 * The Single Image Mode screen is composed of information at the top and a button at the bottom.
 */
export interface SingleImageModePlatformSettings {
    /**
     * <div class="tsd-signature-symbol">Default =&nbsp;[[UsageStrategy.FALLBACK]]</div>
     *
     * Execution strategy (when to run).
     *
     * By default use only if the OS/browser doesn't support continuous camera video stream scanning.
     */
    usageStrategy?: SingleImageModeSettings.UsageStrategy;
    /**
     * <div class="tsd-signature-symbol">Default =&nbsp;&lt;HTMLElement&gt;</div>
     *
     * HTML element to override information contents.
     */
    informationElement?: HTMLElement;
    /**
     * <div class="tsd-signature-symbol">Default =&nbsp;&lt;SVGElement&gt;</div>
     *
     * HTML/SVG element to override button contents (SVG recommended).
     */
    buttonElement?: HTMLElement | SVGElement;
    /**
     * <div class="tsd-signature-symbol">Default =&nbsp;{ backgroundColor: "#333333" }</div>
     *
     * [CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference) to override
     * the surrounding container's [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style).
     */
    containerStyle?: CSS.Properties;
    /**
     * <div class="tsd-signature-symbol">Default =&nbsp;{ color: "#FFFFFF" }</div>
     *
     * [CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference) to override
     * the information text's [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style).
     */
    informationStyle?: CSS.Properties;
    /**
     * <div class="tsd-signature-symbol">Default =&nbsp;{ borderColor: "#FFFFFF", color: "#FFFFFF", fill: "#FFFFFF" }
     * </div>
     *
     * [CSS properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference) to override
     * the button's [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style).
     *
     * Note: *borderColor* is used for the border, *color* for the flash animation, *fill* for the SVG icon.
     */
    buttonStyle?: CSS.Properties;
}
export declare namespace SingleImageModeSettings {
    /**
     * Single Image Mode usage strategy.
     */
    enum UsageStrategy {
        /**
         * Never use Single Image Mode (an error is thrown on [[BarcodePicker]] creation if the OS/browser doesn't support
         * continuous camera video stream scanning).
         */
        NEVER = "never",
        /**
         * Use Single Image Mode as fallback: only if the OS/browser doesn't support continuous camera video stream
         * scanning.
         */
        FALLBACK = "fallback",
        /**
         * Force Single Image Mode over continuous camera video stream scanning in all situations.
         */
        ALWAYS = "always"
    }
    /**
     * @hidden
     */
    const defaultDesktop: SingleImageModePlatformSettings;
    /**
     * @hidden
     */
    const defaultMobile: SingleImageModePlatformSettings;
}
