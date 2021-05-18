import { Barcode } from "./barcode";
/**
 * A symbology-specific configuration object.
 *
 * See https://docs.scandit.com/stable/c_api/symbologies.html for more details.
 */
export declare class SymbologySettings {
    private readonly symbology;
    private enabled;
    private colorInvertedEnabled;
    private activeSymbolCounts;
    private extensions;
    private checksums;
    /**
     * @hidden
     *
     * Create a SymbologySettings instance.
     *
     * @param symbology The symbology for which to create the settings.
     * @param enabled <div class="tsd-signature-symbol">Default =&nbsp;false</div>
     * Whether the symbology is enabled for recognition.
     */
    constructor(symbology: Barcode.Symbology, enabled?: boolean);
    /**
     * @returns Whether the symbology enabled for recognition.
     */
    isEnabled(): boolean;
    /**
     * Enable or disable recognition of the symbology.
     *
     * @param enabled Whether the symbology is enabled for recognition.
     * @returns The updated [[SymbologySettings]] object.
     */
    setEnabled(enabled: boolean): SymbologySettings;
    /**
     * @returns Whether color inverted recognition is enabled.
     */
    isColorInvertedEnabled(): boolean;
    /**
     * Enable or disable recognition of inverted-color symbology (in addition to normal colors).
     *
     * @param enabled Whether color inverted recognition is enabled.
     * @returns The updated [[SymbologySettings]] object.
     */
    setColorInvertedEnabled(enabled: boolean): SymbologySettings;
    /**
     * Get the current list of active symbol counts.
     *
     * @returns The list of active symbol counts.
     */
    getActiveSymbolCounts(): number[];
    /**
     * Set the list of active symbol counts.
     *
     * If an empty or invalid symbol count range is given, the range will be set to its default value.
     *
     * @param activeSymbolCounts The list of active symbol counts.
     * @returns The updated [[SymbologySettings]] object.
     */
    setActiveSymbolCounts(activeSymbolCounts: number[]): SymbologySettings;
    /**
     * Set the (inclusive) range of active symbol counts.
     *
     * If an empty or invalid symbol count range is given, the range will be set to its default value.
     *
     * @param minCount The minimum accepted number of symbols.
     * @param maxCount The maximum accepted number of symbols.
     * @returns The updated [[SymbologySettings]] object.
     */
    setActiveSymbolCountsRange(minCount: number, maxCount: number): SymbologySettings;
    /**
     * Get the current set of enabled optional extensions.
     *
     * Note that the external Scandit Engine library will also use any applicable mandatory extension for the symbology.
     *
     * @returns The set of enabled extensions.
     */
    getEnabledExtensions(): Set<SymbologySettings.Extension>;
    /**
     * Enable an optional extension or list/set of optional extensions
     *
     * @param extension The single extension or list/set of extensions to enable.
     * @returns The updated [[SymbologySettings]] object.
     */
    enableExtensions(extension: SymbologySettings.Extension | SymbologySettings.Extension[] | Set<SymbologySettings.Extension>): SymbologySettings;
    /**
     * Disable an optional extension or list/set of optional extensions.
     *
     * @param extension The single extension or list/set of extensions to disable.
     * @returns The updated [[SymbologySettings]] object.
     */
    disableExtensions(extension: SymbologySettings.Extension | SymbologySettings.Extension[] | Set<SymbologySettings.Extension>): SymbologySettings;
    /**
     * Get the current set of enabled optional checksums.
     *
     * Note that the external Scandit Engine library will also use any applicable mandatory checksum for the symbology.
     *
     * @returns The set of enabled checksums.
     */
    getEnabledChecksums(): Set<SymbologySettings.Checksum>;
    /**
     * Enable an optional checksum or list/set of optional checksums.
     *
     * @param checksum The single checksum or list/set of checksums to enable.
     * @returns The updated [[SymbologySettings]] object.
     */
    enableChecksums(checksum: SymbologySettings.Checksum | SymbologySettings.Checksum[] | Set<SymbologySettings.Checksum>): SymbologySettings;
    /**
     * Disable an optional checksum or list/set of optional checksums.
     *
     * @param checksum The single checksum or list/set of checksums to disable.
     * @returns The updated [[SymbologySettings]] object.
     */
    disableChecksums(checksum: SymbologySettings.Checksum | SymbologySettings.Checksum[] | Set<SymbologySettings.Checksum>): SymbologySettings;
    protected toJSON(): object;
    private isValidExtension;
    private isValidChecksum;
}
export declare namespace SymbologySettings {
    /**
     * @hidden
     *
     * Get a range of numbers.
     *
     * @param from The range start (inclusive).
     * @param to The range end (inclusive).
     * @returns The range of numbers.
     */
    function getNumberRange(from: number, to: number): number[];
    /**
     * Symbology extensions for particular functionalities, only applicable to specific barcodes.
     * See: https://docs.scandit.com/stable/c_api/symbologies.html.
     */
    enum Extension {
        /**
         * Improve scan performance when reading direct part marked (DPM) Data Matrix codes.
         * Enabling this extension comes at the cost of increased frame processing times.
         */
        DIRECT_PART_MARKING_MODE = "direct_part_marking_mode",
        /**
         * Interpret the Code 39 / Code 93 code data using two symbols per output character to encode all ASCII characters.
         */
        FULL_ASCII = "full_ascii",
        /**
         * Enable scanning codes that have quiet zones (white area before and after the code) significantly smaller
         * than what's allowed by the symbology specification.
         */
        RELAXED_SHARP_QUIET_ZONE_CHECK = "relaxed_sharp_quiet_zone_check",
        /**
         * Remove the leading zero digit from the result.
         */
        REMOVE_LEADING_ZERO = "remove_leading_zero",
        /**
         * Remove the leading zero digit from the result if the UPC-A representation extension "RETURN_AS_UPCA" is enabled.
         */
        REMOVE_LEADING_UPCA_ZERO = "remove_leading_upca_zero",
        /**
         * Transform the UPC-E result into its UPC-A representation.
         */
        RETURN_AS_UPCA = "return_as_upca",
        /**
         * Remove the leading FNC1 character that indicates a GS1 code.
         */
        STRIP_LEADING_FNC1 = "strip_leading_fnc1"
    }
    /**
     * Checksum algorithms, only applicable to specific barcodes.
     * See: https://docs.scandit.com/stable/c_api/symbologies.html.
     */
    enum Checksum {
        /**
         * Modulo 10 checksum.
         */
        MOD_10 = "mod10",
        /**
         * Modulo 11 checksum.
         */
        MOD_11 = "mod11",
        /**
         * Modulo 16 checksum.
         */
        MOD_16 = "mod16",
        /**
         * Modulo 43 checksum.
         */
        MOD_43 = "mod43",
        /**
         * Modulo 47 checksum.
         */
        MOD_47 = "mod47",
        /**
         * Modulo 103 checksum.
         */
        MOD_103 = "mod103",
        /**
         * Two modulo 10 checksums.
         */
        MOD_1010 = "mod1010",
        /**
         * Modulo 11 and modulo 10 checksum.
         */
        MOD_1110 = "mod1110"
    }
    /**
     * @hidden
     */
    const defaultActiveSymbolCounts: Partial<Record<Barcode.Symbology, number[]>>;
    /**
     * @hidden
     */
    const defaultExtensions: Partial<Record<Barcode.Symbology, Extension[]>>;
    /**
     * @hidden
     */
    const defaultChecksums: Partial<Record<Barcode.Symbology, Checksum[]>>;
}
