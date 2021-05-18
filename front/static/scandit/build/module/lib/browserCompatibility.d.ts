/**
 * An object containing details about the support level of the used OS/browser combination regarding
 * the features needed by this library.
 */
export interface BrowserCompatibility {
    /**
     * Whether the full set of features required to have continuous camera video streaming are supported.
     */
    readonly fullSupport: boolean;
    /**
     * Whether the set of features required to use a [[Scanner]] to perform scans (Single Image Mode) are supported.
     */
    readonly scannerSupport: boolean;
    /**
     * The list of features that are missing.
     */
    readonly missingFeatures: BrowserCompatibility.Feature[];
}
export declare namespace BrowserCompatibility {
    /**
     * Browser feature.
     */
    enum Feature {
        /**
         * [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) -
         * [current support?](https://caniuse.com/#feat=blobbuilder)
         */
        BLOB = "blob",
        /**
         * [MediaDevices/getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) -
         * [current support?](https://caniuse.com/#feat=stream)
         */
        MEDIA_DEVICES = "mediaDevices",
        /**
         * [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) -
         * [current support?](https://caniuse.com/#feat=offscreencanvas)
         */
        OFFSCREEN_CANVAS = "offscreenCanvas",
        /**
         * [Http/Https protocol](https://wiki.developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Scheme_or_protocol)
         */
        HTTP_PROTOCOL = "httpProtocol",
        /**
         * [Secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)
         */
        SECURE_CONTEXT = "secureContext",
        /**
         * [URL/createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) -
         * [current support?](https://caniuse.com/#feat=bloburls)
         */
        URL_OBJECT = "urlObject",
        /**
         * [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) -
         * [current support?](https://caniuse.com/#feat=webworkers)
         */
        WEB_WORKERS = "webWorkers",
        /**
         * [WebAssembly](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/WebAssembly) -
         * [current support?](https://caniuse.com/#feat=wasm)
         */
        WEB_ASSEMBLY = "webAssembly",
        /**
         * WebAssembly without memory corruption (specific iOS version 11.2.2/11.2.5/11.2.6 bug)
         */
        WEB_ASSEMBLY_ERROR_FREE = "webAssemblyErrorFree",
        /**
         * [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) -
         * [current support?](https://caniuse.com/#feat=webgl)
         */
        WEBGL = "webgl"
    }
}
