import { deviceId, scanditEngineLocation, userLicenseKey } from "../index";
import { BrowserHelper } from "./browserHelper";
import { engineWorkerBlob } from "./workers/engineWorker";
export class EngineLoader {
    constructor(preload) {
        if (preload) {
            this.preloadedEngineWorker = new Worker(URL.createObjectURL(engineWorkerBlob));
            EngineLoader.load(this.preloadedEngineWorker);
        }
        this.preloadedEngineWorkerAvailable = preload;
    }
    static load(engineWorker, preload = false, delayedRegistration = false) {
        engineWorker.postMessage({
            type: "load-library",
            deviceId,
            libraryLocation: scanditEngineLocation,
            path: window.location.pathname,
            preload,
            delayedRegistration,
            licenseKey: userLicenseKey,
            deviceModelName: BrowserHelper.userAgentInfo.getDevice().model,
        });
    }
    getEngineWorker() {
        if (this.preloadedEngineWorkerAvailable && this.preloadedEngineWorker != null) {
            this.preloadedEngineWorkerAvailable = false;
            return this.preloadedEngineWorker;
        }
        else {
            return new Worker(URL.createObjectURL(engineWorkerBlob));
        }
    }
    returnEngineWorker(engineWorker) {
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
    }
}
//# sourceMappingURL=engineLoader.js.map