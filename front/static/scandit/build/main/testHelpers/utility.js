"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeFullCompatibleBrowser = exports.fakeGetCameras = exports.wait = void 0;
var tslib_1 = require("tslib");
/* tslint:disable:no-implicit-dependencies */
var eventemitter3_1 = require("eventemitter3");
var sinon = tslib_1.__importStar(require("sinon"));
var __1 = require("..");
function wait(ms) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(resolve, ms);
                })];
        });
    });
}
exports.wait = wait;
function fakeGetCameras(cameraAmount, cameraTypes, cameraLabels) {
    var _a, _b;
    (_b = (_a = __1.CameraAccess.getCameras).restore) === null || _b === void 0 ? void 0 : _b.call(_a);
    sinon.stub(__1.CameraAccess, "getCameras").resolves(
    // tslint:disable-next-line:prefer-array-literal
    Array.from(Array(cameraAmount), function (_, index) {
        var _a, _b;
        var cameraType = (_a = cameraTypes === null || cameraTypes === void 0 ? void 0 : cameraTypes[index]) !== null && _a !== void 0 ? _a : __1.Camera.Type.BACK;
        return {
            deviceId: (index + 1).toString(),
            label: (_b = cameraLabels === null || cameraLabels === void 0 ? void 0 : cameraLabels[index]) !== null && _b !== void 0 ? _b : "Fake Camera Device (" + cameraType + ")",
            cameraType: cameraType,
        };
    }));
}
exports.fakeGetCameras = fakeGetCameras;
function fakeFullCompatibleBrowser(configureLibrary, cameraDevices) {
    if (configureLibrary === void 0) { configureLibrary = true; }
    if (cameraDevices === void 0) { cameraDevices = []; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var mediaStreamTrack, MediaDevicesEventEmitter, mediaDevicesEventEmitter;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mediaStreamTrack = {
                        stop: sinon.stub(),
                        addEventListener: sinon.stub(),
                        removeEventListener: sinon.stub(),
                        applyConstraints: sinon.stub().resolves(),
                        getCapabilities: sinon.stub().returns({}),
                        getConstraints: sinon.stub().returns({}),
                        getSettings: function () {
                            return {
                                width: 4,
                                height: 4,
                            };
                        },
                    };
                    MediaDevicesEventEmitter = /** @class */ (function (_super) {
                        tslib_1.__extends(MediaDevicesEventEmitter, _super);
                        function MediaDevicesEventEmitter() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        return MediaDevicesEventEmitter;
                    }(eventemitter3_1.EventEmitter));
                    mediaDevicesEventEmitter = new eventemitter3_1.EventEmitter();
                    Object.defineProperty(navigator, "mediaDevices", {
                        value: {
                            getUserMedia: function () {
                                return Promise.resolve({
                                    getTracks: function () {
                                        return [mediaStreamTrack];
                                    },
                                    getVideoTracks: function () {
                                        return [mediaStreamTrack];
                                    },
                                });
                            },
                            addEventListener: function (type, listener) {
                                // The native addEventListener implementation would check for listener unicity, approximate this
                                mediaDevicesEventEmitter.removeAllListeners(type);
                                mediaDevicesEventEmitter.on(type, listener);
                            },
                            dispatchEvent: function (event) {
                                mediaDevicesEventEmitter.emit(event.type);
                                return true;
                            },
                        },
                        configurable: true,
                    });
                    navigator.mediaDevices.enumerateDevices = function () {
                        return Promise.resolve(cameraDevices);
                    };
                    URL.createObjectURL = sinon.stub();
                    __1.BrowserHelper.checkBrowserCompatibility = function () {
                        return {
                            fullSupport: true,
                            scannerSupport: true,
                            missingFeatures: [],
                        };
                    };
                    if (!configureLibrary) return [3 /*break*/, 2];
                    return [4 /*yield*/, __1.configure("#".repeat(64), { preloadBlurryRecognition: false, preloadEngine: false })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.fakeFullCompatibleBrowser = fakeFullCompatibleBrowser;
//# sourceMappingURL=utility.js.map