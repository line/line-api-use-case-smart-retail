import { Barcode, BarcodePicker, CameraAccess, configure, ScanSettings } from "..";
import { SingleImageModeSettings } from "../lib/singleImageModeSettings";
import { LazyAttributeConverter } from "./lazyAttributeConverter";
import { convertProperty } from "./propertyConverter";
import { Attribute, attributes, getSchema } from "./schema";
import { assertUnreachable } from "./tsHelper";
import { Validator } from "./validator";
export class Controller {
    constructor(view) {
        this.view = view;
        this.viewConnected = false;
        this.trackAttributes = true;
        this.allSymbologies = Object.values(Barcode.Symbology).filter((s) => {
            return typeof s === "string";
        });
    }
    async viewConnectedCallback() {
        this.viewConnected = true;
        this.view.initializeDom();
        this.initializeAttributeConversionGetter();
        if (this.lazyAttributeConverter[Attribute.CONFIGURE]) {
            await this.initPicker();
        }
    }
    attributeChangedCallback(name) {
        if (!this.viewConnected || !this.trackAttributes) {
            return;
        }
        const rawAttribute = this.view.getAttribute(name);
        if (rawAttribute != null && !this.validateAttribute(name, rawAttribute)) {
            return;
        }
        const normalizedAttribute = this.attributeToCamelCase(name);
        this.applyChangeFromAttributeChange(normalizedAttribute);
    }
    viewDisconnectedCallback() {
        this.viewConnected = false;
        this.picker.destroy();
        // @ts-ignore
        delete this.picker;
        // @ts-ignore
        delete this.scanSettings;
    }
    // tslint:disable-next-line: max-func-body-length
    applyChangeFromAttributeChange(attribute) {
        switch (attribute) {
            case Attribute.ACCESS_CAMERA:
                if (this.lazyAttributeConverter[Attribute.ACCESS_CAMERA]) {
                    this.picker.accessCamera().catch((reason) => {
                        console.warn("Error while accessing the camera:", reason);
                    });
                }
                else {
                    this.picker.pauseCameraAccess();
                }
                break;
            case Attribute.ENABLE_CAMERA_SWITCHER:
                this.picker.setCameraSwitcherEnabled(this.lazyAttributeConverter[Attribute.ENABLE_CAMERA_SWITCHER]);
                break;
            case Attribute.ENABLE_PINCH_TO_ZOOM:
                this.picker.setPinchToZoomEnabled(this.lazyAttributeConverter[Attribute.ENABLE_PINCH_TO_ZOOM]);
                break;
            case Attribute.ENABLE_TAP_TO_FOCUS:
                this.picker.setTapToFocusEnabled(this.lazyAttributeConverter[Attribute.ENABLE_TAP_TO_FOCUS]);
                break;
            case Attribute.ENABLE_TORCH_TOGGLE:
                this.picker.setTorchToggleEnabled(this.lazyAttributeConverter[Attribute.ENABLE_TORCH_TOGGLE]);
                break;
            case Attribute.GUI_STYLE:
                this.picker.setGuiStyle(this.lazyAttributeConverter[Attribute.GUI_STYLE]);
                break;
            case Attribute.LASER_AREA:
                this.picker.setLaserArea(this.lazyAttributeConverter[Attribute.LASER_AREA]);
                break;
            case Attribute.PLAY_SOUND_ON_SCAN:
                this.picker.setPlaySoundOnScanEnabled(this.lazyAttributeConverter[Attribute.PLAY_SOUND_ON_SCAN]);
                break;
            case Attribute.SCANNING_PAUSED:
                if (this.lazyAttributeConverter[Attribute.SCANNING_PAUSED]) {
                    this.picker.pauseScanning();
                    break;
                }
                this.picker.resumeScanning().catch((reason) => {
                    console.warn("Error while resuming scanning:", reason);
                });
                break;
            case Attribute.TARGET_SCANNING_FPS:
                this.picker.setTargetScanningFPS(this.lazyAttributeConverter[Attribute.TARGET_SCANNING_FPS]);
                break;
            case Attribute.VIBRATE_ON_SCAN:
                this.picker.setVibrateOnScanEnabled(this.lazyAttributeConverter[Attribute.VIBRATE_ON_SCAN]);
                break;
            case Attribute.VIDEO_FIT:
                this.picker.setVideoFit(this.lazyAttributeConverter[Attribute.VIDEO_FIT]);
                break;
            case Attribute.VIEWFINDER_AREA:
                this.picker.setViewfinderArea(this.lazyAttributeConverter[Attribute.VIEWFINDER_AREA]);
                break;
            case Attribute.VISIBLE:
                this.picker.setVisible(this.lazyAttributeConverter[Attribute.VISIBLE]);
                break;
            case Attribute.CAMERA:
                this.getCameraFromAttribute()
                    .then((camera) => {
                    this.picker.setActiveCamera(camera).catch((reason) => {
                        console.warn("Error while setting the active camera:", reason);
                    });
                })
                    .catch((reason) => {
                    console.warn("Error while getting the camera:", reason);
                });
                break;
            case Attribute.CAMERA_TYPE:
                this.picker.setCameraType(this.lazyAttributeConverter[Attribute.CAMERA_TYPE]).catch((reason) => {
                    console.warn("Error while setting camera type:", reason);
                });
                break;
            case Attribute.CAMERA_SETTINGS:
                this.picker.applyCameraSettings(this.lazyAttributeConverter[Attribute.CAMERA_SETTINGS]).catch((reason) => {
                    console.warn("Error while applying camera settings:", reason);
                });
                break;
            //
            // SCAN SETTINGS from here
            //
            case Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION:
                this.scanSettings.setBlurryRecognitionEnabled(this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION]);
                this.picker.applyScanSettings(this.scanSettings);
                break;
            case Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT:
                this.scanSettings.setCodeDirectionHint(this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT]);
                this.picker.applyScanSettings(this.scanSettings);
                break;
            case Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER:
                this.scanSettings.setCodeDuplicateFilter(this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER]);
                this.picker.applyScanSettings(this.scanSettings);
                break;
            case Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES:
                this.onEnabledSymbologiesChanged();
                break;
            case Attribute.SCAN_SETTINGS_GPU_ACCELERATION:
                this.scanSettings.setGpuAccelerationEnabled(this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_GPU_ACCELERATION]);
                this.picker.applyScanSettings(this.scanSettings);
                break;
            case Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME:
                this.scanSettings.setMaxNumberOfCodesPerFrame(this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME]);
                this.picker.applyScanSettings(this.scanSettings);
                break;
            case Attribute.SCAN_SETTINGS_SEARCH_AREA:
                this.scanSettings.setSearchArea(this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_SEARCH_AREA]);
                this.picker.applyScanSettings(this.scanSettings);
                break;
            case Attribute.CONFIGURE:
                if (this.lazyAttributeConverter[Attribute.CONFIGURE]) {
                    this.initPicker().catch((reason) => {
                        console.warn("Error while initializing barcode picker:", reason);
                    });
                }
                break;
            case Attribute.SINGLE_IMAGE_MODE_SETTINGS:
            case Attribute.CONFIGURE_ENGINE_LOCATION:
            case Attribute.CONFIGURE_LICENSE_KEY:
            case Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION:
            case Attribute.CONFIGURE_PRELOAD_ENGINE:
                // noop
                break;
            default:
                // the following statement is here to make sure of the exhaustivenesss of this switch statement (if you miss
                // a case the compiler will yell at you)
                assertUnreachable(attribute);
                break;
        }
    }
    async initPicker() {
        if (this.picker != null) {
            return;
        }
        this.validateAllAttributes();
        try {
            await configure(this.lazyAttributeConverter[Attribute.CONFIGURE_LICENSE_KEY], {
                engineLocation: this.lazyAttributeConverter[Attribute.CONFIGURE_ENGINE_LOCATION],
                preloadEngine: this.lazyAttributeConverter[Attribute.CONFIGURE_PRELOAD_ENGINE],
                preloadBlurryRecognition: this.lazyAttributeConverter[Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION],
            });
            this.picker = new Proxy(await BarcodePicker.create(this.view.root, {
                accessCamera: this.lazyAttributeConverter[Attribute.ACCESS_CAMERA],
                camera: await this.getCameraFromAttribute(),
                cameraType: this.lazyAttributeConverter[Attribute.CAMERA_TYPE],
                enableCameraSwitcher: this.lazyAttributeConverter[Attribute.ENABLE_CAMERA_SWITCHER],
                enablePinchToZoom: this.lazyAttributeConverter[Attribute.ENABLE_PINCH_TO_ZOOM],
                enableTapToFocus: this.lazyAttributeConverter[Attribute.ENABLE_TAP_TO_FOCUS],
                enableTorchToggle: this.lazyAttributeConverter[Attribute.ENABLE_TORCH_TOGGLE],
                playSoundOnScan: this.lazyAttributeConverter[Attribute.PLAY_SOUND_ON_SCAN],
                vibrateOnScan: this.lazyAttributeConverter[Attribute.VIBRATE_ON_SCAN],
                scanningPaused: this.lazyAttributeConverter[Attribute.SCANNING_PAUSED],
                guiStyle: this.lazyAttributeConverter[Attribute.GUI_STYLE],
                targetScanningFPS: this.lazyAttributeConverter[Attribute.TARGET_SCANNING_FPS],
                videoFit: this.lazyAttributeConverter[Attribute.VIDEO_FIT],
                visible: this.lazyAttributeConverter[Attribute.VISIBLE],
                viewfinderArea: this.lazyAttributeConverter[Attribute.VIEWFINDER_AREA],
                laserArea: this.lazyAttributeConverter[Attribute.LASER_AREA],
                singleImageModeSettings: await this.getSingleImageModeSettings(),
            }), this.getBarcodePickerProxyHandler());
        }
        catch (e) {
            return this.handleException(e);
        }
        this.scanSettings = new ScanSettings({
            enabledSymbologies: this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES],
            codeDirectionHint: this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT],
            codeDuplicateFilter: this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER],
            blurryRecognition: this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION],
            gpuAcceleration: this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_GPU_ACCELERATION],
            maxNumberOfCodesPerFrame: this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME],
            searchArea: this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_SEARCH_AREA],
        });
        this.picker.applyScanSettings(this.scanSettings);
        this.picker.on("ready", this.dispatchPickerEvent.bind(this, "ready"));
        this.picker.on("submitFrame", this.dispatchPickerEvent.bind(this, "submitFrame"));
        this.picker.on("processFrame", this.dispatchPickerEvent.bind(this, "processFrame"));
        this.picker.on("scan", this.dispatchPickerEvent.bind(this, "scan"));
        this.picker.on("scanError", this.dispatchPickerEvent.bind(this, "scanError"));
    }
    getBarcodePickerProxyHandler() {
        let proxiedGui;
        let proxiedCameraManager;
        // tslint:disable-next-line: no-this-assignment
        const controllerRef = this;
        function getProxiedGui(target) {
            if (proxiedGui == null) {
                // tslint:disable-next-line: no-string-literal
                proxiedGui = new Proxy(target["gui"], {
                    // tslint:disable-next-line: no-any
                    set: (gui, p, value) => {
                        Reflect.set(gui, p, value);
                        controllerRef.onPickerPropertyUpdate.call(controllerRef, { origin: "gui", key: p, newValue: value });
                        return true;
                    },
                });
            }
            return proxiedGui;
        }
        function getProxiedCameraManager(target) {
            if (proxiedCameraManager == null) {
                // tslint:disable-next-line: no-string-literal
                proxiedCameraManager = new Proxy(target["cameraManager"], {
                    // tslint:disable-next-line: no-any
                    set: (cameraManager, p, value) => {
                        Reflect.set(cameraManager, p, value);
                        controllerRef.onPickerPropertyUpdate.call(controllerRef, {
                            origin: "cameraManager",
                            key: p,
                            newValue: value,
                        });
                        return true;
                    },
                });
            }
            return proxiedCameraManager;
        }
        return {
            get: (target, p) => {
                if (p === "gui") {
                    return getProxiedGui(target);
                }
                if (p === "cameraManager") {
                    return getProxiedCameraManager(target);
                }
                if (p === "applyScanSettings") {
                    return (scanSettings) => {
                        Reflect.apply(Reflect.get(target, p), target, [scanSettings]);
                        this.onScannerNewScanSettings(scanSettings);
                    };
                }
                return Reflect.get(target, p);
            },
            // tslint:disable-next-line: no-any
            set: (picker, p, value) => {
                Reflect.set(picker, p, value);
                this.onPickerPropertyUpdate({ key: p, origin: "picker", newValue: value });
                return true;
            },
        };
    }
    /**
     * Gather all settings from the passed scan settings and call `propertyDidUpdate`
     * to notify about the new settings.
     *
     * @param scanSettings The newly applied scan settings
     */
    onScannerNewScanSettings(scanSettings) {
        const allSymbologies = Object.values(Barcode.Symbology).filter((s) => {
            return typeof s === "string";
        });
        const changeSet = [
            {
                key: Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION,
                newValue: scanSettings.isBlurryRecognitionEnabled(),
            },
            {
                key: Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT,
                newValue: scanSettings.getCodeDirectionHint(),
            },
            {
                key: Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER,
                newValue: scanSettings.getCodeDuplicateFilter(),
            },
            {
                key: Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES,
                newValue: allSymbologies.reduce((enabledSymbologies, symbology) => {
                    if (scanSettings.isSymbologyEnabled(symbology)) {
                        enabledSymbologies.push(Barcode.Symbology.toJSONName(symbology));
                    }
                    return enabledSymbologies;
                }, []),
            },
            {
                key: Attribute.SCAN_SETTINGS_GPU_ACCELERATION,
                newValue: scanSettings.isGpuAccelerationEnabled(),
            },
            {
                key: Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME,
                newValue: scanSettings.getMaxNumberOfCodesPerFrame(),
            },
            {
                key: Attribute.SCAN_SETTINGS_SEARCH_AREA,
                newValue: scanSettings.getSearchArea(),
            },
        ];
        changeSet.forEach((change) => {
            this.onPickerPropertyUpdate({ origin: "scanner", ...change });
        });
    }
    /**
     * for each attribute we support, define a property on the "primaryValues" object to get the attribute and convert
     * it to its primary type (e.g. the string "true" would become the real boolean value `true`)
     */
    initializeAttributeConversionGetter() {
        this.lazyAttributeConverter = new LazyAttributeConverter(getSchema(), this.view);
    }
    async getCameraFromAttribute() {
        let userCamera;
        const cameraAttr = this.lazyAttributeConverter[Attribute.CAMERA];
        if (cameraAttr?.deviceId != null) {
            const cameras = await CameraAccess.getCameras();
            const userCameraId = cameraAttr.deviceId;
            userCamera = cameras.find((camera) => {
                return camera.deviceId === userCameraId;
            });
            if (userCamera == null) {
                console.warn(`Could not find camera with id "${userCameraId}", will use default camera.`);
            }
        }
        return userCamera;
    }
    onEnabledSymbologiesChanged() {
        const symbologiesToEnable = this.lazyAttributeConverter[Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES];
        this.allSymbologies.forEach((symbology) => {
            const shouldEnable = symbologiesToEnable.includes(symbology);
            this.scanSettings.getSymbologySettings(symbology).setEnabled(shouldEnable);
        });
        this.picker.applyScanSettings(this.scanSettings);
    }
    // tslint:disable-next-line: no-any
    onPickerPropertyUpdate(change) {
        // we need to map the private property name to our "public" properties
        const mappingsByOrigin = {
            gui: {
                customLaserArea: [Attribute.LASER_AREA],
                customViewfinderArea: [Attribute.VIEWFINDER_AREA],
            },
            cameraManager: {
                activeCamera: [Attribute.CAMERA, Attribute.CAMERA_TYPE],
                cameraSwitcherEnabled: [Attribute.ENABLE_CAMERA_SWITCHER],
                torchToggleEnabled: [Attribute.ENABLE_TORCH_TOGGLE],
                tapToFocusEnabled: [Attribute.ENABLE_TAP_TO_FOCUS],
                pinchToZoomEnabled: [Attribute.ENABLE_PINCH_TO_ZOOM],
            },
        };
        const propertyNames = mappingsByOrigin[change.origin]?.[change.key] ?? [change.key];
        this.trackAttributes = false;
        propertyNames.forEach((propertyName) => {
            if (attributes.includes(propertyName)) {
                if (change.newValue == null) {
                    this.view.removeAttribute(propertyName);
                }
                else {
                    this.view.setAttribute(propertyName, convertProperty(getSchema()[propertyName], change.newValue));
                }
            }
        });
        this.trackAttributes = true;
    }
    async getSingleImageModeSettings() {
        const settings = {};
        if (this.lazyAttributeConverter[Attribute.SINGLE_IMAGE_MODE_SETTINGS] != null) {
            // merge settings from user
            settings.desktop = {
                ...SingleImageModeSettings.defaultDesktop,
                ...(this.lazyAttributeConverter[Attribute.SINGLE_IMAGE_MODE_SETTINGS].desktop ?? {}),
            };
            settings.mobile = {
                ...SingleImageModeSettings.defaultMobile,
                ...(this.lazyAttributeConverter[Attribute.SINGLE_IMAGE_MODE_SETTINGS].mobile ?? {}),
            };
        }
        // children may not have been parsed yet
        await this.view.waitOnChildrenReady();
        // This parts will slightly hurt your eyes because of TS: basically we just loop over "desktop" and "mobile", and
        // loop again inside over the HTML elements that can be set with slot.
        ["mobile", "desktop"].forEach((platform) => {
            ["informationElement", "buttonElement"].forEach((platformSetting) => {
                const el = this.view.querySelector(`*[slot="singleImageModeSettings.${platform}.${platformSetting}"]`);
                if (el != null && settings[platform] != null) {
                    // tslint:disable-next-line: no-non-null-assertion no-any
                    settings[platform][platformSetting] = el;
                }
            });
        });
        return settings;
    }
    dispatchPickerEvent(eventName, scanResultOrError) {
        const event = new CustomEvent(eventName, { detail: scanResultOrError });
        this.view.dispatchCustomEvent(event);
    }
    validateAllAttributes() {
        const attrs = Array.from(this.view.getAttributes());
        attrs.forEach((attr) => {
            if (attributes.includes(attr.name)) {
                this.validateAttribute(attr.name, attr.value);
            }
        });
    }
    validateAttribute(name, value) {
        const normalizedAttribute = this.attributeToCamelCase(name);
        let validatorFunction;
        switch (normalizedAttribute) {
            case Attribute.ACCESS_CAMERA:
            case Attribute.CONFIGURE:
            case Attribute.ENABLE_CAMERA_SWITCHER:
            case Attribute.ENABLE_PINCH_TO_ZOOM:
            case Attribute.ENABLE_TAP_TO_FOCUS:
            case Attribute.ENABLE_TORCH_TOGGLE:
            case Attribute.PLAY_SOUND_ON_SCAN:
            case Attribute.SCANNING_PAUSED:
            case Attribute.VIBRATE_ON_SCAN:
            case Attribute.VISIBLE:
            case Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION:
            case Attribute.SCAN_SETTINGS_GPU_ACCELERATION:
                validatorFunction = Validator.isBooleanAttribute;
                break;
            case Attribute.TARGET_SCANNING_FPS:
            case Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER:
            case Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME:
                validatorFunction = Validator.isIntegerAttribute;
                break;
            case Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT:
                validatorFunction = Validator.isValidCodeDirection;
                break;
            case Attribute.CAMERA_TYPE:
                validatorFunction = Validator.isValidCameraType;
                break;
            case Attribute.GUI_STYLE:
                validatorFunction = Validator.isValidGuiStyle;
                break;
            case Attribute.VIDEO_FIT:
                validatorFunction = Validator.isValidVideoFit;
                break;
            case Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES:
                validatorFunction = Validator.isValidJsonArray;
                break;
            case Attribute.VIEWFINDER_AREA:
            case Attribute.LASER_AREA:
            case Attribute.SCAN_SETTINGS_SEARCH_AREA:
                validatorFunction = Validator.isValidSearchAreaAttribute;
                break;
            case Attribute.CAMERA:
                validatorFunction = Validator.isValidCameraObject;
                break;
            case Attribute.CAMERA_SETTINGS:
                validatorFunction = Validator.isValidCameraSettingsObject;
                break;
            case Attribute.SINGLE_IMAGE_MODE_SETTINGS:
                validatorFunction = Validator.isValidSingleImageModeSettingsObject;
                break;
            case Attribute.CONFIGURE_ENGINE_LOCATION:
            case Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION:
            case Attribute.CONFIGURE_LICENSE_KEY:
            case Attribute.CONFIGURE_PRELOAD_ENGINE:
                validatorFunction = () => {
                    return true;
                };
                break;
            default:
                assertUnreachable(normalizedAttribute);
                break;
        }
        if (!validatorFunction(value)) {
            console.warn(`Invalid value for attribute "${normalizedAttribute}": "${value}". ${Validator.expectationMessage.get(validatorFunction) ?? ""}`);
            return false;
        }
        return true;
    }
    /**
     * Transform the given attribute name to its camel-cased version.
     *
     * @param attrName The attribute name, possibly all lower-cased
     * @returns camel-cased attribute name
     */
    attributeToCamelCase(attrName) {
        const index = attributes.findIndex((k) => {
            return k.toLowerCase() === attrName.toLowerCase();
        });
        return attributes[index];
    }
    handleException(e) {
        console.error(e);
    }
}
//# sourceMappingURL=controller.js.map