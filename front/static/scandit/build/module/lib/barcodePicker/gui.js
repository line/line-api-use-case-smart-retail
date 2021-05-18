import { ResizeObserver as ResizeObserverPolyfill } from "@juggle/resize-observer";
/**
 * @hidden
 */
// tslint:disable-next-line: variable-name no-any
const ResizeObserver = window.ResizeObserver ?? ResizeObserverPolyfill;
import { laserActiveImage, laserPausedImage, scanditLogoImage, switchCameraImage, toggleTorchImage, } from "../assets/base64assets";
import { BrowserHelper } from "../browserHelper";
import { Camera } from "../camera";
import { CameraAccess } from "../cameraAccess";
import { ImageSettings } from "../imageSettings";
import { SingleImageModeSettings } from "../singleImageModeSettings";
import { BarcodePicker } from "./barcodePicker";
export class GUI {
    constructor(options) {
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
        const canvas = document.createElement("canvas");
        if (options.singleImageModeEnabled) {
            this.context2d = canvas.getContext("2d");
            this.cameraUploadElement = document.createElement("div");
            this.cameraUploadLabelElement = document.createElement("label");
            this.cameraUploadInputElement = document.createElement("input");
            this.cameraUploadProgressElement = document.createElement("div");
            this.setupCameraUploadGuiAssets();
            this.guiStyle = BarcodePicker.GuiStyle.NONE;
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
        /* istanbul ignore next */ () => {
            this.resize();
        });
        this.resizeObserver.observe(this.originElement);
        this.setVisible(options.visible);
    }
    destroy() {
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
    }
    setCameraManager(cameraManager) {
        this.cameraManager = cameraManager;
    }
    pauseScanning() {
        this.scanningPaused = true;
        this.laserActiveImageElement.classList.add(GUI.hiddenOpacityClassName);
        this.laserPausedImageElement.classList.remove(GUI.hiddenOpacityClassName);
        this.viewfinderElement.classList.add(GUI.pausedClassName);
    }
    resumeScanning() {
        this.scanningPaused = false;
        if (this.engineContextCreated) {
            this.laserPausedImageElement.classList.add(GUI.hiddenOpacityClassName);
            this.laserActiveImageElement.classList.remove(GUI.hiddenOpacityClassName);
            this.viewfinderElement.classList.remove(GUI.pausedClassName);
        }
    }
    isVisible() {
        return this.visible;
    }
    setVisible(visible) {
        this.visible = visible;
        if (visible) {
            this.originElement.classList.remove(GUI.hiddenClassName);
            if (this.guiStyle === BarcodePicker.GuiStyle.LASER) {
                this.laserActiveImageElement.classList.remove(GUI.flashColorClassName);
            }
            else if (this.guiStyle === BarcodePicker.GuiStyle.VIEWFINDER) {
                this.viewfinderElement.classList.remove(GUI.flashWhiteClassName);
            }
        }
        else {
            this.originElement.classList.add(GUI.hiddenClassName);
        }
    }
    isMirrorImageEnabled() {
        if (this.cameraManager?.selectedCamera != null && this.cameraManager?.activeCamera != null) {
            const mirrorImageOverride = this.mirrorImageOverrides.get(this.cameraManager.activeCamera);
            return mirrorImageOverride ?? this.cameraManager.activeCamera.cameraType === Camera.Type.FRONT;
        }
        else {
            return false;
        }
    }
    setMirrorImageEnabled(enabled, override) {
        if (this.cameraManager?.selectedCamera != null) {
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
    }
    setGuiStyle(guiStyle) {
        if (this.singleImageModeEnabled) {
            return;
        }
        switch (guiStyle) {
            case BarcodePicker.GuiStyle.LASER:
                this.guiStyle = guiStyle;
                this.laserContainerElement.classList.remove(GUI.hiddenClassName);
                this.viewfinderElement.classList.add(GUI.hiddenClassName);
                break;
            case BarcodePicker.GuiStyle.VIEWFINDER:
                this.guiStyle = guiStyle;
                this.laserContainerElement.classList.add(GUI.hiddenClassName);
                this.viewfinderElement.classList.remove(GUI.hiddenClassName);
                break;
            case BarcodePicker.GuiStyle.NONE:
            default:
                this.guiStyle = BarcodePicker.GuiStyle.NONE;
                this.laserContainerElement.classList.add(GUI.hiddenClassName);
                this.viewfinderElement.classList.add(GUI.hiddenClassName);
                break;
        }
    }
    setLaserArea(area) {
        this.customLaserArea = area;
        if (area == null) {
            area = this.scanner.getScanSettings().getSearchArea();
        }
        const borderPercentage = 0.025;
        const usablePercentage = 1 - borderPercentage * 2;
        this.laserContainerElement.style.left = `${(borderPercentage + area.x * usablePercentage) * 100}%`;
        this.laserContainerElement.style.width = `${area.width * usablePercentage * 100}%`;
        this.laserContainerElement.style.top = `${(borderPercentage + area.y * usablePercentage) * 100}%`;
        this.laserContainerElement.style.height = `${area.height * usablePercentage * 100}%`;
    }
    setViewfinderArea(area) {
        this.customViewfinderArea = area;
        if (area == null) {
            area = this.scanner.getScanSettings().getSearchArea();
        }
        const borderPercentage = 0.025;
        const usablePercentage = 1 - borderPercentage * 2;
        this.viewfinderElement.style.left = `${(borderPercentage + area.x * usablePercentage) * 100}%`;
        this.viewfinderElement.style.width = `${area.width * usablePercentage * 100}%`;
        this.viewfinderElement.style.top = `${(borderPercentage + area.y * usablePercentage) * 100}%`;
        this.viewfinderElement.style.height = `${area.height * usablePercentage * 100}%`;
    }
    setVideoFit(objectFit) {
        if (this.singleImageModeEnabled) {
            return;
        }
        this.videoFit = objectFit;
        if (objectFit === BarcodePicker.ObjectFit.COVER) {
            this.videoElement.style.objectFit = "cover";
            this.videoElement.dataset.objectFit = "cover"; // used by "objectFitPolyfill" library
        }
        else {
            this.videoElement.style.objectFit = "contain";
            this.videoElement.dataset.objectFit = "contain"; // used by "objectFitPolyfill" library
            this.scanner.applyScanSettings(this.scanner.getScanSettings().setBaseSearchArea({ x: 0, y: 0, width: 1.0, height: 1.0 }));
        }
        this.resize();
    }
    reassignOriginElement(originElement) {
        if (!this.visible) {
            this.originElement.classList.remove(GUI.hiddenClassName);
            originElement.classList.add(GUI.hiddenClassName);
        }
        originElement.appendChild(this.grandParentElement);
        this.checkAndRecoverPlayback().catch(
        /* istanbul ignore next */ () => {
            // Ignored
        });
        this.resize();
        this.resizeObserver.disconnect();
        this.resizeObserver.observe(originElement);
        this.originElement = originElement;
    }
    flashGUI() {
        if (this.guiStyle === BarcodePicker.GuiStyle.LASER) {
            this.flashLaser();
        }
        else if (this.guiStyle === BarcodePicker.GuiStyle.VIEWFINDER) {
            this.flashViewfinder();
        }
    }
    getImageData(imageData) {
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
                const imageDataLength = this.contextWebGL.drawingBufferWidth * this.contextWebGL.drawingBufferHeight * 4;
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
    }
    getVideoCurrentTime() {
        return this.videoElement.currentTime;
    }
    setCameraSwitcherVisible(visible) {
        if (visible) {
            this.cameraSwitcherElement.classList.remove(GUI.hiddenClassName);
        }
        else {
            this.cameraSwitcherElement.classList.add(GUI.hiddenClassName);
        }
    }
    setTorchTogglerVisible(visible) {
        if (visible) {
            this.torchTogglerElement.classList.remove(GUI.hiddenClassName);
        }
        else {
            this.torchTogglerElement.classList.add(GUI.hiddenClassName);
        }
    }
    playVideo() {
        const playPromise = this.videoElement.play();
        playPromise?.catch(
        /* istanbul ignore next */ () => {
            // Can sometimes cause an incorrect rejection (all is good, ignore).
        });
    }
    setCameraType(cameraType) {
        this.cameraUploadInputElement?.setAttribute("capture", cameraType === Camera.Type.FRONT ? "user" : "environment");
    }
    setCameraUploadGuiBusyScanning(busyScanning) {
        if (busyScanning) {
            this.cameraUploadProgressElement.classList.remove(GUI.flashInsetClassName);
            this.cameraUploadElement.classList.add(GUI.opacityPulseClassName);
        }
        else {
            this.cameraUploadProgressElement.classList.add(GUI.flashInsetClassName);
            this.cameraUploadElement.classList.remove(GUI.opacityPulseClassName);
        }
    }
    setupContext(canvas) {
        let context = canvas.getContext("webgl", { alpha: false, antialias: false });
        // istanbul ignore if
        if (context == null) {
            context = canvas.getContext("experimental-webgl", { alpha: false, antialias: false });
        }
        if (context != null) {
            this.setupWebGL(context);
            canvas.addEventListener("webglcontextlost", () => {
                // We recreate instead of waiting for restore via the webglcontextrestored event as restore might never happen
                console.warn("WebGL context has been lost, restoring...");
                this.contextWebGL = undefined;
                this.setupContext(document.createElement("canvas"));
                this.handleVideoResize();
                console.warn("WebGL context restored");
            });
        }
        else {
            this.context2d = canvas.getContext("2d");
        }
    }
    setupWebGL(contextWebGL) {
        const texture = contextWebGL.createTexture();
        contextWebGL.bindTexture(contextWebGL.TEXTURE_2D, texture);
        const frameBuffer = contextWebGL.createFramebuffer();
        contextWebGL.bindFramebuffer(contextWebGL.FRAMEBUFFER, frameBuffer);
        contextWebGL.framebufferTexture2D(contextWebGL.FRAMEBUFFER, contextWebGL.COLOR_ATTACHMENT0, contextWebGL.TEXTURE_2D, texture, 0);
        contextWebGL.texParameteri(contextWebGL.TEXTURE_2D, contextWebGL.TEXTURE_WRAP_S, contextWebGL.CLAMP_TO_EDGE);
        contextWebGL.texParameteri(contextWebGL.TEXTURE_2D, contextWebGL.TEXTURE_WRAP_T, contextWebGL.CLAMP_TO_EDGE);
        contextWebGL.texParameteri(contextWebGL.TEXTURE_2D, contextWebGL.TEXTURE_MIN_FILTER, contextWebGL.NEAREST);
        contextWebGL.texParameteri(contextWebGL.TEXTURE_2D, contextWebGL.TEXTURE_MAG_FILTER, contextWebGL.NEAREST);
        this.contextWebGL = contextWebGL;
    }
    setupVideoElement() {
        this.videoElement.setAttribute("autoplay", "autoplay");
        this.videoElement.setAttribute("playsinline", "true");
        this.videoElement.setAttribute("muted", "muted");
        this.videoElement.className = GUI.videoElementClassName;
        this.parentElement.appendChild(this.videoElement);
    }
    setupCameraUploadGuiAssets() {
        const deviceType = BrowserHelper.userAgentInfo.getDevice().type;
        const defaultSettings = deviceType === "mobile" || deviceType === "tablet"
            ? SingleImageModeSettings.defaultMobile
            : SingleImageModeSettings.defaultDesktop;
        this.cameraUploadElement.className = GUI.cameraUploadElementClassName;
        Object.assign(this.cameraUploadElement.style, defaultSettings.containerStyle, this.singleImageModeSettings.containerStyle);
        this.parentElement.appendChild(this.cameraUploadElement);
        const informationElement = this.singleImageModeSettings.informationElement ?? defaultSettings.informationElement;
        Object.assign(informationElement.style, defaultSettings.informationStyle, this.singleImageModeSettings.informationStyle);
        this.cameraUploadElement.appendChild(informationElement);
        this.cameraUploadInputElement.type = "file";
        this.cameraUploadInputElement.accept = "image/*";
        this.cameraUploadInputElement.addEventListener("change", this.cameraUploadFile.bind(this));
        const cameraUploadInputCheckFunction = (event) => {
            // istanbul ignore next
            if (this.scanningPaused || this.cameraUploadInProgress) {
                event.preventDefault();
            }
        };
        this.cameraUploadInputElement.addEventListener("click", cameraUploadInputCheckFunction);
        this.cameraUploadInputElement.addEventListener("keydown", cameraUploadInputCheckFunction);
        this.cameraUploadLabelElement.appendChild(this.cameraUploadInputElement);
        const cameraUploadButtonIconElement = this.singleImageModeSettings.buttonElement ?? defaultSettings.buttonElement;
        [this.cameraUploadProgressElement.style, cameraUploadButtonIconElement.style].forEach((style) => {
            Object.assign(style, defaultSettings.buttonStyle, this.singleImageModeSettings.buttonStyle);
        });
        cameraUploadButtonIconElement.style.maxWidth = "100px";
        cameraUploadButtonIconElement.style.maxHeight = "100px";
        this.cameraUploadLabelElement.appendChild(cameraUploadButtonIconElement);
        this.cameraUploadProgressElement.classList.add("radial-progress");
        this.cameraUploadLabelElement.appendChild(this.cameraUploadProgressElement);
        this.cameraUploadElement.appendChild(this.cameraUploadLabelElement);
    }
    setupFullGuiAssets() {
        this.laserActiveImageElement.src = laserActiveImage;
        this.laserContainerElement.appendChild(this.laserActiveImageElement);
        this.laserPausedImageElement.src = laserPausedImage;
        this.laserContainerElement.appendChild(this.laserPausedImageElement);
        this.laserContainerElement.className = GUI.laserContainerElementClassName;
        this.parentElement.appendChild(this.laserContainerElement);
        this.viewfinderElement.className = GUI.viewfinderElementClassName;
        this.parentElement.appendChild(this.viewfinderElement);
        // Show inactive GUI, as for now the scanner isn't ready yet
        this.laserActiveImageElement.classList.add(GUI.hiddenOpacityClassName);
        this.laserPausedImageElement.classList.remove(GUI.hiddenOpacityClassName);
        this.viewfinderElement.classList.add(GUI.pausedClassName);
    }
    flashLaser() {
        this.laserActiveImageElement.classList.remove(GUI.flashColorClassName);
        // tslint:disable-next-line:no-unused-expression
        this.laserActiveImageElement.offsetHeight; // NOSONAR // Trigger reflow to restart animation
        this.laserActiveImageElement.classList.add(GUI.flashColorClassName);
    }
    flashViewfinder() {
        this.viewfinderElement.classList.remove(GUI.flashWhiteClassName);
        // tslint:disable-next-line:no-unused-expression
        this.viewfinderElement.offsetHeight; // NOSONAR // Trigger reflow to restart animation
        this.viewfinderElement.classList.add(GUI.flashWhiteClassName);
    }
    resize() {
        this.parentElement.style.maxWidth = "";
        this.parentElement.style.maxHeight = "";
        const width = this.originElement.clientWidth;
        const height = this.originElement.clientHeight;
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
    }
    resizeCameraUpload(width, height) {
        this.cameraUploadLabelElement.style.transform = `scale(${Math.min(1, width / 300, height / 300)})`;
    }
    resizeVideo(width, height) {
        if (this.videoElement.videoWidth <= 2 || this.videoElement.videoHeight <= 2) {
            return;
        }
        const videoRatio = this.videoElement.videoWidth / this.videoElement.videoHeight;
        if (this.videoFit === BarcodePicker.ObjectFit.COVER) {
            let widthPercentage = 1;
            let heightPercentage = 1;
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
        this.parentElement.style.maxWidth = `${Math.ceil(width)}px`;
        this.parentElement.style.maxHeight = `${Math.ceil(height)}px`;
        window.objectFitPolyfill(this.videoElement);
    }
    async checkAndRecoverPlayback() {
        if (document.visibilityState === "visible" &&
            this.cameraManager?.activeCamera != null &&
            this.videoElement?.srcObject != null) {
            if (!this.videoElement.srcObject.active) {
                try {
                    console.debug('Detected visibility change ("visible") event with inactive video source, try to reinitialize camera');
                    await this.cameraManager.reinitializeCamera();
                }
                catch {
                    // Ignored
                }
            }
            else {
                console.debug('Detected visibility change ("visible") event with active video source, replay video');
                this.playVideo();
            }
        }
    }
    updateCameraUploadProgress(progressPercentageValue) {
        this.cameraUploadProgressElement.setAttribute("data-progress", progressPercentageValue);
    }
    async cameraUploadImageLoad(image) {
        this.updateCameraUploadProgress("100");
        let resizedImageWidth;
        let resizedImageHeight;
        const resizedImageSizeLimit = 1440;
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
        await this.cameraUploadFileProcess(image, resizedImageWidth, resizedImageHeight);
    }
    async cameraUploadFileProcess(image, width, height) {
        // istanbul ignore else
        if (this.context2d != null) {
            this.context2d.canvas.width = width;
            this.context2d.canvas.height = height;
            this.context2d.drawImage(image, 0, 0, width, height);
            this.scanner.applyImageSettings({
                width,
                height,
                format: ImageSettings.Format.RGBA_8U,
            });
        }
        this.setCameraUploadGuiBusyScanning(true);
        await this.cameraUploadCallback();
        this.setCameraUploadGuiBusyScanning(false);
        this.cameraUploadInProgress = false;
    }
    cameraUploadFile() {
        const files = this.cameraUploadInputElement.files;
        if (files != null && files.length !== 0) {
            this.cameraUploadInProgress = true;
            const image = new Image();
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.cameraUploadInputElement.value = "";
                // istanbul ignore else
                if (fileReader.result != null) {
                    image.onload = this.cameraUploadImageLoad.bind(this, image);
                    image.onprogress = (event2) => {
                        // istanbul ignore else
                        if (event2.lengthComputable) {
                            const progress = Math.round((event2.loaded / event2.total) * 20) * 5;
                            // istanbul ignore else
                            if (progress <= 100) {
                                this.updateCameraUploadProgress(progress.toString());
                            }
                        }
                    };
                    image.onerror = () => {
                        this.cameraUploadInProgress = false;
                    };
                    image.src = fileReader.result;
                }
            };
            fileReader.onerror = () => {
                this.cameraUploadInProgress = false;
            };
            this.updateCameraUploadProgress("0");
            fileReader.readAsDataURL(files[0]);
        }
    }
    async cameraSwitcherListener(event) {
        if (!this.cameraSwitchInProgress && this.cameraManager != null) {
            const cameraManager = this.cameraManager;
            event.preventDefault();
            try {
                const cameras = await CameraAccess.getCameras();
                if (cameraManager.activeCamera == null) {
                    return;
                }
                if (cameras.length <= 1) {
                    this.setCameraSwitcherVisible(false);
                    return;
                }
                this.cameraSwitchInProgress = true;
                const currentCameraIndex = cameras.indexOf(cameraManager.activeCamera);
                let newCameraIndex = (currentCameraIndex + 1) % cameras.length;
                while (newCameraIndex !== currentCameraIndex) {
                    try {
                        await cameraManager.initializeCameraWithSettings(cameras[newCameraIndex], cameraManager.activeCameraSettings);
                    }
                    catch (error) {
                        console.warn("Couldn't access camera:", cameras[newCameraIndex], error);
                        newCameraIndex = (newCameraIndex + 1) % cameras.length;
                        if (newCameraIndex === currentCameraIndex) {
                            this.setCameraSwitcherVisible(false);
                            await cameraManager.initializeCameraWithSettings(cameras[newCameraIndex], cameraManager.activeCameraSettings);
                        }
                        continue;
                    }
                    break;
                }
                this.cameraSwitchInProgress = false;
            }
            catch (error) {
                console.error(error);
                this.cameraSwitchInProgress = false;
            }
        }
    }
    setupCameraSwitcher() {
        this.cameraSwitcherElement.src = switchCameraImage;
        this.cameraSwitcherElement.className = GUI.cameraSwitcherElementClassName;
        this.cameraSwitcherElement.classList.add(GUI.hiddenClassName);
        this.parentElement.appendChild(this.cameraSwitcherElement);
        ["touchstart", "mousedown"].forEach((eventName) => {
            this.cameraSwitcherElement.addEventListener(eventName, this.cameraSwitcherListener.bind(this));
        });
    }
    setupTorchToggler() {
        this.torchTogglerElement.src = toggleTorchImage;
        this.torchTogglerElement.className = GUI.torchTogglerElementClassName;
        this.torchTogglerElement.classList.add(GUI.hiddenClassName);
        this.parentElement.appendChild(this.torchTogglerElement);
        ["touchstart", "mousedown"].forEach((eventName) => {
            this.torchTogglerElement.addEventListener(eventName, async (event) => {
                if (this.cameraManager != null) {
                    event.preventDefault();
                    await this.cameraManager.toggleTorch();
                }
            });
        });
    }
    showScanditLogo(hideLogo, licenseKeyFeatures) {
        if (hideLogo && licenseKeyFeatures?.hiddenScanditLogoAllowed === true) {
            return;
        }
        const scanditLogoImageElement = document.createElement("img");
        scanditLogoImageElement.src = scanditLogoImage;
        scanditLogoImageElement.className = GUI.scanditLogoImageElementClassName;
        this.parentElement.appendChild(scanditLogoImageElement);
    }
    activateGUI() {
        this.engineContextCreated = true;
        if (!this.scanningPaused) {
            this.resumeScanning();
        }
    }
    handleNewScanSettings() {
        if (this.customLaserArea == null) {
            this.setLaserArea();
        }
        if (this.customViewfinderArea == null) {
            this.setViewfinderArea();
        }
    }
    handleVideoDisplay(hidden) {
        // Safari on iOS 14 behaves weirdly when hiding the video element:
        // it stops camera access after a few seconds if the related video element is not "visible".
        // We do the following to maintain the video element "visible" but actually hidden.
        const detachedVideoElement = this.videoElement.offsetParent === document.body;
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
    }
    handleVideoPause() {
        // Safari behaves weirdly when displaying the video element again after hiding it:
        // it pauses the video on hide and resumes it on show, then reusing video frames "buffered" from the video just
        // before it was hidden. We do the following to avoid processing old data.
        this.playVideo();
    }
    handleVideoResize() {
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
                format: ImageSettings.Format.RGBA_8U,
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
                format: ImageSettings.Format.RGBA_8U,
            });
        }
    }
}
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
//# sourceMappingURL=gui.js.map