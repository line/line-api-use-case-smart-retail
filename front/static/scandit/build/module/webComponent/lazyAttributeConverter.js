import { convertAttribute } from "./attributeConverter";
import { Attribute } from "./schema";
export class LazyAttributeConverter {
    constructor(schema, view) {
        this.schema = schema;
        this.view = view;
    }
    get [Attribute.ACCESS_CAMERA]() {
        return this.convertToPrimary(Attribute.ACCESS_CAMERA);
    }
    get [Attribute.CAMERA]() {
        return this.convertToPrimary(Attribute.CAMERA);
    }
    get [Attribute.CAMERA_SETTINGS]() {
        return this.convertToPrimary(Attribute.CAMERA_SETTINGS);
    }
    get [Attribute.CAMERA_TYPE]() {
        return this.convertToPrimary(Attribute.CAMERA_TYPE);
    }
    get [Attribute.CONFIGURE]() {
        return this.convertToPrimary(Attribute.CONFIGURE);
    }
    get [Attribute.ENABLE_CAMERA_SWITCHER]() {
        return this.convertToPrimary(Attribute.ENABLE_CAMERA_SWITCHER);
    }
    get [Attribute.ENABLE_PINCH_TO_ZOOM]() {
        return this.convertToPrimary(Attribute.ENABLE_PINCH_TO_ZOOM);
    }
    get [Attribute.ENABLE_TAP_TO_FOCUS]() {
        return this.convertToPrimary(Attribute.ENABLE_TAP_TO_FOCUS);
    }
    get [Attribute.ENABLE_TORCH_TOGGLE]() {
        return this.convertToPrimary(Attribute.ENABLE_TORCH_TOGGLE);
    }
    get [Attribute.GUI_STYLE]() {
        return this.convertToPrimary(Attribute.GUI_STYLE);
    }
    get [Attribute.LASER_AREA]() {
        return this.convertToPrimary(Attribute.LASER_AREA);
    }
    get [Attribute.PLAY_SOUND_ON_SCAN]() {
        return this.convertToPrimary(Attribute.PLAY_SOUND_ON_SCAN);
    }
    get [Attribute.SCANNING_PAUSED]() {
        return this.convertToPrimary(Attribute.SCANNING_PAUSED);
    }
    get [Attribute.SINGLE_IMAGE_MODE_SETTINGS]() {
        return this.convertToPrimary(Attribute.SINGLE_IMAGE_MODE_SETTINGS);
    }
    get [Attribute.TARGET_SCANNING_FPS]() {
        return this.convertToPrimary(Attribute.TARGET_SCANNING_FPS);
    }
    get [Attribute.VIBRATE_ON_SCAN]() {
        return this.convertToPrimary(Attribute.VIBRATE_ON_SCAN);
    }
    get [Attribute.VIDEO_FIT]() {
        return this.convertToPrimary(Attribute.VIDEO_FIT);
    }
    get [Attribute.VIEWFINDER_AREA]() {
        return this.convertToPrimary(Attribute.VIEWFINDER_AREA);
    }
    get [Attribute.VISIBLE]() {
        return this.convertToPrimary(Attribute.VISIBLE);
    }
    get [Attribute.CONFIGURE_ENGINE_LOCATION]() {
        return this.convertToPrimary(Attribute.CONFIGURE_ENGINE_LOCATION);
    }
    get [Attribute.CONFIGURE_LICENSE_KEY]() {
        return this.convertToPrimary(Attribute.CONFIGURE_LICENSE_KEY);
    }
    get [Attribute.CONFIGURE_PRELOAD_ENGINE]() {
        return this.convertToPrimary(Attribute.CONFIGURE_PRELOAD_ENGINE);
    }
    get [Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION]() {
        return this.convertToPrimary(Attribute.CONFIGURE_PRELOAD_BLURRY_RECOGNITION);
    }
    get [Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION]() {
        return this.convertToPrimary(Attribute.SCAN_SETTINGS_BLURRY_RECOGNITION);
    }
    get [Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT]() {
        return this.convertToPrimary(Attribute.SCAN_SETTINGS_CODE_DIRECTION_HINT);
    }
    get [Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER]() {
        return this.convertToPrimary(Attribute.SCAN_SETTINGS_CODE_DUPLICATE_FILTER);
    }
    get [Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES]() {
        return this.convertToPrimary(Attribute.SCAN_SETTINGS_ENABLED_SYMBOLOGIES);
    }
    get [Attribute.SCAN_SETTINGS_GPU_ACCELERATION]() {
        return this.convertToPrimary(Attribute.SCAN_SETTINGS_GPU_ACCELERATION);
    }
    get [Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME]() {
        return this.convertToPrimary(Attribute.SCAN_SETTINGS_MAX_NUMBER_OF_CODES_PER_FRAME);
    }
    get [Attribute.SCAN_SETTINGS_SEARCH_AREA]() {
        return this.convertToPrimary(Attribute.SCAN_SETTINGS_SEARCH_AREA);
    }
    convertToPrimary(attribute) {
        return convertAttribute(this.schema[attribute], this.view.getAttribute(attribute));
    }
}
//# sourceMappingURL=lazyAttributeConverter.js.map