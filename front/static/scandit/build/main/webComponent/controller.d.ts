import { BarcodePicker } from "..";
import { BarcodePickerView } from "./barcodePickerView";
export declare class Controller {
    view: BarcodePickerView;
    picker: BarcodePicker;
    private lazyAttributeConverter;
    private scanSettings;
    private viewConnected;
    private trackAttributes;
    private readonly allSymbologies;
    constructor(view: BarcodePickerView);
    viewConnectedCallback(): Promise<void>;
    attributeChangedCallback(name: string): void;
    viewDisconnectedCallback(): void;
    private applyChangeFromAttributeChange;
    private initPicker;
    private getBarcodePickerProxyHandler;
    /**
     * Gather all settings from the passed scan settings and call `propertyDidUpdate`
     * to notify about the new settings.
     *
     * @param scanSettings The newly applied scan settings
     */
    private onScannerNewScanSettings;
    /**
     * for each attribute we support, define a property on the "primaryValues" object to get the attribute and convert
     * it to its primary type (e.g. the string "true" would become the real boolean value `true`)
     */
    private initializeAttributeConversionGetter;
    private getCameraFromAttribute;
    private onEnabledSymbologiesChanged;
    private onPickerPropertyUpdate;
    private getSingleImageModeSettings;
    private dispatchPickerEvent;
    private validateAllAttributes;
    private validateAttribute;
    /**
     * Transform the given attribute name to its camel-cased version.
     *
     * @param attrName The attribute name, possibly all lower-cased
     * @returns camel-cased attribute name
     */
    private attributeToCamelCase;
    private handleException;
}
