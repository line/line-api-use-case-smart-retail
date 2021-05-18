"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyAttributeConverter = void 0;
var attributeConverter_1 = require("./attributeConverter");
var schema_1 = require("./schema");
var LazyAttributeConverter = /** @class */ (function () {
    function LazyAttributeConverter(schema, view) {
        this.schema = schema;
        this.view = view;
    }
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.ACCESS_CAMERA, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.ACCESS_CAMERA);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.CAMERA, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.CAMERA);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.CAMERA_SETTINGS, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.CAMERA_SETTINGS);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.CAMERA_TYPE, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.CAMERA_TYPE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.CONFIGURE, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.CONFIGURE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.ENABLE_CAMERA_SWITCHER, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.ENABLE_CAMERA_SWITCHER);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.ENABLE_PINCH_TO_ZOOM, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.ENABLE_PINCH_TO_ZOOM);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.ENABLE_TAP_TO_FOCUS, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.ENABLE_TAP_TO_FOCUS);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.ENABLE_TORCH_TOGGLE, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.ENABLE_TORCH_TOGGLE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.GUI_STYLE, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.GUI_STYLE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.LASER_AREA, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.LASER_AREA);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.PLAY_SOUND_ON_SCAN, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.PLAY_SOUND_ON_SCAN);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.SCANNING_PAUSED, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.SCANNING_PAUSED);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.SINGLE_IMAGE_MODE_SETTINGS, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.SINGLE_IMAGE_MODE_SETTINGS);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.TARGET_SCANNING_FPS, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.TARGET_SCANNING_FPS);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.VIBRATE_ON_SCAN, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.VIBRATE_ON_SCAN);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.VIDEO_FIT, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.VIDEO_FIT);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.VIEWFINDER_AREA, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.VIEWFINDER_AREA);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.VISIBLE, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.VISIBLE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.CONFIGURE_ENGINE_LOCATION, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.CONFIGURE_ENGINE_LOCATION);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.CONFIGURE_LICENSE_KEY, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.CONFIGURE_LICENSE_KEY);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.CONFIGURE_PRELOAD_ENGINE, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.CONFIGURE_PRELOAD_ENGINE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.SCAN_SETTINGS_GPU_ACCELERATION, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.SCAN_SETTINGS_GPU_ACCELERATION);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LazyAttributeConverter.prototype, schema_1.Attribute.SCAN_SETTINGS_SEARCH_AREA, {
        get: function () {
            return this.convertToPrimary(schema_1.Attribute.SCAN_SETTINGS_SEARCH_AREA);
        },
        enumerable: false,
        configurable: true
    });
    LazyAttributeConverter.prototype.convertToPrimary = function (attribute) {
        return attributeConverter_1.convertAttribute(this.schema[attribute], this.view.getAttribute(attribute));
    };
    return LazyAttributeConverter;
}());
exports.LazyAttributeConverter = LazyAttributeConverter;
//# sourceMappingURL=lazyAttributeConverter.js.map