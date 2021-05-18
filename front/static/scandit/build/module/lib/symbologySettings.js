import { Barcode } from "./barcode";
/**
 * A symbology-specific configuration object.
 *
 * See https://docs.scandit.com/stable/c_api/symbologies.html for more details.
 */
export class SymbologySettings {
    /**
     * @hidden
     *
     * Create a SymbologySettings instance.
     *
     * @param symbology The symbology for which to create the settings.
     * @param enabled <div class="tsd-signature-symbol">Default =&nbsp;false</div>
     * Whether the symbology is enabled for recognition.
     */
    constructor(symbology, enabled = false) {
        this.symbology = symbology;
        this.enabled = enabled;
        this.colorInvertedEnabled = false;
        this.activeSymbolCounts = SymbologySettings.defaultActiveSymbolCounts[symbology] ?? [];
        this.extensions = new Set(SymbologySettings.defaultExtensions[symbology] ?? []);
        this.checksums = new Set(SymbologySettings.defaultChecksums[symbology] ?? []);
    }
    /**
     * @returns Whether the symbology enabled for recognition.
     */
    isEnabled() {
        return this.enabled;
    }
    /**
     * Enable or disable recognition of the symbology.
     *
     * @param enabled Whether the symbology is enabled for recognition.
     * @returns The updated [[SymbologySettings]] object.
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        return this;
    }
    /**
     * @returns Whether color inverted recognition is enabled.
     */
    isColorInvertedEnabled() {
        return this.colorInvertedEnabled;
    }
    /**
     * Enable or disable recognition of inverted-color symbology (in addition to normal colors).
     *
     * @param enabled Whether color inverted recognition is enabled.
     * @returns The updated [[SymbologySettings]] object.
     */
    setColorInvertedEnabled(enabled) {
        this.colorInvertedEnabled = enabled;
        return this;
    }
    /**
     * Get the current list of active symbol counts.
     *
     * @returns The list of active symbol counts.
     */
    getActiveSymbolCounts() {
        return this.activeSymbolCounts;
    }
    /**
     * Set the list of active symbol counts.
     *
     * If an empty or invalid symbol count range is given, the range will be set to its default value.
     *
     * @param activeSymbolCounts The list of active symbol counts.
     * @returns The updated [[SymbologySettings]] object.
     */
    setActiveSymbolCounts(activeSymbolCounts) {
        this.activeSymbolCounts = activeSymbolCounts;
        if (this.activeSymbolCounts.length === 0) {
            this.activeSymbolCounts = SymbologySettings.defaultActiveSymbolCounts[this.symbology] ?? [];
        }
        return this;
    }
    /**
     * Set the (inclusive) range of active symbol counts.
     *
     * If an empty or invalid symbol count range is given, the range will be set to its default value.
     *
     * @param minCount The minimum accepted number of symbols.
     * @param maxCount The maximum accepted number of symbols.
     * @returns The updated [[SymbologySettings]] object.
     */
    setActiveSymbolCountsRange(minCount, maxCount) {
        this.activeSymbolCounts = SymbologySettings.getNumberRange(minCount, maxCount);
        if (this.activeSymbolCounts.length === 0) {
            this.activeSymbolCounts = SymbologySettings.defaultActiveSymbolCounts[this.symbology] ?? [];
        }
        return this;
    }
    /**
     * Get the current set of enabled optional extensions.
     *
     * Note that the external Scandit Engine library will also use any applicable mandatory extension for the symbology.
     *
     * @returns The set of enabled extensions.
     */
    getEnabledExtensions() {
        return this.extensions;
    }
    /**
     * Enable an optional extension or list/set of optional extensions
     *
     * @param extension The single extension or list/set of extensions to enable.
     * @returns The updated [[SymbologySettings]] object.
     */
    enableExtensions(extension) {
        if (typeof extension === "object") {
            this.extensions = new Set([
                ...this.extensions,
                ...Array.from(extension).filter((e) => {
                    return this.isValidExtension(e);
                }),
            ]);
        }
        else if (this.isValidExtension(extension)) {
            this.extensions.add(extension);
        }
        return this;
    }
    /**
     * Disable an optional extension or list/set of optional extensions.
     *
     * @param extension The single extension or list/set of extensions to disable.
     * @returns The updated [[SymbologySettings]] object.
     */
    disableExtensions(extension) {
        if (typeof extension === "object") {
            this.extensions = new Set([...this.extensions].filter((x) => {
                return extension instanceof Array ? !extension.includes(x) : !extension.has(x);
            }));
        }
        else if (this.isValidExtension(extension)) {
            this.extensions.delete(extension);
        }
        return this;
    }
    /**
     * Get the current set of enabled optional checksums.
     *
     * Note that the external Scandit Engine library will also use any applicable mandatory checksum for the symbology.
     *
     * @returns The set of enabled checksums.
     */
    getEnabledChecksums() {
        return this.checksums;
    }
    /**
     * Enable an optional checksum or list/set of optional checksums.
     *
     * @param checksum The single checksum or list/set of checksums to enable.
     * @returns The updated [[SymbologySettings]] object.
     */
    enableChecksums(checksum) {
        if (typeof checksum === "object") {
            this.checksums = new Set([
                ...this.checksums,
                ...Array.from(checksum).filter((c) => {
                    return this.isValidChecksum(c);
                }),
            ]);
        }
        else if (this.isValidChecksum(checksum)) {
            this.checksums.add(checksum);
        }
        return this;
    }
    /**
     * Disable an optional checksum or list/set of optional checksums.
     *
     * @param checksum The single checksum or list/set of checksums to disable.
     * @returns The updated [[SymbologySettings]] object.
     */
    disableChecksums(checksum) {
        if (typeof checksum === "object") {
            this.checksums = new Set([...this.checksums].filter((x) => {
                return checksum instanceof Array ? !checksum.includes(x) : !checksum.has(x);
            }));
        }
        else if (this.isValidChecksum(checksum)) {
            this.checksums.delete(checksum);
        }
        return this;
    }
    toJSON() {
        return {
            enabled: this.enabled,
            colorInvertedEnabled: this.colorInvertedEnabled,
            activeSymbolCounts: this.activeSymbolCounts.length === 0 ? undefined : this.activeSymbolCounts,
            extensions: Array.from(this.extensions),
            checksums: Array.from(this.checksums),
        };
    }
    isValidExtension(extension) {
        return (extension in SymbologySettings.Extension ||
            Object.values(SymbologySettings.Extension).includes(extension.toLowerCase()));
    }
    isValidChecksum(checksum) {
        return (checksum in SymbologySettings.Checksum ||
            Object.values(SymbologySettings.Checksum).includes(checksum.toLowerCase()));
    }
}
// istanbul ignore next
(function (SymbologySettings) {
    /**
     * @hidden
     *
     * Get a range of numbers.
     *
     * @param from The range start (inclusive).
     * @param to The range end (inclusive).
     * @returns The range of numbers.
     */
    function getNumberRange(from, to) {
        return Array.from({ length: to - from + 1 }, (_, k) => {
            return k + from;
        });
    }
    SymbologySettings.getNumberRange = getNumberRange;
    /**
     * Symbology extensions for particular functionalities, only applicable to specific barcodes.
     * See: https://docs.scandit.com/stable/c_api/symbologies.html.
     */
    let Extension;
    (function (Extension) {
        /**
         * Improve scan performance when reading direct part marked (DPM) Data Matrix codes.
         * Enabling this extension comes at the cost of increased frame processing times.
         */
        Extension["DIRECT_PART_MARKING_MODE"] = "direct_part_marking_mode";
        /**
         * Interpret the Code 39 / Code 93 code data using two symbols per output character to encode all ASCII characters.
         */
        Extension["FULL_ASCII"] = "full_ascii";
        /**
         * Enable scanning codes that have quiet zones (white area before and after the code) significantly smaller
         * than what's allowed by the symbology specification.
         */
        Extension["RELAXED_SHARP_QUIET_ZONE_CHECK"] = "relaxed_sharp_quiet_zone_check";
        /**
         * Remove the leading zero digit from the result.
         */
        Extension["REMOVE_LEADING_ZERO"] = "remove_leading_zero";
        /**
         * Remove the leading zero digit from the result if the UPC-A representation extension "RETURN_AS_UPCA" is enabled.
         */
        Extension["REMOVE_LEADING_UPCA_ZERO"] = "remove_leading_upca_zero";
        /**
         * Transform the UPC-E result into its UPC-A representation.
         */
        Extension["RETURN_AS_UPCA"] = "return_as_upca";
        /**
         * Remove the leading FNC1 character that indicates a GS1 code.
         */
        Extension["STRIP_LEADING_FNC1"] = "strip_leading_fnc1";
    })(Extension = SymbologySettings.Extension || (SymbologySettings.Extension = {}));
    /**
     * Checksum algorithms, only applicable to specific barcodes.
     * See: https://docs.scandit.com/stable/c_api/symbologies.html.
     */
    let Checksum;
    (function (Checksum) {
        /**
         * Modulo 10 checksum.
         */
        Checksum["MOD_10"] = "mod10";
        /**
         * Modulo 11 checksum.
         */
        Checksum["MOD_11"] = "mod11";
        /**
         * Modulo 16 checksum.
         */
        Checksum["MOD_16"] = "mod16";
        /**
         * Modulo 43 checksum.
         */
        Checksum["MOD_43"] = "mod43";
        /**
         * Modulo 47 checksum.
         */
        Checksum["MOD_47"] = "mod47";
        /**
         * Modulo 103 checksum.
         */
        Checksum["MOD_103"] = "mod103";
        /**
         * Two modulo 10 checksums.
         */
        Checksum["MOD_1010"] = "mod1010";
        /**
         * Modulo 11 and modulo 10 checksum.
         */
        Checksum["MOD_1110"] = "mod1110";
    })(Checksum = SymbologySettings.Checksum || (SymbologySettings.Checksum = {}));
    /**
     * @hidden
     */
    SymbologySettings.defaultActiveSymbolCounts = {
        [Barcode.Symbology.CODABAR]: getNumberRange(7, 20),
        [Barcode.Symbology.CODE11]: getNumberRange(7, 20),
        [Barcode.Symbology.CODE128]: getNumberRange(6, 40),
        [Barcode.Symbology.CODE25]: getNumberRange(7, 20),
        [Barcode.Symbology.CODE32]: [8],
        [Barcode.Symbology.CODE39]: getNumberRange(6, 40),
        [Barcode.Symbology.CODE93]: getNumberRange(6, 40),
        [Barcode.Symbology.EAN13]: [12],
        [Barcode.Symbology.EAN8]: [8],
        [Barcode.Symbology.FIVE_DIGIT_ADD_ON]: [5],
        [Barcode.Symbology.GS1_DATABAR_EXPANDED]: getNumberRange(1, 11),
        [Barcode.Symbology.GS1_DATABAR_LIMITED]: [1],
        [Barcode.Symbology.GS1_DATABAR]: [2],
        [Barcode.Symbology.IATA_2_OF_5]: getNumberRange(7, 20),
        [Barcode.Symbology.INTERLEAVED_2_OF_5]: getNumberRange(6, 40),
        [Barcode.Symbology.KIX]: getNumberRange(7, 24),
        [Barcode.Symbology.LAPA4SC]: [16],
        [Barcode.Symbology.MSI_PLESSEY]: getNumberRange(6, 32),
        [Barcode.Symbology.RM4SCC]: getNumberRange(7, 24),
        [Barcode.Symbology.TWO_DIGIT_ADD_ON]: [2],
        [Barcode.Symbology.UPCA]: [12],
        [Barcode.Symbology.UPCE]: [6],
    };
    /**
     * @hidden
     */
    SymbologySettings.defaultExtensions = {
        [Barcode.Symbology.CODE128]: [Extension.STRIP_LEADING_FNC1],
        [Barcode.Symbology.DATA_MATRIX]: [Extension.STRIP_LEADING_FNC1],
    };
    /**
     * @hidden
     */
    SymbologySettings.defaultChecksums = {
        [Barcode.Symbology.MSI_PLESSEY]: [Checksum.MOD_10],
        [Barcode.Symbology.CODE11]: [Checksum.MOD_11],
    };
})(SymbologySettings || (SymbologySettings = {}));
//# sourceMappingURL=symbologySettings.js.map