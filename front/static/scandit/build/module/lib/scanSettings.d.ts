import { Barcode } from "./barcode";
import { SearchArea } from "./searchArea";
import { SymbologySettings } from "./symbologySettings";
/**
 * @hidden
 */
declare type SymbologyParameter = Barcode.Symbology | Barcode.Symbology[] | Set<Barcode.Symbology>;
/**
 * A configuration object for scanning options.
 *
 * Modified ScanSettings need to be applied to a scanner via
 * [[BarcodePicker.applyScanSettings]] or [[Scanner.applyScanSettings]] to take effect.
 */
export declare class ScanSettings {
    private readonly symbologySettings;
    private readonly properties;
    private codeDuplicateFilter;
    private maxNumberOfCodesPerFrame;
    private baseSearchArea;
    private searchArea;
    private gpuAcceleration;
    private blurryRecognition;
    private codeDirectionHint;
    /**
     * Create a ScanSettings instance.
     *
     * @param enabledSymbologies <div class="tsd-signature-symbol">Default =&nbsp;[]</div>
     * The single symbology or list/set of symbologies that should be initialized as enabled for recognition.
     * @param codeDuplicateFilter <div class="tsd-signature-symbol">Default =&nbsp;0</div>
     * The duplicate filter specifying how often a code can be scanned.
     * When the filter is set to -1, each unique code is only scanned once. When set to 0,
     * duplicate filtering is disabled. Otherwise the duplicate filter specifies an interval in milliseconds.
     * When the same code (data/symbology) is scanned within the specified interval it is filtered out as a duplicate.
     * @param maxNumberOfCodesPerFrame <div class="tsd-signature-symbol">Default =&nbsp;1</div>
     * The maximum number of barcodes to be recognized every frame.
     * @param searchArea <div class="tsd-signature-symbol">Default =&nbsp;{ x: 0, y: 0, width: 1.0, height: 1.0 }</div>
     * The area of the image in which barcodes are searched.
     * @param gpuAcceleration <div class="tsd-signature-symbol">Default =&nbsp;true</div>
     * Whether to enable/disable GPU support via WebGL, to provide faster and more accurate barcode localization.
     * The GPU can and will be used only if the browser also supports the needed technologies
     * ([WebGL](https://caniuse.com/#feat=webgl) and [OffscreenCanvas](https://caniuse.com/#feat=offscreencanvas)).
     * @param blurryRecognition <div class="tsd-signature-symbol">Default =&nbsp;true</div>
     * Whether to enable/disable blurry recognition, to allow accurate scanning capabilities for out-of-focus (1D) codes.
     * If enabled, more advanced algorithms are executed (and more resources/time is spent) every frame in order
     * to successfully locate/scan difficult codes.
     * @param codeDirectionHint <div class="tsd-signature-symbol">Default =&nbsp;CodeDirection.LEFT_TO_RIGHT</div>
     * The code direction hint telling in what direction 1D codes are most likely orientated.
     * More advanced algorithms are executed (and more resources/time is spent) every frame in order to successfully
     * locate/scan difficult codes for each of the possible directions resulting by the direction hint. Note that this
     * results in slow performance for `none` hints, average performance for `horizontal` and `vertical` hints and fast
     * performance for the remaining hints.
     */
    constructor({ enabledSymbologies, codeDuplicateFilter, maxNumberOfCodesPerFrame, searchArea, gpuAcceleration, blurryRecognition, codeDirectionHint, }?: {
        enabledSymbologies?: SymbologyParameter;
        codeDuplicateFilter?: number;
        maxNumberOfCodesPerFrame?: number;
        searchArea?: SearchArea;
        gpuAcceleration?: boolean;
        blurryRecognition?: boolean;
        codeDirectionHint?: ScanSettings.CodeDirection;
    });
    /**
     * @returns The configuration object as a JSON string.
     */
    toJSONString(): string;
    /**
     * Get the configuration object for a symbology (which can then be modified).
     *
     * @param symbology The symbology for which to retrieve the configuration.
     * @returns The symbology configuration object for the specified symbology.
     */
    getSymbologySettings(symbology: Barcode.Symbology): SymbologySettings;
    /**
     * Get the recognition enabled status for a symbology.
     *
     * By default no symbologies are enabled.
     *
     * @param symbology The symbology for which to retrieve the recognition enabled status.
     * @returns Whether the symbology enabled for recognition.
     */
    isSymbologyEnabled(symbology: Barcode.Symbology): boolean;
    /**
     * Enable recognition of a symbology or list/set of symbologies.
     *
     * By default no symbologies are enabled.
     *
     * @param symbology The single symbology or list/set of symbologies to enable.
     * @returns The updated [[ScanSettings]] object.
     */
    enableSymbologies(symbology: SymbologyParameter): ScanSettings;
    /**
     * Disable recognition of a symbology or list/set of symbologies.
     *
     * By default no symbologies are enabled.
     *
     * @param symbology The single symbology or list/set of symbologies to disable.
     * @returns The updated [[ScanSettings]] object.
     */
    disableSymbologies(symbology: SymbologyParameter): ScanSettings;
    /**
     * Get the code duplicate filter value.
     *
     * By default duplicate filtering is disabled.
     *
     * @returns The code duplicate filter value.
     */
    getCodeDuplicateFilter(): number;
    /**
     * Set the code duplicate filter value.
     *
     * When the filter is set to -1, each unique code is only scanned once. When set to 0,
     * duplicate filtering is disabled. Otherwise the duplicate filter specifies an interval in milliseconds.
     *
     * By default duplicate filtering is disabled.
     *
     * @param durationMilliseconds The new value (-1, 0, or positive integer).
     * @returns The updated [[ScanSettings]] object.
     */
    setCodeDuplicateFilter(durationMilliseconds: number): ScanSettings;
    /**
     * Get the maximum number of barcodes to be recognized every frame.
     *
     * By default the maximum number of barcodes per frame is 1.
     *
     * @returns The maximum number of barcodes per frame.
     */
    getMaxNumberOfCodesPerFrame(): number;
    /**
     * Set the maximum number of barcodes to be recognized every frame.
     *
     * By default the maximum number of barcodes per frame is 1.
     *
     * @param limit The new maximum number of barcodes per frame alue (non-zero positive integer).
     * @returns The updated [[ScanSettings]] object.
     */
    setMaxNumberOfCodesPerFrame(limit: number): ScanSettings;
    /**
     * Get the area of the image in which barcodes are searched.
     *
     * By default the whole area is searched.
     *
     * @returns The search area.
     */
    getSearchArea(): SearchArea;
    /**
     * Set the area of the image in which barcodes are searched.
     *
     * By default the whole area is searched.
     *
     * @param searchArea The new search area.
     * @returns The updated [[ScanSettings]] object.
     */
    setSearchArea(searchArea: SearchArea): ScanSettings;
    /**
     * @hidden
     *
     * @returns The base area of the image in which barcodes are searched.
     */
    getBaseSearchArea(): SearchArea;
    /**
     * @hidden
     *
     * Set the base area of the image in which barcodes are searched, this is set automatically by a [[BarcodePicker]]
     * and is combined with the searchArea to obtain the final combined search area.
     *
     * @param baseSearchArea The new base search area.
     * @returns The updated [[ScanSettings]] object.
     */
    setBaseSearchArea(baseSearchArea: SearchArea): ScanSettings;
    /**
     * Get the GPU acceleration enabled status.
     *
     * By default GPU acceleration is enabled.
     *
     * @returns Whether GPU acceleration is configured to be enabled ot not.
     */
    isGpuAccelerationEnabled(): boolean;
    /**
     * Enable or disable GPU acceleration.
     *
     * By default GPU acceleration is enabled.
     *
     * Provide faster and more accurate barcode localization.
     * The GPU will in any case be used only if the browser also supports the needed technologies
     * ([WebGL](https://caniuse.com/#feat=webgl) and [OffscreenCanvas](https://caniuse.com/#feat=offscreencanvas)).
     *
     * @param enabled Whether to enable or disable GPU acceleration.
     * @returns The updated [[ScanSettings]] object.
     */
    setGpuAccelerationEnabled(enabled: boolean): ScanSettings;
    /**
     * Get the blurry recognition enabled status.
     *
     * By default blurry recognition is enabled.
     *
     * @returns Whether blurry recognition is configured to be enabled ot not.
     */
    isBlurryRecognitionEnabled(): boolean;
    /**
     * Enable or disable blurry recognition.
     *
     * Allow accurate scanning capabilities for out-of-focus (1D) codes.
     * If enabled, more advanced algorithms are executed (and more resources/time is spent) every frame in order
     * to successfully locate/scan difficult codes.
     *
     * By default blurry recognition is enabled.
     *
     * @param enabled Whether to enable or disable blurry recognition.
     * @returns The updated [[ScanSettings]] object.
     */
    setBlurryRecognitionEnabled(enabled: boolean): ScanSettings;
    /**
     * Get the code direction hint telling in what direction 1D codes are most likely orientated.
     *
     * By default `left-to-right` is used.
     *
     * @returns The code direction hint.
     */
    getCodeDirectionHint(): ScanSettings.CodeDirection;
    /**
     * Set the code direction hint telling in what direction 1D codes are most likely orientated.
     *
     * More advanced algorithms are executed (and more resources/time is spent) every frame in order to successfully
     * locate/scan difficult codes for each of the possible directions resulting by the direction hint. Note that this
     * results in slow performance for `none` hints, average performance for `horizontal` and `vertical` hints and fast
     * performance for the remaining hints.
     *
     * By default `left-to-right` is used.
     *
     * @param codeDirectionHint The new code direction hint.
     * @returns The updated [[ScanSettings]] object.
     */
    setCodeDirectionHint(codeDirectionHint: ScanSettings.CodeDirection): ScanSettings;
    /**
     * Get a Scandit Engine library property.
     *
     * This function is for internal use only and any functionality that can be accessed through it can and will vanish
     * without public notice from one version to the next. Do not call this function unless you specifically have to.
     *
     * @param key The property name.
     * @returns The property value. For properties not previously set, -1 is returned.
     */
    getProperty(key: string): number;
    /**
     * Set a Scandit Engine library property.
     *
     * This function is for internal use only and any functionality that can be accessed through it can and will vanish
     * without public notice from one version to the next. Do not call this function unless you specifically have to.
     *
     * @param key The property name.
     * @param value The property value.
     * @returns The updated [[ScanSettings]] object.
     */
    setProperty(key: string, value: number): ScanSettings;
    private setSingleSymbologyEnabled;
    private setMultipleSymbologiesEnabled;
    private setSymbologiesEnabled;
}
export declare namespace ScanSettings {
    /**
     * Code direction used to hint 1D codes' orientation.
     */
    enum CodeDirection {
        /**
         * Left to right.
         */
        LEFT_TO_RIGHT = "left-to-right",
        /**
         * Right to left.
         */
        RIGHT_TO_LEFT = "right-to-left",
        /**
         * Bottom to top.
         */
        BOTTOM_TO_TOP = "bottom-to-top",
        /**
         * Top to bottom.
         */
        TOP_TO_BOTTOM = "top-to-bottom",
        /**
         * Left to right or right to left.
         */
        HORIZONTAL = "horizontal",
        /**
         * Bottom to top or top to bottom.
         */
        VERTICAL = "vertical",
        /**
         * Unknown.
         */
        NONE = "none"
    }
}
export {};
