"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineLoader = void 0;
var index_1 = require("../index");
var browserHelper_1 = require("./browserHelper");
var engineWorker_1 = require("./workers/engineWorker");
var EngineLoader = /** @class */ (function () {
    function EngineLoader(preload) {
        if (preload) {
            this.preloadedEngineWorker = new Worker(URL.createObjectURL(engineWorker_1.engineWorkerBlob));
            EngineLoader.load(this.preloadedEngineWorker);
        }
        this.preloadedEngineWorkerAvailable = preload;
    }
    EngineLoader.load = function (engineWorker, preload, delayedRegistration) {
        if (preload === void 0) { preload = false; }
        if (delayedRegistration === void 0) { delayedRegistration = false; }
        engineWorker.postMessage({
            type: "load-library",
            deviceId: index_1.deviceId,
            libraryLocation: index_1.scanditEngineLocation,
            path: window.location.pathname,
            preload: preload,
            delayedRegistration: delayedRegistration,
            licenseKey: index_1.userLicenseKey,
            deviceModelName: browserHelper_1.BrowserHelper.userAgentInfo.getDevice().model,
        });
    };
    EngineLoader.prototype.getEngineWorker = function () {
        if (this.preloadedEngineWorkerAvailable && this.preloadedEngineWorker != null) {
            this.preloadedEngineWorkerAvailable = false;
            return this.preloadedEngineWorker;
        }
        else {
            return new Worker(URL.createObjectURL(engineWorker_1.engineWorkerBlob));
        }
    };
    EngineLoader.prototype.returnEngineWorker = function (engineWorker) {
        if (this.preloadedEngineWorker == null) {
            this.preloadedEngineWorker = engineWorker;
        }
        if (this.preloadedEngineWorker === engineWorker) {
            this.preloadedEngineWorker.onmessage = null;
            this.preloadedEngineWorker.postMessage({
                type: "reset",
            });
            this.preloadedEngineWorkerAvailable = true;
        }
        else {
            engineWorker.terminate();
        }
    };
    return EngineLoader;
}());
exports.EngineLoader = EngineLoader;
//# sourceMappingURL=engineLoader.js.map