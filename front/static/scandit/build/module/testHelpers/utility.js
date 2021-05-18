/* tslint:disable:no-implicit-dependencies */
import { EventEmitter } from "eventemitter3";
import * as sinon from "sinon";
import { BrowserHelper, Camera, CameraAccess, configure } from "..";
export async function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
export function fakeGetCameras(cameraAmount, cameraTypes, cameraLabels) {
    CameraAccess.getCameras.restore?.();
    sinon.stub(CameraAccess, "getCameras").resolves(
    // tslint:disable-next-line:prefer-array-literal
    Array.from(Array(cameraAmount), (_, index) => {
        const cameraType = cameraTypes?.[index] ?? Camera.Type.BACK;
        return {
            deviceId: (index + 1).toString(),
            label: cameraLabels?.[index] ?? `Fake Camera Device (${cameraType})`,
            cameraType,
        };
    }));
}
export async function fakeFullCompatibleBrowser(configureLibrary = true, cameraDevices = []) {
    const mediaStreamTrack = {
        stop: sinon.stub(),
        addEventListener: sinon.stub(),
        removeEventListener: sinon.stub(),
        applyConstraints: sinon.stub().resolves(),
        getCapabilities: sinon.stub().returns({}),
        getConstraints: sinon.stub().returns({}),
        getSettings: () => {
            return {
                width: 4,
                height: 4,
            };
        },
    };
    class MediaDevicesEventEmitter extends EventEmitter {
    }
    const mediaDevicesEventEmitter = new EventEmitter();
    Object.defineProperty(navigator, "mediaDevices", {
        value: {
            getUserMedia: () => {
                return Promise.resolve({
                    getTracks: () => {
                        return [mediaStreamTrack];
                    },
                    getVideoTracks: () => {
                        return [mediaStreamTrack];
                    },
                });
            },
            addEventListener: (type, listener) => {
                // The native addEventListener implementation would check for listener unicity, approximate this
                mediaDevicesEventEmitter.removeAllListeners(type);
                mediaDevicesEventEmitter.on(type, listener);
            },
            dispatchEvent: (event) => {
                mediaDevicesEventEmitter.emit(event.type);
                return true;
            },
        },
        configurable: true,
    });
    navigator.mediaDevices.enumerateDevices = () => {
        return Promise.resolve(cameraDevices);
    };
    URL.createObjectURL = sinon.stub();
    BrowserHelper.checkBrowserCompatibility = () => {
        return {
            fullSupport: true,
            scannerSupport: true,
            missingFeatures: [],
        };
    };
    if (configureLibrary) {
        await configure("#".repeat(64), { preloadBlurryRecognition: false, preloadEngine: false });
    }
}
//# sourceMappingURL=utility.js.map