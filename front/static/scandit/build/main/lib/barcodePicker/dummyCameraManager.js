"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCameraManager = void 0;
var tslib_1 = require("tslib");
var cameraManager_1 = require("./cameraManager");
/**
 * A dummy barcode picker utility class used to (not) handle camera interaction.
 */
// istanbul ignore next
var DummyCameraManager = /** @class */ (function (_super) {
    tslib_1.__extends(DummyCameraManager, _super);
    function DummyCameraManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DummyCameraManager.prototype.setInteractionOptions = function (_1, _2, _3, _4) {
        return;
    };
    DummyCameraManager.prototype.isCameraSwitcherEnabled = function () {
        return false;
    };
    DummyCameraManager.prototype.setCameraSwitcherEnabled = function (_1) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DummyCameraManager.prototype.isTorchToggleEnabled = function () {
        return false;
    };
    DummyCameraManager.prototype.setTorchToggleEnabled = function (_1) {
        return;
    };
    DummyCameraManager.prototype.isTapToFocusEnabled = function () {
        return false;
    };
    DummyCameraManager.prototype.setTapToFocusEnabled = function (_1) {
        return;
    };
    DummyCameraManager.prototype.isPinchToZoomEnabled = function () {
        return false;
    };
    DummyCameraManager.prototype.setPinchToZoomEnabled = function (_1) {
        return;
    };
    DummyCameraManager.prototype.setInitialCameraType = function (_1) {
        return;
    };
    DummyCameraManager.prototype.setCameraType = function (_1) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DummyCameraManager.prototype.setSelectedCamera = function (_1) {
        return;
    };
    DummyCameraManager.prototype.setSelectedCameraSettings = function (_1) {
        return;
    };
    DummyCameraManager.prototype.setupCameras = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DummyCameraManager.prototype.stopStream = function () {
        return;
    };
    DummyCameraManager.prototype.applyCameraSettings = function (_1) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DummyCameraManager.prototype.reinitializeCamera = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DummyCameraManager.prototype.initializeCameraWithSettings = function (_1, _2) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DummyCameraManager.prototype.setTorchEnabled = function (_1) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DummyCameraManager.prototype.toggleTorch = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DummyCameraManager.prototype.setZoom = function (_1, _2) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return DummyCameraManager;
}(cameraManager_1.CameraManager));
exports.DummyCameraManager = DummyCameraManager;
//# sourceMappingURL=dummyCameraManager.js.map