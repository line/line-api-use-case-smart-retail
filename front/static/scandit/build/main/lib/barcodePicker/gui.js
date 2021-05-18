"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUI = void 0;
var tslib_1 = require("tslib");
var resize_observer_1 = require("@juggle/resize-observer");
/**
 * @hidden
 */
// tslint:disable-next-line: variable-name no-any
var ResizeObserver = (_a = window.ResizeObserver) !== null && _a !== void 0 ? _a : resize_observer_1.ResizeObserver;
var base64assets_1 = require("../assets/base64assets");
var browserHelper_1 = require("../browserHelper");
var camera_1 = require("../camera");
var cameraAccess_1 = require("../cameraAccess");
var imageSettings_1 = require("../imageSettings");
var singleImageModeSettings_1 = require("../singleImageModeSettings");
var barcodePicker_1 = require("./barcodePicker");
var GUI = /** @class */ (function () {
    function GUI(options) {
        var _this = this;
        this.scanner = options.scanner;
        this.originElement = options.originElement;
        this.singleImageModeEnabled = options.singleImageModeEnabled;
        this.singleImageModeSettings = options.singleImageModeSettings;
        this.scanningPaused = options.scanningPaused;
        this.cameraUploadCallback = options.cameraUploadCallback;
        this.mirrorImageOverrides = new Map();
        this.cameraUploadInProgress = false;
        this.cameraSwitchInProgress = false;
        this.engineContextCreated = false;
        this.grandParentElement = document.createElement("div");
        this.grandParentElement.className = GUI.grandParentElementClassName;
        this.originElement.appendChild(this.grandParentElement);
        this.parentElement = document.createElement("div");
        this.parentElement.className = GUI.parentElementClassName;
        this.grandParentElement.appendChild(this.parentElement);
        this.videoElement = document.createElement("video");
        this.cameraSwitcherElement = document.createElement("img");
        this.torchTogglerElement = document.createElement("img");
        this.laserContainerElement = document.createElement("div");
        this.laserActiveImageElement = document.createElement("img");
        this.laserPausedImageElement = document.createElement("img");
        this.viewfinderElement = document.createElement("div");
        var canvas = document.createElement("canvas");
        if (options.singleImageModeEnabled) {
            this.context2d = canvas.getContext("2d");
            this.cameraUploadElement = document.createElement("div");
            this.cameraUploadLabelElement = document.createElement("label");
            this.cameraUploadInputElement = document.createElement("input");
            this.cameraUploadProgressElement = document.createElement("div");
            this.setupCameraUploadGuiAssets();
            this.guiStyle = barcodePicker_1.BarcodePicker.GuiStyle.NONE;
        }
        else {
            this.setupContext(canvas);
            this.setupVideoElement();
            this.setupCameraSwitcher();
            this.setupTorchToggler();
            this.setupFullGuiAssets();
            this.setGuiStyle(options.guiStyle);
            this.setVideoFit(options.videoFit);
            this.setLaserArea(options.laserArea);
            this.setViewfinderArea(options.viewfinderArea);
            // Ensure the camera is accessed and the video plays again correctly when visibility changes
            this.visibilityListener = this.checkAndRecoverPlayback.bind(this);
            document.addEventListener("visibilitychange", this.visibilityListener);
            this.newScanSettingsListener = this.handleNewScanSettings.bind(this);
            this.scanner.on("newScanSettings", this.newScanSettingsListener);
            this.handleNewScanSettings();
            this.videoPauseListener = this.handleVideoPause.bind(this);
            this.videoElement.addEventListener("pause", this.videoPauseListener);
            this.videoResizeListener = this.handleVideoResize.bind(this);
            this.videoElement.addEventListener("resize", this.videoResizeListener);
        }
        if (options.hideLogo) {
            this.contextCreatedShowLogoListener = this.showScanditLogo.bind(this, options.hideLogo);
            this.scanner.on("contextCreated", this.contextCreatedShowLogoListener);
        }
        else {
            this.showScanditLogo(options.hideLogo);
        }
        this.contextCreatedActivateGUIListener = this.activateGUI.bind(this);
        this.scanner.on("contextCreated", this.contextCreatedActivateGUIListener);
        this.resize();
        this.resizeObserver = new ResizeObserver(
        /* istanbul ignore next */ function () {
            _this.resize();
        });
        this.resizeObserver.observe(this.originElement);
        this.setVisible(options.visible);
    }
    GUI.prototype.destroy = function () {
        if (this.visibilityListener != null) {
            document.removeEventListener("visibilitychange", this.visibilityListener);
        }
        if (this.newScanSettingsListener != null) {
            this.scanner.removeListener("newScanSettings", this.newScanSettingsListener);
        }
        if (this.videoPauseListener != null) {
            this.videoElement.removeEventListener("pause", this.videoPauseListener);
        }
        if (this.videoResizeListener != null) {
            this.videoElement.removeEventListener("resize", this.videoResizeListener);
        }
        if (this.contextCreatedShowLogoListener != null) {
            this.scanner.removeListener("contextCreated", this.contextCreatedShowLogoListener);
        }
        if (this.contextCreatedActivateGUIListener != null) {
            this.scanner.removeListener("contextCreated", this.contextCreatedActivateGUIListener);
        }
        this.resizeObserver.disconnect();
        this.grandParentElement.remove();
        this.originElement.classList.remove(GUI.hiddenClassName);
    };
    GUI.prototype.setCameraManager = function (cameraManager) {
        this.cameraManager = cameraManager;
    };
    GUI.prototype.pauseScanning = function () {
        this.scanningPaused = true;
        this.laserActiveImageElement.classList.add(GUI.hiddenOpacityClassName);
        this.laserPausedImageElement.classList.remove(GUI.hiddenOpacityClassName);
        this.viewfinderElement.classList.add(GUI.pausedClassName);
    };
    GUI.prototype.resumeScanning = function () {
        this.scanningPaused = false;
        if (this.engineContextCreated) {
            this.laserPausedImageElement.classList.add(GUI.hiddenOpacityClassName);
            this.laserActiveImageElement.classList.remove(GUI.hiddenOpacityClassName);
            this.viewfinderElement.classList.remove(GUI.pausedClassName);
        }
    };
    GUI.prototype.isVisible = function () {
        return this.visible;
    };
    GUI.prototype.setVisible = function (visible) {
        this.visible = visible;
        if (visible) {
            this.originElement.classList.remove(GUI.hiddenClassName);
            if (this.guiStyle === barcodePicker_1.BarcodePicker.GuiStyle.LASER) {
                this.laserActiveImageElement.classList.remove(GUI.flashColorClassName);
            }
            else if (this.guiStyle === barcodePicker_1.BarcodePicker.GuiStyle.VIEWFINDER) {
                this.viewfinderElement.classList.remove(GUI.flashWhiteClassName);
            }
        }
        else {
            this.originElement.classList.add(GUI.hiddenClassName);
        }
    };
    GUI.prototype.isMirrorImageEnabled = function () {
        var _a, _b;
        if (((_a = this.cameraManager) === null || _a === void 0 ? void 0 : _a.selectedCamera) != null && ((_b = this.cameraManager) === null || _b === void 0 ? void 0 : _b.activeCamera) != null) {
            var mirrorImageOverride = this.mirrorImageOverrides.get(this.cameraManager.activeCamera);
            return mirrorImageOverride !== null && mirrorImageOverride !== void 0 ? mirrorImageOverride : this.cameraManager.activeCamera.cameraType === camera_1.Camera.Type.FRONT;
        }
        else {
            return false;
        }
    };
    GUI.prototype.setMirrorImageEnabled = function (enabled, override) {
        var _a;
        if (((_a = this.cameraManager) === null || _a === void 0 ? void 0 : _a.selectedCamera) != null) {
            if (enabled) {
                this.videoElement.classList.add(GUI.mirroredClassName);
            }
            else {
                this.videoElement.classList.remove(GUI.mirroredClassName);
            }
            if (override) {
                this.mirrorImageOverrides.set(this.cameraManager.selectedCamera, enabled);
            }
        }
    };
    GUI.prototype.setGuiStyle = function (guiStyle) {
        if (this.singleImageModeEnabled) {
            return;
        }
        switch (guiStyle) {
            case barcodePicker_1.BarcodePicker.GuiStyle.LASER:
                this.guiStyle = guiStyle;
                this.laserContainerElement.classList.remove(GUI.hiddenClassName);
                this.viewfinderElement.classList.add(GUI.hiddenClassName);
                break;
            case barcodePicker_1.BarcodePicker.GuiStyle.VIEWFINDER:
                this.guiStyle = guiStyle;
                this.laserContainerElement.classList.add(GUI.hiddenClassName);
                this.viewfinderElement.classList.remove(GUI.hiddenClassName);
                break;
            case barcodePicker_1.BarcodePicker.GuiStyle.NONE:
            default:
                this.guiStyle = barcodePicker_1.BarcodePicker.GuiStyle.NONE;
                this.laserContainerElement.classList.add(GUI.hiddenClassName);
                this.viewfinderElement.classList.add(GUI.hiddenClassName);
                break;
        }
    };
    GUI.prototype.setLaserArea = function (area) {
        this.customLaserArea = area;
        if (area == null) {
            area = this.scanner.getScanSettings().getSearchArea();
        }
        var borderPercentage = 0.025;
        var usablePercentage = 1 - borderPercentage * 2;
        this.laserContainerElement.style.left = (borderPercentage + area.x * usablePercentage) * 100 + "%";
        this.laserContainerElement.style.width = area.width * usablePercentage * 100 + "%";
        this.laserContainerElement.style.top = (borderPercentage + area.y * usablePercentage) * 100 + "%";
        this.laserContainerElement.style.height = area.height * usablePercentage * 100 + "%";
    };
    GUI.prototype.setViewfinderArea = function (area) {
        this.customViewfinderArea = area;
        if (area == null) {
            area = this.scanner.getScanSettings().getSearchArea();
        }
        var borderPercentage = 0.025;
        var usablePercentage = 1 - borderPercentage * 2;
        this.viewfinderElement.style.left = (borderPercentage + area.x * usablePercentage) * 100 + "%";
        this.viewfinderElement.style.width = area.width * usablePercentage * 100 + "%";
        this.viewfinderElement.style.top = (borderPercentage + area.y * usablePercentage) * 100 + "%";
        this.viewfinderElement.style.height = area.height * usablePercentage * 100 + "%";
    };
    GUI.prototype.setVideoFit = function (objectFit) {
        if (this.singleImageModeEnabled) {
            return;
        }
        this.videoFit = objectFit;
        if (objectFit === barcodePicker_1.BarcodePicker.ObjectFit.COVER) {
            this.videoElement.style.objectFit = "cover";
            this.videoElement.dataset.objectFit = "cover"; // used by "objectFitPolyfill" library
        }
        else {
            this.videoElement.style.objectFit = "contain";
            this.videoElement.dataset.objectFit = "contain"; // used by "objectFitPolyfill" library
            this.scanner.applyScanSettings(this.scanner.getScanSettings().setBaseSearchArea({ x: 0, y: 0, width: 1.0, height: 1.0 }));
        }
        this.resize();
    };
    GUI.prototype.reassignOriginElement = function (originElement) {
        if (!this.visible) {
            this.originElement.classList.remove(GUI.hiddenClassName);
            originElement.classList.add(GUI.hiddenClassName);
        }
        originElement.appendChild(this.grandParentElement);
        this.checkAndRecoverPlayback().catch(
        /* istanbul ignore next */ function () {
            // Ignored
        });
        this.resize();
        this.resizeObserver.disconnect();
        this.resizeObserver.observe(originElement);
        this.originElement = originElement;
    };
    GUI.prototype.flashGUI = function () {
        if (this.guiStyle === barcodePicker_1.BarcodePicker.GuiStyle.LASER) {
            this.flashLaser();
        }
        else if (this.guiStyle === barcodePicker_1.BarcodePicker.GuiStyle.VIEWFINDER) {
            this.flashViewfinder();
        }
    };
    GUI.prototype.getImageData = function (imageData) {
        function isVideoAndContextStateValid(videoElement, context) {
            // This could happen in unexpected situations and should be temporary
            return (videoElement.readyState === 4 &&
                videoElement.videoWidth > 2 &&
                videoElement.videoHeight > 2 &&
                context.canvas.width > 2 &&
                context.canvas.height > 2);
        }
        if (this.singleImageModeEnabled && this.context2d != null) {
            return new Uint8Array(this.context2d.getImageData(0, 0, this.context2d.canvas.width, this.context2d.canvas.height).data.buffer);
        }
        // istanbul ignore else
        if (!this.singleImageModeEnabled) {
            if (this.contextWebGL != null) {
                if (!isVideoAndContextStateValid(this.videoElement, this.contextWebGL) ||
                    this.contextWebGL.drawingBufferWidth <= 2 ||
                    this.contextWebGL.drawingBufferHeight <= 2) {
                    return;
                }
                var imageDataLength = this.contextWebGL.drawingBufferWidth * this.contextWebGL.drawingBufferHeight * 4;
                if (imageData == null || imageData.byteLength === 0 || imageData.byteLength !== imageDataLength) {
                    imageData = new Uint8Array(imageDataLength);
                }
                this.contextWebGL.texImage2D(this.contextWebGL.TEXTURE_2D, 0, this.contextWebGL.RGBA, this.contextWebGL.RGBA, this.contextWebGL.UNSIGNED_BYTE, this.videoElement);
                this.contextWebGL.readPixels(0, 0, this.contextWebGL.drawingBufferWidth, this.contextWebGL.drawingBufferHeight, this.contextWebGL.RGBA, this.contextWebGL.UNSIGNED_BYTE, imageData);
                return imageData;
            }
            // istanbul ignore else
            if (this.context2d != null) {
                if (!isVideoAndContextStateValid(this.videoElement, this.context2d)) {
                    return;
                }
                this.context2d.drawImage(this.videoElement, 0, 0);
                return new Uint8Array(this.context2d.getImageData(0, 0, this.context2d.canvas.width, this.context2d.canvas.height).data.buffer);
            }
        }
        // istanbul ignore next
        return;
    };
    GUI.prototype.getVideoCurrentTime = function () {
        return this.videoElement.currentTime;
    };
    GUI.prototype.setCameraSwitcherVisible = function (visible) {
        if (visible) {
            this.cameraSwitcherElement.classList.remove(GUI.hiddenClassName);
        }
        else {
            this.cameraSwitcherElement.classList.add(GUI.hiddenClassName);
        }
    };
    GUI.prototype.setTorchTogglerVisible = function (visible) {
        if (visible) {
            this.torchTogglerElement.classList.remove(GUI.hiddenClassName);
        }
        else {
            this.torchTogglerElement.classList.add(GUI.hiddenClassName);
        }
    };
    GUI.prototype.playVideo = function () {
        var playPromise = this.videoElement.play();
        playPromise === null || playPromise === void 0 ? void 0 : playPromise.catch(
        /* istanbul ignore next */ function () {
            // Can sometimes cause an incorrect rejection (all is good, ignore).
        });
    };
    GUI.prototype.setCameraType = function (cameraType) {
        var _a;
        (_a = this.cameraUploadInputElement) === null || _a === void 0 ? void 0 : _a.setAttribute("capture", cameraType === camera_1.Camera.Type.FRONT ? "user" : "environment");
    };
    GUI.prototype.setCameraUploadGuiBusyScanning = function (busyScanning) {
        if (busyScanning) {
            this.cameraUploadProgressElement.classList.remove(GUI.flashInsetClassName);
            this.cameraUploadElement.classList.add(GUI.opacityPulseClassName);
        }
        else {
            this.cameraUploadProgressElement.classList.add(GUI.flashInsetClassName);
            this.cameraUploadElement.classList.remove(GUI.opacityPulseClassName);
        }
    };
    GUI.prototype.setupContext = function (canvas) {
        var _this = this;
        var context = canvas.getContext("webgl", { alpha: false, antialias: false });
        // istanbul ignore if
        if (context == null) {
            context = canvas.getContext("experimental-webgl", { alpha: false, antialias: false });
        }
        if (context != null) {
            this.setupWebGL(context);
            canvas.addEventListener("webglcontextlost", function () {
                // We recreate instead of waiting for restore via the webglcontextrestored event as restore might never happen
                console.warn("WebGL context has been lost, restoring...");
                _this.contextWebGL = undefined;
                _this.setupContext(document.createElement("canvas"));
                _this.handleVideoResize();
                console.warn("WebGL context restored");
            });
        }
        else {
            this.context2d = canvas.getContext("2d");
        }
    };
    GUI.prototype.setupWebGL = function (contextWebGL) {
        var texture = contextWebGL.createTexture();
        contextWebGL.bindTexture(contextWebGL.TEXTURE_2D, texture);
        var frameBuffer = contextWebGL.createFramebuffer();
        contextWebGL.bindFramebuffer(contextWebGL.FRAMEBUFFER, frameBuffer);
        contextWebGL.framebufferTexture2D(contextWebGL.FRAMEBUFFER, contextWebGL.COLOR_ATTACHMENT0, contextWebGL.TEXTURE_2D, texture, 0);
        contextWebGL.texParameteri(contextWebGL.TEXTURE_2D, contextWebGL.TEXTURE_WRAP_S, contextWebGL.CLAMP_TO_EDGE);
        contextWebGL.texParameteri(contextWebGL.TEXTURE_2D, contextWebGL.TEXTURE_WRAP_T, contextWebGL.CLAMP_TO_EDGE);
        contextWebGL.texParameteri(contextWebGL.TEXTURE_2D, contextWebGL.TEXTURE_MIN_FILTER, contextWebGL.NEAREST);
        contextWebGL.texParameteri(contextWebGL.TEXTURE_2D, contextWebGL.TEXTURE_MAG_FILTER, contextWebGL.NEAREST);
        this.contextWebGL = contextWebGL;
    };
    GUI.prototype.setupVideoElement = function () {
        this.videoElement.setAttribute("autoplay", "autoplay");
        this.videoElement.setAttribute("playsinline", "true");
        this.videoElement.setAttribute("muted", "muted");
        this.videoElement.className = GUI.videoElementClassName;
        this.parentElement.appendChild(this.videoElement);
    };
    GUI.prototype.setupCameraUploadGuiAssets = function () {
        var _this = this;
        var _a, _b;
        var deviceType = browserHelper_1.BrowserHelper.userAgentInfo.getDevice().type;
        var defaultSettings = deviceType === "mobile" || deviceType === "tablet"
            ? singleImageModeSettings_1.SingleImageModeSettings.defaultMobile
            : singleImageModeSettings_1.SingleImageModeSettings.defaultDesktop;
        this.cameraUploadElement.className = GUI.cameraUploadElementClassName;
        Object.assign(this.cameraUploadElement.style, defaultSettings.containerStyle, this.singleImageModeSettings.containerStyle);
        this.parentElement.appendChild(this.cameraUploadElement);
        var informationElement = (_a = this.singleImageModeSettings.informationElement) !== null && _a !== void 0 ? _a : defaultSettings.informationElement;
        Object.assign(informationElement.style, defaultSettings.informationStyle, this.singleImageModeSettings.informationStyle);
        this.cameraUploadElement.appendChild(informationElement);
        this.cameraUploadInputElement.type = "file";
        this.cameraUploadInputElement.accept = "image/*";
        this.cameraUploadInputElement.addEventListener("change", this.cameraUploadFile.bind(this));
        var cameraUploadInputCheckFunction = function (event) {
            // istanbul ignore next
            if (_this.scanningPaused || _this.cameraUploadInProgress) {
                event.preventDefault();
            }
        };
        this.cameraUploadInputElement.addEventListener("click", cameraUploadInputCheckFunction);
        this.cameraUploadInputElement.addEventListener("keydown", cameraUploadInputCheckFunction);
        this.cameraUploadLabelElement.appendChild(this.cameraUploadInputElement);
        var cameraUploadButtonIconElement = (_b = this.singleImageModeSettings.buttonElement) !== null && _b !== void 0 ? _b : defaultSettings.buttonElement;
        [this.cameraUploadProgressElement.style, cameraUploadButtonIconElement.style].forEach(function (style) {
            Object.assign(style, defaultSettings.buttonStyle, _this.singleImageModeSettings.buttonStyle);
        });
        cameraUploadButtonIconElement.style.maxWidth = "100px";
        cameraUploadButtonIconElement.style.maxHeight = "100px";
        this.cameraUploadLabelElement.appendChild(cameraUploadButtonIconElement);
        this.cameraUploadProgressElement.classList.add("radial-progress");
        this.cameraUploadLabelElement.appendChild(this.cameraUploadProgressElement);
        this.cameraUploadElement.appendChild(this.cameraUploadLabelElement);
    };
    GUI.prototype.setupFullGuiAssets = function () {
        this.laserActiveImageElement.src = base64assets_1.laserActiveImage;
        this.laserContainerElement.appendChild(this.laserActiveImageElement);
        this.laserPausedImageElement.src = base64assets_1.laserPausedImage;
        this.laserContainerElement.appendChild(this.laserPausedImageElement);
        this.laserContainerElement.className = GUI.laserContainerElementClassName;
        this.parentElement.appendChild(this.laserContainerElement);
        this.viewfinderElement.className = GUI.viewfinderElementClassName;
        this.parentElement.appendChild(this.viewfinderElement);
        // Show inactive GUI, as for now the scanner isn't ready yet
        this.laserActiveImageElement.classList.add(GUI.hiddenOpacityClassName);
        this.laserPausedImageElement.classList.remove(GUI.hiddenOpacityClassName);
        this.viewfinderElement.classList.add(GUI.pausedClassName);
    };
    GUI.prototype.flashLaser = function () {
        this.laserActiveImageElement.classList.remove(GUI.flashColorClassName);
        // tslint:disable-next-line:no-unused-expression
        this.laserActiveImageElement.offsetHeight; // NOSONAR // Trigger reflow to restart animation
        this.laserActiveImageElement.classList.add(GUI.flashColorClassName);
    };
    GUI.prototype.flashViewfinder = function () {
        this.viewfinderElement.classList.remove(GUI.flashWhiteClassName);
        // tslint:disable-next-line:no-unused-expression
        this.viewfinderElement.offsetHeight; // NOSONAR // Trigger reflow to restart animation
        this.viewfinderElement.classList.add(GUI.flashWhiteClassName);
    };
    GUI.prototype.resize = function () {
        this.parentElement.style.maxWidth = "";
        this.parentElement.style.maxHeight = "";
        var width = this.originElement.clientWidth;
        var height = this.originElement.clientHeight;
        if (width === 0 || height === 0) {
            if (!this.singleImageModeEnabled) {
                this.handleVideoDisplay(true);
            }
            return;
        }
        if (this.singleImageModeEnabled) {
            this.resizeCameraUpload(width, height);
        }
        else {
            this.resizeVideo(width, height);
            this.handleVideoDisplay(false);
        }
    };
    GUI.prototype.resizeCameraUpload = function (width, height) {
        this.cameraUploadLabelElement.style.transform = "scale(" + Math.min(1, width / 300, height / 300) + ")";
    };
    GUI.prototype.resizeVideo = function (width, height) {
        if (this.videoElement.videoWidth <= 2 || this.videoElement.videoHeight <= 2) {
            return;
        }
        var videoRatio = this.videoElement.videoWidth / this.videoElement.videoHeight;
        if (this.videoFit === barcodePicker_1.BarcodePicker.ObjectFit.COVER) {
            var widthPercentage = 1;
            var heightPercentage = 1;
            if (videoRatio < width / height) {
                heightPercentage = Math.min(1, height / (width / videoRatio));
            }
            else {
                widthPercentage = Math.min(1, width / (height * videoRatio));
            }
            this.scanner.applyScanSettings(this.scanner.getScanSettings().setBaseSearchArea({
                x: (1 - widthPercentage) / 2,
                y: (1 - heightPercentage) / 2,
                width: widthPercentage,
                height: heightPercentage,
            }));
            return;
        }
        if (videoRatio > width / height) {
            height = width / videoRatio;
        }
        else {
            width = height * videoRatio;
        }
        this.parentElement.style.maxWidth = Math.ceil(width) + "px";
        this.parentElement.style.maxHeight = Math.ceil(height) + "px";
        window.objectFitPolyfill(this.videoElement);
    };
    GUI.prototype.checkAndRecoverPlayback = function () {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(document.visibilityState === "visible" &&
                            ((_a = this.cameraManager) === null || _a === void 0 ? void 0 : _a.activeCamera) != null &&
                            ((_b = this.videoElement) === null || _b === void 0 ? void 0 : _b.srcObject) != null)) return [3 /*break*/, 6];
                        if (!!this.videoElement.srcObject.active) return [3 /*break*/, 5];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        console.debug('Detected visibility change ("visible") event with inactive video source, try to reinitialize camera');
                        return [4 /*yield*/, this.cameraManager.reinitializeCamera()];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _c = _d.sent();
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        console.debug('Detected visibility change ("visible") event with active video source, replay video');
                        this.playVideo();
                        _d.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    GUI.prototype.updateCameraUploadProgress = function (progressPercentageValue) {
        this.cameraUploadProgressElement.setAttribute("data-progress", progressPercentageValue);
    };
    GUI.prototype.cameraUploadImageLoad = function (image) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var resizedImageWidth, resizedImageHeight, resizedImageSizeLimit;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.updateCameraUploadProgress("100");
                        resizedImageSizeLimit = 1440;
                        if (image.naturalWidth <= resizedImageSizeLimit && image.naturalHeight <= resizedImageSizeLimit) {
                            resizedImageWidth = image.naturalWidth;
                            resizedImageHeight = image.naturalHeight;
                        }
                        else {
                            if (image.naturalWidth > image.naturalHeight) {
                                resizedImageWidth = resizedImageSizeLimit;
                                resizedImageHeight = Math.round((image.naturalHeight / image.naturalWidth) * resizedImageSizeLimit);
                            }
                            else {
                                resizedImageWidth = Math.round((image.naturalWidth / image.naturalHeight) * resizedImageSizeLimit);
                                resizedImageHeight = resizedImageSizeLimit;
                            }
                        }
                        return [4 /*yield*/, this.cameraUploadFileProcess(image, resizedImageWidth, resizedImageHeight)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GUI.prototype.cameraUploadFileProcess = function (image, width, height) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // istanbul ignore else
                        if (this.context2d != null) {
                            this.context2d.canvas.width = width;
                            this.context2d.canvas.height = height;
                            this.context2d.drawImage(image, 0, 0, width, height);
                            this.scanner.applyImageSettings({
                                width: width,
                                height: height,
                                format: imageSettings_1.ImageSettings.Format.RGBA_8U,
                            });
                        }
                        this.setCameraUploadGuiBusyScanning(true);
                        return [4 /*yield*/, this.cameraUploadCallback()];
                    case 1:
                        _a.sent();
                        this.setCameraUploadGuiBusyScanning(false);
                        this.cameraUploadInProgress = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    GUI.prototype.cameraUploadFile = function () {
        var _this = this;
        var files = this.cameraUploadInputElement.files;
        if (files != null && files.length !== 0) {
            this.cameraUploadInProgress = true;
            var image_1 = new Image();
            var fileReader_1 = new FileReader();
            fileReader_1.onload = function () {
                _this.cameraUploadInputElement.value = "";
                // istanbul ignore else
                if (fileReader_1.result != null) {
                    image_1.onload = _this.cameraUploadImageLoad.bind(_this, image_1);
                    image_1.onprogress = function (event2) {
                        // istanbul ignore else
                        if (event2.lengthComputable) {
                            var progress = Math.round((event2.loaded / event2.total) * 20) * 5;
                            // istanbul ignore else
                            if (progress <= 100) {
                                _this.updateCameraUploadProgress(progress.toString());
                            }
                        }
                    };
                    image_1.onerror = function () {
                        _this.cameraUploadInProgress = false;
                    };
                    image_1.src = fileReader_1.result;
                }
            };
            fileReader_1.onerror = function () {
                _this.cameraUploadInProgress = false;
            };
            this.updateCameraUploadProgress("0");
            fileReader_1.readAsDataURL(files[0]);
        }
    };
    GUI.prototype.cameraSwitcherListener = function (event) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cameraManager, cameras, currentCameraIndex, newCameraIndex, error_1, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!this.cameraSwitchInProgress && this.cameraManager != null)) return [3 /*break*/, 12];
                        cameraManager = this.cameraManager;
                        event.preventDefault();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 11, , 12]);
                        return [4 /*yield*/, cameraAccess_1.CameraAccess.getCameras()];
                    case 2:
                        cameras = _a.sent();
                        if (cameraManager.activeCamera == null) {
                            return [2 /*return*/];
                        }
                        if (cameras.length <= 1) {
                            this.setCameraSwitcherVisible(false);
                            return [2 /*return*/];
                        }
                        this.cameraSwitchInProgress = true;
                        currentCameraIndex = cameras.indexOf(cameraManager.activeCamera);
                        newCameraIndex = (currentCameraIndex + 1) % cameras.length;
                        _a.label = 3;
                    case 3:
                        if (!(newCameraIndex !== currentCameraIndex)) return [3 /*break*/, 10];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 9]);
                        return [4 /*yield*/, cameraManager.initializeCameraWithSettings(cameras[newCameraIndex], cameraManager.activeCameraSettings)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        error_1 = _a.sent();
                        console.warn("Couldn't access camera:", cameras[newCameraIndex], error_1);
                        newCameraIndex = (newCameraIndex + 1) % cameras.length;
                        if (!(newCameraIndex === currentCameraIndex)) return [3 /*break*/, 8];
                        this.setCameraSwitcherVisible(false);
                        return [4 /*yield*/, cameraManager.initializeCameraWithSettings(cameras[newCameraIndex], cameraManager.activeCameraSettings)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [3 /*break*/, 3];
                    case 9: return [3 /*break*/, 10];
                    case 10:
                        this.cameraSwitchInProgress = false;
                        return [3 /*break*/, 12];
                    case 11:
                        error_2 = _a.sent();
                        console.error(error_2);
                        this.cameraSwitchInProgress = false;
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    GUI.prototype.setupCameraSwitcher = function () {
        var _this = this;
        this.cameraSwitcherElement.src = base64assets_1.switchCameraImage;
        this.cameraSwitcherElement.className = GUI.cameraSwitcherElementClassName;
        this.cameraSwitcherElement.classList.add(GUI.hiddenClassName);
        this.parentElement.appendChild(this.cameraSwitcherElement);
        ["touchstart", "mousedown"].forEach(function (eventName) {
            _this.cameraSwitcherElement.addEventListener(eventName, _this.cameraSwitcherListener.bind(_this));
        });
    };
    GUI.prototype.setupTorchToggler = function () {
        var _this = this;
        this.torchTogglerElement.src = base64assets_1.toggleTorchImage;
        this.torchTogglerElement.className = GUI.torchTogglerElementClassName;
        this.torchTogglerElement.classList.add(GUI.hiddenClassName);
        this.parentElement.appendChild(this.torchTogglerElement);
        ["touchstart", "mousedown"].forEach(function (eventName) {
            _this.torchTogglerElement.addEventListener(eventName, function (event) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.cameraManager != null)) return [3 /*break*/, 2];
                            event.preventDefault();
                            return [4 /*yield*/, this.cameraManager.toggleTorch()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    GUI.prototype.showScanditLogo = function (hideLogo, licenseKeyFeatures) {
        if (hideLogo && (licenseKeyFeatures === null || licenseKeyFeatures === void 0 ? void 0 : licenseKeyFeatures.hiddenScanditLogoAllowed) === true) {
            return;
        }
        var scanditLogoImageElement = document.createElement("img");
        scanditLogoImageElement.src = base64assets_1.scanditLogoImage;
        scanditLogoImageElement.className = GUI.scanditLogoImageElementClassName;
        this.parentElement.appendChild(scanditLogoImageElement);
    };
    GUI.prototype.activateGUI = function () {
        this.engineContextCreated = true;
        if (!this.scanningPaused) {
            this.resumeScanning();
        }
    };
    GUI.prototype.handleNewScanSettings = function () {
        if (this.customLaserArea == null) {
            this.setLaserArea();
        }
        if (this.customViewfinderArea == null) {
            this.setViewfinderArea();
        }
    };
    GUI.prototype.handleVideoDisplay = function (hidden) {
        // Safari on iOS 14 behaves weirdly when hiding the video element:
        // it stops camera access after a few seconds if the related video element is not "visible".
        // We do the following to maintain the video element "visible" but actually hidden.
        var detachedVideoElement = this.videoElement.offsetParent === document.body;
        if (hidden && !detachedVideoElement) {
            this.videoElement.width = this.videoElement.height = 0;
            this.videoElement.style.opacity = "0";
            document.body.appendChild(this.videoElement);
        }
        else if (!hidden && detachedVideoElement) {
            this.parentElement.insertAdjacentElement("afterbegin", this.videoElement);
            this.videoElement.removeAttribute("width");
            this.videoElement.removeAttribute("height");
            this.videoElement.style.removeProperty("opacity");
            this.resize();
        }
    };
    GUI.prototype.handleVideoPause = function () {
        // Safari behaves weirdly when displaying the video element again after hiding it:
        // it pauses the video on hide and resumes it on show, then reusing video frames "buffered" from the video just
        // before it was hidden. We do the following to avoid processing old data.
        this.playVideo();
    };
    GUI.prototype.handleVideoResize = function () {
        this.resize();
        if (this.videoElement.videoWidth <= 2 || this.videoElement.videoHeight <= 2) {
            return;
        }
        if (this.contextWebGL != null) {
            if (this.contextWebGL.canvas.width === this.videoElement.videoWidth &&
                this.contextWebGL.canvas.height === this.videoElement.videoHeight) {
                return;
            }
            this.contextWebGL.canvas.width = this.videoElement.videoWidth;
            this.contextWebGL.canvas.height = this.videoElement.videoHeight;
            this.contextWebGL.viewport(0, 0, this.contextWebGL.drawingBufferWidth, this.contextWebGL.drawingBufferHeight);
            this.scanner.applyImageSettings({
                width: this.contextWebGL.drawingBufferWidth,
                height: this.contextWebGL.drawingBufferHeight,
                format: imageSettings_1.ImageSettings.Format.RGBA_8U,
            });
        }
        else if (this.context2d != null) {
            if (this.context2d.canvas.width === this.videoElement.videoWidth &&
                this.context2d.canvas.height === this.videoElement.videoHeight) {
                return;
            }
            this.context2d.canvas.width = this.videoElement.videoWidth;
            this.context2d.canvas.height = this.videoElement.videoHeight;
            this.scanner.applyImageSettings({
                width: this.videoElement.videoWidth,
                height: this.videoElement.videoHeight,
                format: imageSettings_1.ImageSettings.Format.RGBA_8U,
            });
        }
    };
    GUI.grandParentElementClassName = "scandit scandit-container";
    GUI.parentElementClassName = "scandit scandit-barcode-picker";
    GUI.hiddenClassName = "scandit-hidden";
    GUI.hiddenOpacityClassName = "scandit-hidden-opacity";
    GUI.videoElementClassName = "scandit-video";
    GUI.scanditLogoImageElementClassName = "scandit-logo";
    GUI.laserContainerElementClassName = "scandit-laser";
    GUI.viewfinderElementClassName = "scandit-viewfinder";
    GUI.cameraSwitcherElementClassName = "scandit-camera-switcher";
    GUI.torchTogglerElementClassName = "scandit-torch-toggle";
    GUI.cameraUploadElementClassName = "scandit-camera-upload";
    GUI.flashColorClassName = "scandit-flash-color";
    GUI.flashWhiteClassName = "scandit-flash-white";
    GUI.flashInsetClassName = "scandit-flash-inset";
    GUI.opacityPulseClassName = "scandit-opacity-pulse";
    GUI.mirroredClassName = "mirrored";
    GUI.pausedClassName = "paused";
    return GUI;
}());
exports.GUI = GUI;
//# sourceMappingURL=gui.js.map