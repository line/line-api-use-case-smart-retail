export var BrowserCompatibility;
(function (BrowserCompatibility) {
    /**
     * Browser feature.
     */
    let Feature;
    (function (Feature) {
        /**
         * [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob) -
         * [current support?](https://caniuse.com/#feat=blobbuilder)
         */
        Feature["BLOB"] = "blob";
        /**
         * [MediaDevices/getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) -
         * [current support?](https://caniuse.com/#feat=stream)
         */
        Feature["MEDIA_DEVICES"] = "mediaDevices";
        /**
         * [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) -
         * [current support?](https://caniuse.com/#feat=offscreencanvas)
         */
        Feature["OFFSCREEN_CANVAS"] = "offscreenCanvas";
        // tslint:disable: max-line-length
        /**
         * [Http/Https protocol](https://wiki.developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Scheme_or_protocol)
         */
        Feature["HTTP_PROTOCOL"] = "httpProtocol";
        /**
         * [Secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts)
         */
        Feature["SECURE_CONTEXT"] = "secureContext";
        /**
         * [URL/createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) -
         * [current support?](https://caniuse.com/#feat=bloburls)
         */
        Feature["URL_OBJECT"] = "urlObject";
        /**
         * [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) -
         * [current support?](https://caniuse.com/#feat=webworkers)
         */
        Feature["WEB_WORKERS"] = "webWorkers";
        /**
         * [WebAssembly](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/WebAssembly) -
         * [current support?](https://caniuse.com/#feat=wasm)
         */
        Feature["WEB_ASSEMBLY"] = "webAssembly";
        /**
         * WebAssembly without memory corruption (specific iOS version 11.2.2/11.2.5/11.2.6 bug)
         */
        Feature["WEB_ASSEMBLY_ERROR_FREE"] = "webAssemblyErrorFree";
        /**
         * [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) -
         * [current support?](https://caniuse.com/#feat=webgl)
         */
        Feature["WEBGL"] = "webgl";
    })(Feature = BrowserCompatibility.Feature || (BrowserCompatibility.Feature = {}));
})(BrowserCompatibility || (BrowserCompatibility = {}));
//# sourceMappingURL=browserCompatibility.js.map