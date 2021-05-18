"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
var tslib_1 = require("tslib");
var __1 = require("..");
var singleImageModeSettings_1 = require("../lib/singleImageModeSettings");
var lazyAttributeConverter_1 = require("./lazyAttributeConverter");
var propertyConverter_1 = require("./propertyConverter");
var schema_1 = require("./schema");
var tsHelper_1 = require("./tsHelper");
var validator_1 = require("./validator");
var Controller = /** @class */ (function () {
    function Controller(view) {
        this.view = view;
        this.viewConnected = false;
        this.trackAttributes = true;
        this.allSymbologies = Object.values(__1.Barcode.Symbology).filter(function (s) {
            return typeof s === "string";
        });
    }
    Controller.prototype.viewConnectedCallback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.viewConnected = true;
                        this.view.initializeDom();
                        this.initializeAttributeConversionGetter();
                        if (!this.lazyAttributeConverter[schema_1.Attribute.CONFIGURE]) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.initPicker()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.attributeChangedCallback = function (name) {
        if (!this.viewConnected || !this.trackAttributes) {
            return;
        }
        var rawAttribute = this.view.getAttribute(name);
        if (rawAttribute != null && !this.validateAttribute(name, rawAttribute)) {
            return;
        }
        var normalizedAttribute = this.attributeToCamelCase(name);
        this.applyChangeFromAttributeChange(normalizedAttribute);
    };
    Controller.prototype.viewDisconnectedCallback = function () {
        this.viewConnected = false;
        this.picker.destroy();
        // @ts-ignore
        delete this.picker;
        // @ts-ignore
        delete this.scanSettings;
    };
    // tslint:disable-next-line: max-func-body-length
    Controller.prototype.applyChangeFromAttributeChange = function (attribute) {
        var _this = this;
        switch (attribute) {
            case schema_1.Attribute.ACCESS_CAMERA:
                if (this.lazyAttributeConverter[schema_1.Attribute.ACCESS_CAMERA]) {
                    this.picker.accessCamera().catch(function (reason) {
                        console.warn("Error while accessing the camera:", reason);
                    });
                }
                else {
                    this.picker.pauseCameraAccess();
                }
                break;
            case schema_1.Attribute.ENABLE_CAMERA_SWITCHER:
                this.picker.setCameraSwitcherEnabled(this.lazyAttributeConverter[schema_1.Attribute.ENABLE_CAMERA_SWITCHER]);
                break;
            case schema_1.Attribute.ENABLE_PINCH_TO_ZOOM:
                this.picker.setPinchToZoomEnabled(this.lazyAttributeConverter[schema_1.Attribute.ENABLE_PINCH_TO_ZOOM]);
                break;
            case schema_1.Attribute.ENABLE_TAP_TO_FOCUS:
                this.picker.setTapToFocusEnabled(this.lazyAttributeConverter[schema_1.Attribute.ENABLE_TAP_TO_FOCUS]);
                break;
            case schema_1.Attribute.ENABLE_TORCH_TOGGLE:
                this.picker.setTorchToggleEnabled(this.lazyAttributeConverter[schema_1.Attribute.ENABLE_TORCH_TOGGLE]);
                break;
            case schema_1.Attribute.GUI_STYLE:
                this.picker.setGuiStyle(this.lazyAttributeConverter[schema_1.Attribute.GUI_STYLE]);
                break;
            case schema_1.Attribute.LASER_AREA:
                this.picker.setLaserArea(this.lazyAttributeConverter[schema_1.Attribute.LASER_AREA]);
                break;
            case schema_1.Attribute.PLAY_SOUND_ON_SCAN:
                this.picker.setPlaySoundOnScanEnabled(this.lazyAttributeConverter[schema_1.Attribute.PLAY_SOUND_ON_SCAN]);
                break;
            case schema_1.Attribute.SCANNING_PAUSED:
                if (this.lazyAttributeConverter[schema_1.Attribute.SCANNING_PAUSED]) {
                    this.picker.pauseScanning();
                    break;
                }
                this.picker.resumeScanning().catch(function (reason) {
                    console.warn("Error while resuming scanning:", reason);
                });
                break;
            case schema_1.Attribute.TARGET_SCANNING_FPS:
                this.picker.setTargetScanningFPS(this.lazyAttributeConverter[schema_1.Attribute.TARGET_SCANNING_FPS]);
                break;
            case schema_1.Attribute.VIBRATE_ON_SCAN:
                this.picker.setVibrateOnScanEnabled(this.lazyAttributeConverter[schema_1.Attribute.VIBRATE_ON_SCAN]);
                break;
            case schema_1.Attribute.VIDEO_FIT:
                this.picker.setVideoFit(this.lazyAttributeConverter[schema_1.Attribute.VIDEO_FIT]);
                break;
            case schema_1.Attribute.VIEWFINDER_AREA:
                this.picker.setViewfinderArea(this.lazyAttributeConverter[schema_1.Attribute.VIEWFINDER_AREA]);
                break;
            case schema_1.Attribute.VISIBLE:
                this.picker.setVisible(this.lazyAttributeConverter[schema_1.Attribute.VISIBLE]);
                break;
            case schema_1.Attribute.CAMERA:
                this.getCameraFromAttribute()
                    .then(function (camera) {
                    _this.picker.setActiveCamera(camera).catch(function (reason) {
                        console.warn("Error while setting the active camera:", reason);
                    });
                })
                    .catch(function (reason) {
                    console.warn("Error while getting the camera:", reason);
                });
                break;
            case schema_1.Attribute.CAMERA_TYPE:
                this.picker.setCameraType(this.lazyAttributeConverter[schema_1.Attribute.CAMERA_TYPE]).catch(function (reason) {
                    console.warn("Error while setting camera type:", reason);
                });
                break;
            case schema_1.Attribute.CAMERA_SETTINGS:
                this.picker.applyCameraSettings(this.lazyAttributeConverter[schema_1.Attribute.CAMERA_SETTINGS]).catch(function (reason) {
                    console.warn("Error while applying camera settings:", reason);
                });
                break;
            //
            // SCAN SETTINGS from here
            //
            case schema_1.Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION:
                this.scanSettings.setBlurryRecognitionEnabled(this.lazyAttributeConverter[schema_1.Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION]);
                this.picker.applyScanSettings(this.scanSettings);
                break;
            case schema_1.Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT:
                this.scanSettings.setCodeDirectionHint(this.lazyAttributeConverter[schema_1.Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT]);
                this.picker.applyScanSettings(this.scanSettings);
                break;
            case schema_1.Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER:
                this.scanSettings.setCodeDuplicateFilter(this.lazyAttributeConverter[schema_1.Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER]);
                this.picker.applyScanSettings(this.scanSettings);
                break;
            case schema_1.Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES:
                this.onEnabledSymbologiesChanged();
                break;
            case schema_1.Attribute.SCAN_SETTINGS_GPU_ACCELERATION:
                this.scanSettings.setGpuAccelerationEnabled(this.lazyAttributeConverter[schema_1.Attribute.SCAN_SETTINGS_GPU_ACCELERATION]);
                this.picker.applyScanSettings(this.scanSettings);
                break;
            case schema_1.Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME:
                this.scanSettings.setMaxNumberOfCodesPerFrame(this.lazyAttributeConverter[schema_1.Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME]);
                this.picker.applyScanSettings(this.scanSettings);
                break;
            case schema_1.Attribute.SCAN_SETTINGS_SEARCH_AREA:
                this.scanSettings.setSearchArea(this.lazyAttributeConverter[schema_1.Attribute.SCAN_SETTINGS_SEARCH_AREA]);
                this.picker.applyScanSettings(this.scanSettings);
                break;
            case schema_1.Attribute.CONFIGURE:
                if (this.lazyAttributeConverter[schema_1.Attribute.CONFIGURE]) {
                    this.initPicker().catch(function (reason) {
                        console.warn("Error while initializing barcode picker:", reason);
                    });
                }
                break;
            case schema_1.Attribute.SINGLE_IMAGE_MODE_SETTINGS:
            case schema_1.Attribute.CONFIGURE_ENGINE_LOCATION:
            case schema_1.Attribute.CONFIGURE_LICENSE_KEY:
            case schema_1.Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION:
            case schema_1.Attribute.CONFIGURE_PRELOAD_ENGINE:
                // noop
                break;
            default:
                // the following statement is here to make sure of the exhaustivenesss of this switch statement (if you miss
                // a case the compiler will yell at you)
                tsHelper_1.assertUnreachable(attribute);
                break;
        }
    };
    Controller.prototype.initPicker = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, e_1;
            var _f;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (this.picker != null) {
                            return [2 /*return*/];
                        }
                        this.validateAllAttributes();
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, __1.configure(this.lazyAttributeConverter[schema_1.Attribute.CONFIGURE_LICENSE_KEY], {
                                engineLocation: this.lazyAttributeConverter[schema_1.Attribute.CONFIGURE_ENGINE_LOCATION],
                                preloadEngine: this.lazyAttributeConverter[schema_1.Attribute.CONFIGURE_PRELOAD_ENGINE],
                                preloadBlurryRecognition: this.lazyAttributeConverter[schema_1.Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION],
                            })];
                    case 2:
                        _g.sent();
                        _a = this;
                        _b = Proxy.bind;
                        _d = (_c = __1.BarcodePicker).create;
                        _e = [this.view.root];
                        _f = {
                            accessCamera: this.lazyAttributeConverter[schema_1.Attribute.ACCESS_CAMERA]
                        };
                        return [4 /*yield*/, this.getCameraFromAttribute()];
                    case 3:
                        _f.camera = _g.sent(),
                            _f.cameraType = this.lazyAttributeConverter[schema_1.Attribute.CAMERA_TYPE],
                            _f.enableCameraSwitcher = this.lazyAttributeConverter[schema_1.Attribute.ENABLE_CAMERA_SWITCHER],
                            _f.enablePinchToZoom = this.lazyAttributeConverter[schema_1.Attribute.ENABLE_PINCH_TO_ZOOM],
                            _f.enableTapToFocus = this.lazyAttributeConverter[schema_1.Attribute.ENABLE_TAP_TO_FOCUS],
                            _f.enableTorchToggle = this.lazyAttributeConverter[schema_1.Attribute.ENABLE_TORCH_TOGGLE],
                            _f.playSoundOnScan = this.lazyAttributeConverter[schema_1.Attribute.PLAY_SOUND_ON_SCAN],
                            _f.vibrateOnScan = this.lazyAttributeConverter[schema_1.Attribute.VIBRATE_ON_SCAN],
                            _f.scanningPaused = this.lazyAttributeConverter[schema_1.Attribute.SCANNING_PAUSED],
                            _f.guiStyle = this.lazyAttributeConverter[schema_1.Attribute.GUI_STYLE],
                            _f.targetScanningFPS = this.lazyAttributeConverter[schema_1.Attribute.TARGET_SCANNING_FPS],
                            _f.videoFit = this.lazyAttributeConverter[schema_1.Attribute.VIDEO_FIT],
                            _f.visible = this.lazyAttributeConverter[schema_1.Attribute.VISIBLE],
                            _f.viewfinderArea = this.lazyAttributeConverter[schema_1.Attribute.VIEWFINDER_AREA],
                            _f.laserArea = this.lazyAttributeConverter[schema_1.Attribute.LASER_AREA];
                        return [4 /*yield*/, this.getSingleImageModeSettings()];
                    case 4: return [4 /*yield*/, _d.apply(_c, _e.concat([(_f.singleImageModeSettings = _g.sent(),
                                _f)]))];
                    case 5:
                        _a.picker = new (_b.apply(Proxy, [void 0, _g.sent(), this.getBarcodePickerProxyHandler()]))();
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _g.sent();
                        return [2 /*return*/, this.handleException(e_1)];
                    case 7:
                        this.scanSettings = new __1.ScanSettings({
                            enabledSymbologies: this.lazyAttributeConverter[schema_1.Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES],
                            codeDirectionHint: this.lazyAttributeConverter[schema_1.Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT],
                            codeDuplicateFilter: this.lazyAttributeConverter[schema_1.Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER],
                            blurryRecognition: this.lazyAttributeConverter[schema_1.Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION],
                            gpuAcceleration: this.lazyAttributeConverter[schema_1.Attribute.SCAN_SETTINGS_GPU_ACCELERATION],
                            maxNumberOfCodesPerFrame: this.lazyAttributeConverter[schema_1.Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME],
                            searchArea: this.lazyAttributeConverter[schema_1.Attribute.SCAN_SETTINGS_SEARCH_AREA],
                        });
                        this.picker.applyScanSettings(this.scanSettings);
                        this.picker.on("ready", this.dispatchPickerEvent.bind(this, "ready"));
                        this.picker.on("submitFrame", this.dispatchPickerEvent.bind(this, "submitFrame"));
                        this.picker.on("processFrame", this.dispatchPickerEvent.bind(this, "processFrame"));
                        this.picker.on("scan", this.dispatchPickerEvent.bind(this, "scan"));
                        this.picker.on("scanError", this.dispatchPickerEvent.bind(this, "scanError"));
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.getBarcodePickerProxyHandler = function () {
        var _this = this;
        var proxiedGui;
        var proxiedCameraManager;
        // tslint:disable-next-line: no-this-assignment
        var controllerRef = this;
        function getProxiedGui(target) {
            if (proxiedGui == null) {
                // tslint:disable-next-line: no-string-literal
                proxiedGui = new Proxy(target["gui"], {
                    // tslint:disable-next-line: no-any
                    set: function (gui, p, value) {
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
                    set: function (cameraManager, p, value) {
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
            get: function (target, p) {
                if (p === "gui") {
                    return getProxiedGui(target);
                }
                if (p === "cameraManager") {
                    return getProxiedCameraManager(target);
                }
                if (p === "applyScanSettings") {
                    return function (scanSettings) {
                        Reflect.apply(Reflect.get(target, p), target, [scanSettings]);
                        _this.onScannerNewScanSettings(scanSettings);
                    };
                }
                return Reflect.get(target, p);
            },
            // tslint:disable-next-line: no-any
            set: function (picker, p, value) {
                Reflect.set(picker, p, value);
                _this.onPickerPropertyUpdate({ key: p, origin: "picker", newValue: value });
                return true;
            },
        };
    };
    /**
     * Gather all settings from the passed scan settings and call `propertyDidUpdate`
     * to notify about the new settings.
     *
     * @param scanSettings The newly applied scan settings
     */
    Controller.prototype.onScannerNewScanSettings = function (scanSettings) {
        var _this = this;
        var allSymbologies = Object.values(__1.Barcode.Symbology).filter(function (s) {
            return typeof s === "string";
        });
        var changeSet = [
            {
                key: schema_1.Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION,
                newValue: scanSettings.isBlurryRecognitionEnabled(),
            },
            {
                key: schema_1.Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT,
                newValue: scanSettings.getCodeDirectionHint(),
            },
            {
                key: schema_1.Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER,
                newValue: scanSettings.getCodeDuplicateFilter(),
            },
            {
                key: schema_1.Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES,
                newValue: allSymbologies.reduce(function (enabledSymbologies, symbology) {
                    if (scanSettings.isSymbologyEnabled(symbology)) {
                        enabledSymbologies.push(__1.Barcode.Symbology.toJSONName(symbology));
                    }
                    return enabledSymbologies;
                }, []),
            },
            {
                key: schema_1.Attribute.SCAN_SETTINGS_GPU_ACCELERATION,
                newValue: scanSettings.isGpuAccelerationEnabled(),
            },
            {
                key: schema_1.Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME,
                newValue: scanSettings.getMaxNumberOfCodesPerFrame(),
            },
            {
                key: schema_1.Attribute.SCAN_SETTINGS_SEARCH_AREA,
                newValue: scanSettings.getSearchArea(),
            },
        ];
        changeSet.forEach(function (change) {
            _this.onPickerPropertyUpdate(tslib_1.__assign({ origin: "scanner" }, change));
        });
    };
    /**
     * for each attribute we support, define a property on the "primaryValues" object to get the attribute and convert
     * it to its primary type (e.g. the string "true" would become the real boolean value `true`)
     */
    Controller.prototype.initializeAttributeConversionGetter = function () {
        this.lazyAttributeConverter = new lazyAttributeConverter_1.LazyAttributeConverter(schema_1.getSchema(), this.view);
    };
    Controller.prototype.getCameraFromAttribute = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var userCamera, cameraAttr, cameras, userCameraId_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cameraAttr = this.lazyAttributeConverter[schema_1.Attribute.CAMERA];
                        if (!((cameraAttr === null || cameraAttr === void 0 ? void 0 : cameraAttr.deviceId) != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, __1.CameraAccess.getCameras()];
                    case 1:
                        cameras = _a.sent();
                        userCameraId_1 = cameraAttr.deviceId;
                        userCamera = cameras.find(function (camera) {
                            return camera.deviceId === userCameraId_1;
                        });
                        if (userCamera == null) {
                            console.warn("Could not find camera with id \"" + userCameraId_1 + "\", will use default camera.");
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, userCamera];
                }
            });
        });
    };
    Controller.prototype.onEnabledSymbologiesChanged = function () {
        var _this = this;
        var symbologiesToEnable = this.lazyAttributeConverter[schema_1.Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES];
        this.allSymbologies.forEach(function (symbology) {
            var shouldEnable = symbologiesToEnable.includes(symbology);
            _this.scanSettings.getSymbologySettings(symbology).setEnabled(shouldEnable);
        });
        this.picker.applyScanSettings(this.scanSettings);
    };
    // tslint:disable-next-line: no-any
    Controller.prototype.onPickerPropertyUpdate = function (change) {
        var _this = this;
        var _a, _b;
        // we need to map the private property name to our "public" properties
        var mappingsByOrigin = {
            gui: {
                customLaserArea: [schema_1.Attribute.LASER_AREA],
                customViewfinderArea: [schema_1.Attribute.VIEWFINDER_AREA],
            },
            cameraManager: {
                activeCamera: [schema_1.Attribute.CAMERA, schema_1.Attribute.CAMERA_TYPE],
                cameraSwitcherEnabled: [schema_1.Attribute.ENABLE_CAMERA_SWITCHER],
                torchToggleEnabled: [schema_1.Attribute.ENABLE_TORCH_TOGGLE],
                tapToFocusEnabled: [schema_1.Attribute.ENABLE_TAP_TO_FOCUS],
                pinchToZoomEnabled: [schema_1.Attribute.ENABLE_PINCH_TO_ZOOM],
            },
        };
        var propertyNames = (_b = (_a = mappingsByOrigin[change.origin]) === null || _a === void 0 ? void 0 : _a[change.key]) !== null && _b !== void 0 ? _b : [change.key];
        this.trackAttributes = false;
        propertyNames.forEach(function (propertyName) {
            if (schema_1.attributes.includes(propertyName)) {
                if (change.newValue == null) {
                    _this.view.removeAttribute(propertyName);
                }
                else {
                    _this.view.setAttribute(propertyName, propertyConverter_1.convertProperty(schema_1.getSchema()[propertyName], change.newValue));
                }
            }
        });
        this.trackAttributes = true;
    };
    Controller.prototype.getSingleImageModeSettings = function () {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var settings;
            var _this = this;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        settings = {};
                        if (this.lazyAttributeConverter[schema_1.Attribute.SINGLE_IMAGE_MODE_SETTINGS] != null) {
                            // merge settings from user
                            settings.desktop = tslib_1.__assign(tslib_1.__assign({}, singleImageModeSettings_1.SingleImageModeSettings.defaultDesktop), ((_a = this.lazyAttributeConverter[schema_1.Attribute.SINGLE_IMAGE_MODE_SETTINGS].desktop) !== null && _a !== void 0 ? _a : {}));
                            settings.mobile = tslib_1.__assign(tslib_1.__assign({}, singleImageModeSettings_1.SingleImageModeSettings.defaultMobile), ((_b = this.lazyAttributeConverter[schema_1.Attribute.SINGLE_IMAGE_MODE_SETTINGS].mobile) !== null && _b !== void 0 ? _b : {}));
                        }
                        // children may not have been parsed yet
                        return [4 /*yield*/, this.view.waitOnChildrenReady()];
                    case 1:
                        // children may not have been parsed yet
                        _c.sent();
                        // This parts will slightly hurt your eyes because of TS: basically we just loop over "desktop" and "mobile", and
                        // loop again inside over the HTML elements that can be set with slot.
                        ["mobile", "desktop"].forEach(function (platform) {
                            ["informationElement", "buttonElement"].forEach(function (platformSetting) {
                                var el = _this.view.querySelector("*[slot=\"singleImageModeSettings." + platform + "." + platformSetting + "\"]");
                                if (el != null && settings[platform] != null) {
                                    // tslint:disable-next-line: no-non-null-assertion no-any
                                    settings[platform][platformSetting] = el;
                                }
                            });
                        });
                        return [2 /*return*/, settings];
                }
            });
        });
    };
    Controller.prototype.dispatchPickerEvent = function (eventName, scanResultOrError) {
        var event = new CustomEvent(eventName, { detail: scanResultOrError });
        this.view.dispatchCustomEvent(event);
    };
    Controller.prototype.validateAllAttributes = function () {
        var _this = this;
        var attrs = Array.from(this.view.getAttributes());
        attrs.forEach(function (attr) {
            if (schema_1.attributes.includes(attr.name)) {
                _this.validateAttribute(attr.name, attr.value);
            }
        });
    };
    Controller.prototype.validateAttribute = function (name, value) {
        var _a;
        var normalizedAttribute = this.attributeToCamelCase(name);
        var validatorFunction;
        switch (normalizedAttribute) {
            case schema_1.Attribute.ACCESS_CAMERA:
            case schema_1.Attribute.CONFIGURE:
            case schema_1.Attribute.ENABLE_CAMERA_SWITCHER:
            case schema_1.Attribute.ENABLE_PINCH_TO_ZOOM:
            case schema_1.Attribute.ENABLE_TAP_TO_FOCUS:
            case schema_1.Attribute.ENABLE_TORCH_TOGGLE:
            case schema_1.Attribute.PLAY_SOUND_ON_SCAN:
            case schema_1.Attribute.SCANNING_PAUSED:
            case schema_1.Attribute.VIBRATE_ON_SCAN:
            case schema_1.Attribute.VISIBLE:
            case schema_1.Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION:
            case schema_1.Attribute.SCAN_SETTINGS_GPU_ACCELERATION:
                validatorFunction = validator_1.Validator.isBooleanAttribute;
                break;
            case schema_1.Attribute.TARGET_SCANNING_FPS:
            case schema_1.Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER:
            case schema_1.Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME:
                validatorFunction = validator_1.Validator.isIntegerAttribute;
                break;
            case schema_1.Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT:
                validatorFunction = validator_1.Validator.isValidCodeDirection;
                break;
            case schema_1.Attribute.CAMERA_TYPE:
                validatorFunction = validator_1.Validator.isValidCameraType;
                break;
            case schema_1.Attribute.GUI_STYLE:
                validatorFunction = validator_1.Validator.isValidGuiStyle;
                break;
            case schema_1.Attribute.VIDEO_FIT:
                validatorFunction = validator_1.Validator.isValidVideoFit;
                break;
            case schema_1.Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES:
                validatorFunction = validator_1.Validator.isValidJsonArray;
                break;
            case schema_1.Attribute.VIEWFINDER_AREA:
            case schema_1.Attribute.LASER_AREA:
            case schema_1.Attribute.SCAN_SETTINGS_SEARCH_AREA:
                validatorFunction = validator_1.Validator.isValidSearchAreaAttribute;
                break;
            case schema_1.Attribute.CAMERA:
                validatorFunction = validator_1.Validator.isValidCameraObject;
                break;
            case schema_1.Attribute.CAMERA_SETTINGS:
                validatorFunction = validator_1.Validator.isValidCameraSettingsObject;
                break;
            case schema_1.Attribute.SINGLE_IMAGE_MODE_SETTINGS:
                validatorFunction = validator_1.Validator.isValidSingleImageModeSettingsObject;
                break;
            case schema_1.Attribute.CONFIGURE_ENGINE_LOCATION:
            case schema_1.Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION:
            case schema_1.Attribute.CONFIGURE_LICENSE_KEY:
            case schema_1.Attribute.CONFIGURE_PRELOAD_ENGINE:
                validatorFunction = function () {
                    return true;
                };
                break;
            default:
                tsHelper_1.assertUnreachable(normalizedAttribute);
                break;
        }
        if (!validatorFunction(value)) {
            console.warn("Invalid value for attribute \"" + normalizedAttribute + "\": \"" + value + "\". " + ((_a = validator_1.Validator.expectationMessage.get(validatorFunction)) !== null && _a !== void 0 ? _a : ""));
            return false;
        }
        return true;
    };
    /**
     * Transform the given attribute name to its camel-cased version.
     *
     * @param attrName The attribute name, possibly all lower-cased
     * @returns camel-cased attribute name
     */
    Controller.prototype.attributeToCamelCase = function (attrName) {
        var index = schema_1.attributes.findIndex(function (k) {
            return k.toLowerCase() === attrName.toLowerCase();
        });
        return schema_1.attributes[index];
    };
    Controller.prototype.handleException = function (e) {
        console.error(e);
    };
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=controller.js.map