"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraManager = exports.CameraResolutionConstraint = exports.MeteringMode = void 0;
var tslib_1 = require("tslib");
var browserHelper_1 = require("../browserHelper");
var camera_1 = require("../camera");
var cameraAccess_1 = require("../cameraAccess");
var cameraSettings_1 = require("../cameraSettings");
var customError_1 = require("../customError");
var MeteringMode;
(function (MeteringMode) {
    MeteringMode["CONTINUOUS"] = "continuous";
    MeteringMode["MANUAL"] = "manual";
    MeteringMode["NONE"] = "none";
    MeteringMode["SINGLE_SHOT"] = "single-shot";
})(MeteringMode = exports.MeteringMode || (exports.MeteringMode = {}));
var CameraResolutionConstraint;
(function (CameraResolutionConstraint) {
    CameraResolutionConstraint[CameraResolutionConstraint["ULTRA_HD"] = 0] = "ULTRA_HD";
    CameraResolutionConstraint[CameraResolutionConstraint["FULL_HD"] = 1] = "FULL_HD";
    CameraResolutionConstraint[CameraResolutionConstraint["HD"] = 2] = "HD";
    CameraResolutionConstraint[CameraResolutionConstraint["SD"] = 3] = "SD";
    CameraResolutionConstraint[CameraResolutionConstraint["NONE"] = 4] = "NONE";
})(CameraResolutionConstraint = exports.CameraResolutionConstraint || (exports.CameraResolutionConstraint = {}));
/**
 * A barcode picker utility class used to handle camera interaction.
 */
var CameraManager = /** @class */ (function () {
    function CameraManager(scanner, triggerFatalError, gui) {
        this.postStreamInitializationListener = this.postStreamInitialization.bind(this);
        this.videoResizeListener = this.videoResizeHandle.bind(this);
        this.videoTrackEndedListener = this.videoTrackEndedRecovery.bind(this);
        this.videoTrackMuteListener = this.videoTrackMuteRecovery.bind(this);
        this.triggerManualFocusListener = this.triggerManualFocus.bind(this);
        this.triggerZoomStartListener = this.triggerZoomStart.bind(this);
        this.triggerZoomMoveListener = this.triggerZoomMove.bind(this);
        this.scanner = scanner;
        this.triggerFatalError = triggerFatalError;
        this.gui = gui;
        this.cameraType = camera_1.Camera.Type.BACK;
    }
    CameraManager.prototype.setInteractionOptions = function (cameraSwitcherEnabled, torchToggleEnabled, tapToFocusEnabled, pinchToZoomEnabled) {
        this.cameraSwitcherEnabled = cameraSwitcherEnabled;
        this.torchToggleEnabled = torchToggleEnabled;
        this.tapToFocusEnabled = tapToFocusEnabled;
        this.pinchToZoomEnabled = pinchToZoomEnabled;
    };
    CameraManager.prototype.isCameraSwitcherEnabled = function () {
        return this.cameraSwitcherEnabled;
    };
    CameraManager.prototype.setCameraSwitcherEnabled = function (enabled) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cameras;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.cameraSwitcherEnabled = enabled;
                        if (!this.cameraSwitcherEnabled) return [3 /*break*/, 2];
                        return [4 /*yield*/, cameraAccess_1.CameraAccess.getCameras()];
                    case 1:
                        cameras = _a.sent();
                        if (cameras.length > 1) {
                            this.gui.setCameraSwitcherVisible(true);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        this.gui.setCameraSwitcherVisible(false);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.isTorchToggleEnabled = function () {
        return this.torchToggleEnabled;
    };
    CameraManager.prototype.setTorchToggleEnabled = function (enabled) {
        var _a;
        this.torchToggleEnabled = enabled;
        if (this.torchToggleEnabled) {
            if (this.mediaStream != null && ((_a = this.mediaTrackCapabilities) === null || _a === void 0 ? void 0 : _a.torch) === true) {
                this.gui.setTorchTogglerVisible(true);
            }
        }
        else {
            this.gui.setTorchTogglerVisible(false);
        }
    };
    CameraManager.prototype.isTapToFocusEnabled = function () {
        return this.tapToFocusEnabled;
    };
    CameraManager.prototype.setTapToFocusEnabled = function (enabled) {
        this.tapToFocusEnabled = enabled;
        if (this.mediaStream != null) {
            if (this.tapToFocusEnabled) {
                this.enableTapToFocusListeners();
            }
            else {
                this.disableTapToFocusListeners();
            }
        }
    };
    CameraManager.prototype.isPinchToZoomEnabled = function () {
        return this.pinchToZoomEnabled;
    };
    CameraManager.prototype.setPinchToZoomEnabled = function (enabled) {
        this.pinchToZoomEnabled = enabled;
        if (this.mediaStream != null) {
            if (this.pinchToZoomEnabled) {
                this.enablePinchToZoomListeners();
            }
            else {
                this.disablePinchToZoomListeners();
            }
        }
    };
    CameraManager.prototype.setInitialCameraType = function (cameraType) {
        this.cameraType = cameraType;
    };
    CameraManager.prototype.setCameraType = function (cameraType) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var mainCameraForType, _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.setInitialCameraType(cameraType);
                        _b = (_a = cameraAccess_1.CameraAccess).getMainCameraForType;
                        return [4 /*yield*/, cameraAccess_1.CameraAccess.getCameras()];
                    case 1:
                        mainCameraForType = _b.apply(_a, [_c.sent(), cameraType]);
                        if (mainCameraForType != null && mainCameraForType !== this.selectedCamera) {
                            return [2 /*return*/, this.initializeCameraWithSettings(mainCameraForType, this.selectedCameraSettings)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.setSelectedCamera = function (camera) {
        this.selectedCamera = camera;
    };
    CameraManager.prototype.setSelectedCameraSettings = function (cameraSettings) {
        this.selectedCameraSettings = cameraSettings;
    };
    CameraManager.prototype.setupCameras = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (this.cameraSetupPromise != null) {
                    return [2 /*return*/, this.cameraSetupPromise];
                }
                this.cameraSetupPromise = this.setupCamerasAndStream();
                return [2 /*return*/, this.cameraSetupPromise];
            });
        });
    };
    CameraManager.prototype.stopStream = function () {
        var _this = this;
        if (this.activeCamera != null) {
            this.activeCamera.currentResolution = undefined;
        }
        this.activeCamera = undefined;
        if (this.mediaStream != null) {
            console.debug("Stop camera video stream access (stream):", this.mediaStream);
            window.clearTimeout(this.cameraAccessTimeout);
            window.clearInterval(this.videoMetadataCheckInterval);
            window.clearTimeout(this.getCapabilitiesTimeout);
            window.clearTimeout(this.manualFocusWaitTimeout);
            window.clearTimeout(this.manualToAutofocusResumeTimeout);
            window.clearInterval(this.autofocusInterval);
            this.mediaStream.getVideoTracks().forEach(function (track) {
                track.removeEventListener("ended", _this.videoTrackEndedListener);
                track.stop();
            });
            this.gui.videoElement.srcObject = null;
            this.mediaStream = undefined;
            this.mediaTrackCapabilities = undefined;
        }
    };
    CameraManager.prototype.applyCameraSettings = function (cameraSettings) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.selectedCameraSettings = cameraSettings;
                if (this.activeCamera == null) {
                    throw new customError_1.CustomError(CameraManager.noCameraErrorParameters);
                }
                return [2 /*return*/, this.initializeCameraWithSettings(this.activeCamera, cameraSettings)];
            });
        });
    };
    CameraManager.prototype.reinitializeCamera = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.activeCamera == null)) return [3 /*break*/, 1];
                        // If the initial camera isn't active yet, do nothing: if and when the camera is later confirmed to be the correct
                        // (main with wanted type or only) one this method will be called again after the camera is set to be active
                        console.debug("Camera reinitialization delayed");
                        return [3 /*break*/, 5];
                    case 1:
                        console.debug("Reinitialize camera:", this.activeCamera);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.initializeCameraWithSettings(this.activeCamera, this.activeCameraSettings)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.warn("Couldn't access camera:", this.activeCamera, error_1);
                        this.triggerFatalError(error_1);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.initializeCameraWithSettings = function (camera, cameraSettings) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.cameraInitializationPromise != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.cameraInitializationPromise];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.setSelectedCamera(camera);
                        this.selectedCameraSettings = this.activeCameraSettings = cameraSettings;
                        this.cameraInitializationPromise = this.initializeCameraAndCheckUpdatedSettings(camera);
                        return [2 /*return*/, this.cameraInitializationPromise];
                }
            });
        });
    };
    CameraManager.prototype.setTorchEnabled = function (enabled) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var videoTracks;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.mediaStream != null && ((_a = this.mediaTrackCapabilities) === null || _a === void 0 ? void 0 : _a.torch) === true)) return [3 /*break*/, 2];
                        this.torchEnabled = enabled;
                        videoTracks = this.mediaStream.getVideoTracks();
                        if (!(videoTracks.length !== 0 && typeof videoTracks[0].applyConstraints === "function")) return [3 /*break*/, 2];
                        return [4 /*yield*/, videoTracks[0].applyConstraints({ advanced: [{ torch: enabled }] })];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.toggleTorch = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.torchEnabled = !this.torchEnabled;
                        return [4 /*yield*/, this.setTorchEnabled(this.torchEnabled)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.setZoom = function (zoomPercentage, currentZoom) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var videoTracks, zoomRange, targetZoom;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.mediaStream != null && ((_a = this.mediaTrackCapabilities) === null || _a === void 0 ? void 0 : _a.zoom) != null)) return [3 /*break*/, 2];
                        videoTracks = this.mediaStream.getVideoTracks();
                        if (!(videoTracks.length !== 0 && typeof videoTracks[0].applyConstraints === "function")) return [3 /*break*/, 2];
                        zoomRange = this.mediaTrackCapabilities.zoom.max - this.mediaTrackCapabilities.zoom.min;
                        targetZoom = Math.max(this.mediaTrackCapabilities.zoom.min, Math.min((currentZoom !== null && currentZoom !== void 0 ? currentZoom : this.mediaTrackCapabilities.zoom.min) + zoomRange * zoomPercentage, this.mediaTrackCapabilities.zoom.max));
                        return [4 /*yield*/, videoTracks[0].applyConstraints({
                                advanced: [{ zoom: targetZoom }],
                            })];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.recoverStreamIfNeeded = function () {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var videoTracks;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        videoTracks = (_a = this.mediaStream) === null || _a === void 0 ? void 0 : _a.getVideoTracks();
                        if (!(((_b = videoTracks === null || videoTracks === void 0 ? void 0 : videoTracks[0]) === null || _b === void 0 ? void 0 : _b.readyState) === "ended")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.reinitializeCamera()];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.setupCamerasAndStream = function () {
        var _a, _b, _c;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var initialCamera_1, cameras, initialCameraDeviceId_1, activeCamera;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, , 13, 14]);
                        if (!(this.selectedCamera == null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.accessInitialCamera()];
                    case 1:
                        initialCamera_1 = _d.sent();
                        _d.label = 2;
                    case 2: return [4 /*yield*/, cameraAccess_1.CameraAccess.getCameras()];
                    case 3:
                        cameras = _d.sent();
                        if (this.cameraSwitcherEnabled && cameras.length > 1) {
                            this.gui.setCameraSwitcherVisible(true);
                        }
                        initialCameraDeviceId_1 = (_c = (_b = (_a = this.mediaStream) === null || _a === void 0 ? void 0 : _a.getVideoTracks()[0]) === null || _b === void 0 ? void 0 : _b.getSettings) === null || _c === void 0 ? void 0 : _c.call(_b).deviceId;
                        if (!(this.mediaStream != null && initialCamera_1 != null)) return [3 /*break*/, 8];
                        activeCamera = cameras.length === 1
                            ? cameras[0]
                            : cameras.find(function (camera) {
                                return (camera.deviceId === initialCameraDeviceId_1 ||
                                    (camera.label !== "" && camera.label === (initialCamera_1 === null || initialCamera_1 === void 0 ? void 0 : initialCamera_1.label)));
                            });
                        if (!(activeCamera != null)) return [3 /*break*/, 7];
                        cameraAccess_1.CameraAccess.adjustCameraFromMediaStream(this.mediaStream, activeCamera);
                        if (browserHelper_1.BrowserHelper.isDesktopDevice()) {
                            // When the device is a desktop/laptop, we store the initial camera as it should be considered the main one
                            // for its camera type and the currently set camera type (which might be different)
                            cameraAccess_1.CameraAccess.mainCameraForTypeOverridesOnDesktop.set(this.cameraType, activeCamera);
                            cameraAccess_1.CameraAccess.mainCameraForTypeOverridesOnDesktop.set(activeCamera.cameraType, activeCamera);
                        }
                        if (!(cameras.length === 1 || cameraAccess_1.CameraAccess.getMainCameraForType(cameras, this.cameraType) === activeCamera)) return [3 /*break*/, 5];
                        console.debug("Initial camera access was correct (main camera), keep camera:", activeCamera);
                        this.setSelectedCamera(activeCamera);
                        this.updateActiveCameraCurrentResolution(activeCamera);
                        return [4 /*yield*/, this.recoverStreamIfNeeded()];
                    case 4:
                        _d.sent();
                        return [2 /*return*/];
                    case 5:
                        console.debug("Initial camera access was incorrect (not main camera), change camera", tslib_1.__assign(tslib_1.__assign({}, initialCamera_1), { deviceId: initialCameraDeviceId_1 }));
                        _d.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        console.debug("Initial camera access was incorrect (unknown camera), change camera", tslib_1.__assign(tslib_1.__assign({}, initialCamera_1), { deviceId: initialCameraDeviceId_1 }));
                        _d.label = 8;
                    case 8:
                        if (!(this.selectedCamera == null)) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.accessAutoselectedCamera(cameras)];
                    case 9: return [2 /*return*/, _d.sent()];
                    case 10: return [4 /*yield*/, this.initializeCameraWithSettings(this.selectedCamera, this.selectedCameraSettings)];
                    case 11: return [2 /*return*/, _d.sent()];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        this.cameraSetupPromise = undefined;
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.getInitialCameraResolutionConstraint = function () {
        var _a;
        var cameraResolutionConstraint;
        switch ((_a = this.activeCameraSettings) === null || _a === void 0 ? void 0 : _a.resolutionPreference) {
            case cameraSettings_1.CameraSettings.ResolutionPreference.ULTRA_HD:
                cameraResolutionConstraint = CameraResolutionConstraint.ULTRA_HD;
                break;
            case cameraSettings_1.CameraSettings.ResolutionPreference.FULL_HD:
                cameraResolutionConstraint = CameraResolutionConstraint.FULL_HD;
                break;
            case cameraSettings_1.CameraSettings.ResolutionPreference.HD:
            default:
                cameraResolutionConstraint = CameraResolutionConstraint.HD;
                break;
        }
        return cameraResolutionConstraint;
    };
    CameraManager.prototype.accessAutoselectedCamera = function (cameras) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var autoselectedCamera, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cameras = cameraAccess_1.CameraAccess.sortCamerasForCameraType(cameras, this.cameraType);
                        autoselectedCamera = cameras.shift();
                        _a.label = 1;
                    case 1:
                        if (!(autoselectedCamera != null)) return [3 /*break*/, 6];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.initializeCameraWithSettings(autoselectedCamera, this.selectedCameraSettings)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_2 = _a.sent();
                        this.setSelectedCamera();
                        if (cameras.length === 1) {
                            this.gui.setCameraSwitcherVisible(false);
                        }
                        if (cameras.length >= 1) {
                            console.warn("Couldn't access camera:", autoselectedCamera, error_2);
                            autoselectedCamera = cameras.shift();
                            return [3 /*break*/, 1];
                        }
                        throw error_2;
                    case 5: return [3 /*break*/, 1];
                    case 6: throw new customError_1.CustomError(CameraManager.noCameraErrorParameters);
                }
            });
        });
    };
    CameraManager.prototype.accessInitialCamera = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var initialCamera, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        initialCamera = {
                            deviceId: "",
                            label: "",
                            cameraType: this.cameraType,
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, this.initializeCameraWithSettings(initialCamera, this.selectedCameraSettings)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        this.setSelectedCamera();
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/, initialCamera];
                }
            });
        });
    };
    CameraManager.prototype.updateActiveCameraCurrentResolution = function (camera) {
        if (this.gui.videoElement.videoWidth > 2 && this.gui.videoElement.videoHeight > 2) {
            camera.currentResolution = {
                width: this.gui.videoElement.videoWidth,
                height: this.gui.videoElement.videoHeight,
            };
        }
        // If it's the initial camera, do nothing: if and when the camera is later confirmed to be the
        // correct (main with wanted type or only) one this method will be called again with the right camera object
        if (camera.deviceId !== "") {
            this.activeCamera = camera;
            this.gui.setMirrorImageEnabled(this.gui.isMirrorImageEnabled(), false);
        }
    };
    CameraManager.prototype.postStreamInitialization = function () {
        var _this = this;
        window.clearTimeout(this.getCapabilitiesTimeout);
        this.getCapabilitiesTimeout = window.setTimeout(function () {
            var _a;
            _this.storeStreamCapabilities();
            _this.setupAutofocus();
            if (_this.torchToggleEnabled && _this.mediaStream != null && ((_a = _this.mediaTrackCapabilities) === null || _a === void 0 ? void 0 : _a.torch) === true) {
                _this.gui.setTorchTogglerVisible(true);
            }
        }, CameraManager.getCapabilitiesTimeoutMs);
    };
    CameraManager.prototype.videoResizeHandle = function () {
        if (this.activeCamera != null) {
            this.updateActiveCameraCurrentResolution(this.activeCamera);
        }
    };
    CameraManager.prototype.videoTrackEndedRecovery = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.debug('Detected video track "ended" event, try to reinitialize camera');
                        return [4 /*yield*/, this.reinitializeCamera()];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.videoTrackMuteRecovery = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.debug('Detected video track "unmute" event, try to reinitialize camera');
                        return [4 /*yield*/, this.reinitializeCamera()];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.triggerManualFocusForContinuous = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.manualToAutofocusResumeTimeout = window.setTimeout(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.triggerFocusMode(MeteringMode.CONTINUOUS)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, CameraManager.manualToAutofocusResumeTimeoutMs);
                        return [4 /*yield*/, this.triggerFocusMode(MeteringMode.CONTINUOUS)];
                    case 1:
                        _a.sent();
                        this.manualFocusWaitTimeout = window.setTimeout(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.triggerFocusMode(MeteringMode.MANUAL)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, CameraManager.manualFocusWaitTimeoutMs);
                        return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.triggerManualFocusForSingleShot = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        window.clearInterval(this.autofocusInterval);
                        this.manualToAutofocusResumeTimeout = window.setTimeout(function () {
                            _this.autofocusInterval = window.setInterval(_this.triggerAutoFocus.bind(_this), CameraManager.autofocusIntervalMs);
                        }, CameraManager.manualToAutofocusResumeTimeoutMs);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.triggerFocusMode(MeteringMode.SINGLE_SHOT)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.triggerManualFocus = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var focusModeCapability;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (event != null) {
                            event.preventDefault();
                            if (event.type === "touchend" && event.touches.length !== 0) {
                                return [2 /*return*/];
                            }
                            // Check if we were using pinch-to-zoom
                            if (this.pinchToZoomDistance != null) {
                                this.pinchToZoomDistance = undefined;
                                return [2 /*return*/];
                            }
                        }
                        window.clearTimeout(this.manualFocusWaitTimeout);
                        window.clearTimeout(this.manualToAutofocusResumeTimeout);
                        if (!(this.mediaStream != null && this.mediaTrackCapabilities != null)) return [3 /*break*/, 4];
                        focusModeCapability = this.mediaTrackCapabilities.focusMode;
                        if (!(focusModeCapability instanceof Array && focusModeCapability.includes(MeteringMode.SINGLE_SHOT))) return [3 /*break*/, 4];
                        if (!(focusModeCapability.includes(MeteringMode.CONTINUOUS) &&
                            focusModeCapability.includes(MeteringMode.MANUAL))) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.triggerManualFocusForContinuous()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!!focusModeCapability.includes(MeteringMode.CONTINUOUS)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.triggerManualFocusForSingleShot()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.triggerZoomStart = function (event) {
        var _a;
        if ((event === null || event === void 0 ? void 0 : event.touches.length) !== 2) {
            return;
        }
        event.preventDefault();
        this.pinchToZoomDistance = Math.hypot((event.touches[1].screenX - event.touches[0].screenX) / screen.width, (event.touches[1].screenY - event.touches[0].screenY) / screen.height);
        if (this.mediaStream != null && ((_a = this.mediaTrackCapabilities) === null || _a === void 0 ? void 0 : _a.zoom) != null) {
            var videoTracks = this.mediaStream.getVideoTracks();
            // istanbul ignore else
            if (videoTracks.length !== 0 && typeof videoTracks[0].getConstraints === "function") {
                this.pinchToZoomInitialZoom = this.mediaTrackCapabilities.zoom.min;
                var currentConstraints = videoTracks[0].getConstraints();
                if (currentConstraints.advanced != null) {
                    var currentZoomConstraint = currentConstraints.advanced.find(function (constraint) {
                        return "zoom" in constraint;
                    });
                    if ((currentZoomConstraint === null || currentZoomConstraint === void 0 ? void 0 : currentZoomConstraint.zoom) != null) {
                        this.pinchToZoomInitialZoom = currentZoomConstraint.zoom;
                    }
                }
            }
        }
    };
    CameraManager.prototype.triggerZoomMove = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.pinchToZoomDistance == null || (event === null || event === void 0 ? void 0 : event.touches.length) !== 2) {
                            return [2 /*return*/];
                        }
                        event.preventDefault();
                        return [4 /*yield*/, this.setZoom((Math.hypot((event.touches[1].screenX - event.touches[0].screenX) / screen.width, (event.touches[1].screenY - event.touches[0].screenY) / screen.height) -
                                this.pinchToZoomDistance) *
                                2, this.pinchToZoomInitialZoom)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.storeStreamCapabilities = function () {
        var _a;
        // istanbul ignore else
        if (this.mediaStream != null) {
            var videoTracks = this.mediaStream.getVideoTracks();
            // istanbul ignore else
            if (videoTracks.length !== 0 && typeof videoTracks[0].getCapabilities === "function") {
                this.mediaTrackCapabilities = videoTracks[0].getCapabilities();
            }
        }
        if (this.activeCamera != null) {
            this.scanner.reportCameraProperties(this.activeCamera.cameraType, ((_a = this.mediaTrackCapabilities) === null || _a === void 0 ? void 0 : _a.focusMode) == null || // assume the camera supports autofocus by default
                this.mediaTrackCapabilities.focusMode.includes(MeteringMode.CONTINUOUS));
        }
    };
    CameraManager.prototype.setupAutofocus = function () {
        window.clearTimeout(this.manualFocusWaitTimeout);
        window.clearTimeout(this.manualToAutofocusResumeTimeout);
        // istanbul ignore else
        if (this.mediaStream != null && this.mediaTrackCapabilities != null) {
            var focusModeCapability = this.mediaTrackCapabilities.focusMode;
            if (focusModeCapability instanceof Array &&
                !focusModeCapability.includes(MeteringMode.CONTINUOUS) &&
                focusModeCapability.includes(MeteringMode.SINGLE_SHOT)) {
                window.clearInterval(this.autofocusInterval);
                this.autofocusInterval = window.setInterval(this.triggerAutoFocus.bind(this), CameraManager.autofocusIntervalMs);
            }
        }
    };
    CameraManager.prototype.triggerAutoFocus = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.triggerFocusMode(MeteringMode.SINGLE_SHOT)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.triggerFocusMode = function (focusMode) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var videoTracks, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.mediaStream != null)) return [3 /*break*/, 4];
                        videoTracks = this.mediaStream.getVideoTracks();
                        if (!(videoTracks.length !== 0 && typeof videoTracks[0].applyConstraints === "function")) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, videoTracks[0].applyConstraints({ advanced: [{ focusMode: focusMode }] })];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.enableTapToFocusListeners = function () {
        var _this = this;
        ["touchend", "mousedown"].forEach(function (eventName) {
            _this.gui.videoElement.addEventListener(eventName, _this.triggerManualFocusListener);
        });
    };
    CameraManager.prototype.enablePinchToZoomListeners = function () {
        this.gui.videoElement.addEventListener("touchstart", this.triggerZoomStartListener);
        this.gui.videoElement.addEventListener("touchmove", this.triggerZoomMoveListener);
    };
    CameraManager.prototype.disableTapToFocusListeners = function () {
        var _this = this;
        ["touchend", "mousedown"].forEach(function (eventName) {
            _this.gui.videoElement.removeEventListener(eventName, _this.triggerManualFocusListener);
        });
    };
    CameraManager.prototype.disablePinchToZoomListeners = function () {
        this.gui.videoElement.removeEventListener("touchstart", this.triggerZoomStartListener);
        this.gui.videoElement.removeEventListener("touchmove", this.triggerZoomMoveListener);
    };
    CameraManager.prototype.initializeCameraAndCheckUpdatedSettings = function (camera) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 4, 5]);
                        return [4 /*yield*/, this.initializeCamera(camera)];
                    case 1:
                        _a.sent();
                        if (!(this.selectedCameraSettings !== this.activeCameraSettings &&
                            (this.selectedCameraSettings == null ||
                                this.activeCameraSettings == null ||
                                Object.keys(this.selectedCameraSettings).some(function (cameraSettingsProperty) {
                                    return (_this.selectedCameraSettings[cameraSettingsProperty] !==
                                        _this.activeCameraSettings[cameraSettingsProperty]);
                                })))) return [3 /*break*/, 3];
                        this.activeCameraSettings = this.selectedCameraSettings;
                        return [4 /*yield*/, this.initializeCameraAndCheckUpdatedSettings(camera)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        this.cameraInitializationPromise = undefined;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.handleCameraInitializationError = function (camera, cameraResolutionConstraint, error) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var currentCameraDeviceId;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (error.name !== "OverconstrainedError") {
                            // Camera is not accessible at all
                            console.debug("Camera video stream access failure (unrecoverable error)", camera, error);
                            throw error;
                        }
                        if (!(error.name === "OverconstrainedError" && cameraResolutionConstraint === CameraResolutionConstraint.NONE)) return [3 /*break*/, 2];
                        // Camera device has changed deviceId
                        // We can't rely on checking whether the constraint error property in the browsers reporting it is equal to
                        // "deviceId" as it is used even when the error is due to a too high resolution being requested.
                        // Whenever we get an OverconstrainedError we keep trying until we are using no constraints except for deviceId
                        // (cameraResolutionConstraint is NONE), if an error still happens we know said device doesn't exist anymore
                        // (the device has changed deviceId).
                        // If it's the initial camera, do nothing
                        if (camera.deviceId === "") {
                            console.debug("Camera video stream access failure (no camera with such type error)", camera, error);
                            throw error;
                        }
                        console.debug("Detected non-existent deviceId error, attempt to find and reaccess updated camera", camera, error);
                        currentCameraDeviceId = camera.deviceId;
                        // Refresh camera deviceId information
                        return [4 /*yield*/, cameraAccess_1.CameraAccess.getCameras(true)];
                    case 1:
                        // Refresh camera deviceId information
                        _a.sent();
                        if (currentCameraDeviceId === camera.deviceId) {
                            console.debug("Camera video stream access failure (updated camera not found after non-existent deviceId error)", camera, error);
                            cameraAccess_1.CameraAccess.markCameraAsInaccessible(camera);
                            throw error;
                        }
                        else {
                            console.debug("Updated camera found (recovered from non-existent deviceId error), attempt to access it", camera);
                            return [2 /*return*/, this.initializeCamera(camera)];
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.initializeCamera(camera, cameraResolutionConstraint + 1)];
                }
            });
        });
    };
    CameraManager.prototype.initializeCamera = function (camera, cameraResolutionConstraint) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var stream, mediaTrackSettings, error_3, error_4;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (camera == null) {
                            throw new customError_1.CustomError(CameraManager.noCameraErrorParameters);
                        }
                        this.stopStream();
                        this.torchEnabled = false;
                        this.gui.setTorchTogglerVisible(false);
                        cameraResolutionConstraint !== null && cameraResolutionConstraint !== void 0 ? cameraResolutionConstraint : (cameraResolutionConstraint = this.getInitialCameraResolutionConstraint());
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, cameraAccess_1.CameraAccess.accessCameraStream(cameraResolutionConstraint, camera)];
                    case 2:
                        stream = _a.sent();
                        // Detect weird browser behaviour that on unsupported resolution returns a 2x2 video instead
                        if (typeof stream.getTracks()[0].getSettings === "function") {
                            mediaTrackSettings = stream.getTracks()[0].getSettings();
                            if (mediaTrackSettings.width != null &&
                                mediaTrackSettings.height != null &&
                                (mediaTrackSettings.width === 2 || mediaTrackSettings.height === 2)) {
                                console.debug("Camera video stream access failure (invalid video metadata):", camera);
                                if (cameraResolutionConstraint === CameraResolutionConstraint.NONE) {
                                    throw new customError_1.CustomError(CameraManager.notReadableErrorParameters);
                                }
                                else {
                                    return [2 /*return*/, this.initializeCamera(camera, cameraResolutionConstraint + 1)];
                                }
                            }
                        }
                        this.mediaStream = stream;
                        this.mediaStream.getVideoTracks().forEach(function (track) {
                            // Handle unexpected stream end events
                            track.addEventListener("ended", _this.videoTrackEndedListener);
                            if (browserHelper_1.BrowserHelper.userAgentInfo.getBrowser().name === "Safari") {
                                // Safari only allows a single page to have the camera active at any time, if the track gets muted we need
                                // to reinitialize the camera to access it again (this is done automatically only once the page is visible)
                                // as soon as possible, other browsers use mute/unmute on page visibility changes, but not Safari.
                                // This will add the listeners only once in case of multiple calls: identical listeners are ignored
                                track.addEventListener("mute", _this.videoTrackMuteListener);
                            }
                        });
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.setupCameraStreamVideo(camera, stream)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        if (cameraResolutionConstraint === CameraResolutionConstraint.NONE) {
                            throw error_3;
                        }
                        else {
                            return [2 /*return*/, this.initializeCamera(camera, cameraResolutionConstraint + 1)];
                        }
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_4 = _a.sent();
                        return [2 /*return*/, this.handleCameraInitializationError(camera, cameraResolutionConstraint, error_4)];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    CameraManager.prototype.checkCameraAccess = function (camera) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                window.clearTimeout(this.cameraAccessTimeout);
                return [2 /*return*/, new Promise(function (_, reject) {
                        _this.cameraAccessTimeout = window.setTimeout(function () {
                            console.debug("Camera video stream access failure (video data load timeout):", camera);
                            _this.stopStream();
                            reject(new customError_1.CustomError(CameraManager.notReadableErrorParameters));
                        }, CameraManager.cameraAccessTimeoutMs);
                    })];
            });
        });
    };
    CameraManager.prototype.checkVideoMetadata = function (camera) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.gui.videoElement.onloadeddata = function () {
                            _this.gui.videoElement.onloadeddata = null;
                            window.clearTimeout(_this.cameraAccessTimeout);
                            // Detect weird browser behaviour that on unsupported resolution returns a 2x2 video instead
                            // Also detect failed camera access with no error but also no video stream provided
                            if (_this.gui.videoElement.videoWidth > 2 &&
                                _this.gui.videoElement.videoHeight > 2 &&
                                _this.gui.videoElement.currentTime > 0) {
                                _this.updateActiveCameraCurrentResolution(camera);
                                console.debug("Camera video stream access success:", camera);
                                return resolve();
                            }
                            var videoMetadataCheckStartTime = performance.now();
                            window.clearInterval(_this.videoMetadataCheckInterval);
                            _this.videoMetadataCheckInterval = window.setInterval(function () {
                                // Detect weird browser behaviour that on unsupported resolution returns a 2x2 video instead
                                // Also detect failed camera access with no error but also no video stream provided
                                if (_this.gui.videoElement.videoWidth <= 2 ||
                                    _this.gui.videoElement.videoHeight <= 2 ||
                                    _this.gui.videoElement.currentTime === 0) {
                                    if (performance.now() - videoMetadataCheckStartTime > CameraManager.videoMetadataCheckTimeoutMs) {
                                        console.debug("Camera video stream access failure (valid video metadata timeout):", camera);
                                        window.clearInterval(_this.videoMetadataCheckInterval);
                                        _this.stopStream();
                                        return reject(new customError_1.CustomError(CameraManager.notReadableErrorParameters));
                                    }
                                    return;
                                }
                                window.clearInterval(_this.videoMetadataCheckInterval);
                                _this.updateActiveCameraCurrentResolution(camera);
                                console.debug("Camera video stream access success:", camera);
                                resolve();
                            }, CameraManager.videoMetadataCheckIntervalMs);
                        };
                    })];
            });
        });
    };
    CameraManager.prototype.setupCameraStreamVideo = function (camera, stream) {
        // These will add the listeners only once in the case of multiple calls, identical listeners are ignored
        this.gui.videoElement.addEventListener("loadedmetadata", this.postStreamInitializationListener);
        this.gui.videoElement.addEventListener("resize", this.videoResizeListener);
        if (this.tapToFocusEnabled) {
            this.enableTapToFocusListeners();
        }
        if (this.pinchToZoomEnabled) {
            this.enablePinchToZoomListeners();
        }
        var cameraStreamVideoCheck = Promise.race([
            this.checkCameraAccess(camera),
            this.checkVideoMetadata(camera),
        ]);
        this.gui.videoElement.srcObject = stream;
        this.gui.videoElement.load();
        this.gui.playVideo();
        // Report camera properties already now in order to have type information before autofocus information is available.
        // Even if later the initialization could fail nothing bad results from this.
        this.scanner.reportCameraProperties(camera.cameraType);
        return cameraStreamVideoCheck;
    };
    CameraManager.cameraAccessTimeoutMs = 4000;
    CameraManager.videoMetadataCheckTimeoutMs = 4000;
    CameraManager.videoMetadataCheckIntervalMs = 50;
    CameraManager.getCapabilitiesTimeoutMs = 500;
    CameraManager.autofocusIntervalMs = 1500;
    CameraManager.manualToAutofocusResumeTimeoutMs = 5000;
    CameraManager.manualFocusWaitTimeoutMs = 400;
    CameraManager.noCameraErrorParameters = {
        name: "NoCameraAvailableError",
        message: "No camera available",
    };
    CameraManager.notReadableErrorParameters = {
        name: "NotReadableError",
        message: "Could not initialize camera correctly",
    };
    return CameraManager;
}());
exports.CameraManager = CameraManager;
//# sourceMappingURL=cameraManager.js.map