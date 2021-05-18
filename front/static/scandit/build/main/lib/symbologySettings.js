"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbologySettings = void 0;
var tslib_1 = require("tslib");
var barcode_1 = require("./barcode");
/**
 * A symbology-specific configuration object.
 *
 * See https://docs.scandit.com/stable/c_api/symbologies.html for more details.
 */
var SymbologySettings = /** @class */ (function () {
    /**
     * @hidden
     *
     * Create a SymbologySettings instance.
     *
     * @param symbology The symbology for which to create the settings.
     * @param enabled <div class="tsd-signature-symbol">Default =&nbsp;false</div>
     * Whether the symbology is enabled for recognition.
     */
    function SymbologySettings(symbology, enabled) {
        if (enabled === void 0) { enabled = false; }
        var _a, _b, _c;
        this.symbology = symbology;
        this.enabled = enabled;
        this.colorInvertedEnabled = false;
        this.activeSymbolCounts = (_a = SymbologySettings.defaultActiveSymbolCounts[symbology]) !== null && _a !== void 0 ? _a : [];
        this.extensions = new Set((_b = SymbologySettings.defaultExtensions[symbology]) !== null && _b !== void 0 ? _b : []);
        this.checksums = new Set((_c = SymbologySettings.defaultChecksums[symbology]) !== null && _c !== void 0 ? _c : []);
    }
    /**
     * @returns Whether the symbology enabled for recognition.
     */
    SymbologySettings.prototype.isEnabled = function () {
        return this.enabled;
    };
    /**
     * Enable or disable recognition of the symbology.
     *
     * @param enabled Whether the symbology is enabled for recognition.
     * @returns The updated [[SymbologySettings]] object.
     */
    SymbologySettings.prototype.setEnabled = function (enabled) {
        this.enabled = enabled;
        return this;
    };
    /**
     * @returns Whether color inverted recognition is enabled.
     */
    SymbologySettings.prototype.isColorInvertedEnabled = function () {
        return this.colorInvertedEnabled;
    };
    /**
     * Enable or disable recognition of inverted-color symbology (in addition to normal colors).
     *
     * @param enabled Whether color inverted recognition is enabled.
     * @returns The updated [[SymbologySettings]] object.
     */
    SymbologySettings.prototype.setColorInvertedEnabled = function (enabled) {
        this.colorInvertedEnabled = enabled;
        return this;
    };
    /**
     * Get the current list of active symbol counts.
     *
     * @returns The list of active symbol counts.
     */
    SymbologySettings.prototype.getActiveSymbolCounts = function () {
        return this.activeSymbolCounts;
    };
    /**
     * Set the list of active symbol counts.
     *
     * If an empty or invalid symbol count range is given, the range will be set to its default value.
     *
     * @param activeSymbolCounts The list of active symbol counts.
     * @returns The updated [[SymbologySettings]] object.
     */
    SymbologySettings.prototype.setActiveSymbolCounts = function (activeSymbolCounts) {
        var _a;
        this.activeSymbolCounts = activeSymbolCounts;
        if (this.activeSymbolCounts.length === 0) {
            this.activeSymbolCounts = (_a = SymbologySettings.defaultActiveSymbolCounts[this.symbology]) !== null && _a !== void 0 ? _a : [];
        }
        return this;
    };
    /**
     * Set the (inclusive) range of active symbol counts.
     *
     * If an empty or invalid symbol count range is given, the range will be set to its default value.
     *
     * @param minCount The minimum accepted number of symbols.
     * @param maxCount The maximum accepted number of symbols.
     * @returns The updated [[SymbologySettings]] object.
     */
    SymbologySettings.prototype.setActiveSymbolCountsRange = function (minCount, maxCount) {
        var _a;
        this.activeSymbolCounts = SymbologySettings.getNumberRange(minCount, maxCount);
        if (this.activeSymbolCounts.length === 0) {
            this.activeSymbolCounts = (_a = SymbologySettings.defaultActiveSymbolCounts[this.symbology]) !== null && _a !== void 0 ? _a : [];
        }
        return this;
    };
    /**
     * Get the current set of enabled optional extensions.
     *
     * Note that the external Scandit Engine library will also use any applicable mandatory extension for the symbology.
     *
     * @returns The set of enabled extensions.
     */
    SymbologySettings.prototype.getEnabledExtensions = function () {
        return this.extensions;
    };
    /**
     * Enable an optional extension or list/set of optional extensions
     *
     * @param extension The single extension or list/set of extensions to enable.
     * @returns The updated [[SymbologySettings]] object.
     */
    SymbologySettings.prototype.enableExtensions = function (extension) {
        var _this = this;
        if (typeof extension === "object") {
            this.extensions = new Set(tslib_1.__spread(this.extensions, Array.from(extension).filter(function (e) {
                return _this.isValidExtension(e);
            })));
        }
        else if (this.isValidExtension(extension)) {
            this.extensions.add(extension);
        }
        return this;
    };
    /**
     * Disable an optional extension or list/set of optional extensions.
     *
     * @param extension The single extension or list/set of extensions to disable.
     * @returns The updated [[SymbologySettings]] object.
     */
    SymbologySettings.prototype.disableExtensions = function (extension) {
        if (typeof extension === "object") {
            this.extensions = new Set(tslib_1.__spread(this.extensions).filter(function (x) {
                return extension instanceof Array ? !extension.includes(x) : !extension.has(x);
            }));
        }
        else if (this.isValidExtension(extension)) {
            this.extensions.delete(extension);
        }
        return this;
    };
    /**
     * Get the current set of enabled optional checksums.
     *
     * Note that the external Scandit Engine library will also use any applicable mandatory checksum for the symbology.
     *
     * @returns The set of enabled checksums.
     */
    SymbologySettings.prototype.getEnabledChecksums = function () {
        return this.checksums;
    };
    /**
     * Enable an optional checksum or list/set of optional checksums.
     *
     * @param checksum The single checksum or list/set of checksums to enable.
     * @returns The updated [[SymbologySettings]] object.
     */
    SymbologySettings.prototype.enableChecksums = function (checksum) {
        var _this = this;
        if (typeof checksum === "object") {
            this.checksums = new Set(tslib_1.__spread(this.checksums, Array.from(checksum).filter(function (c) {
                return _this.isValidChecksum(c);
            })));
        }
        else if (this.isValidChecksum(checksum)) {
            this.checksums.add(checksum);
        }
        return this;
    };
    /**
     * Disable an optional checksum or list/set of optional checksums.
     *
     * @param checksum The single checksum or list/set of checksums to disable.
     * @returns The updated [[SymbologySettings]] object.
     */
    SymbologySettings.prototype.disableChecksums = function (checksum) {
        if (typeof checksum === "object") {
            this.checksums = new Set(tslib_1.__spread(this.checksums).filter(function (x) {
                return checksum instanceof Array ? !checksum.includes(x) : !checksum.has(x);
            }));
        }
        else if (this.isValidChecksum(checksum)) {
            this.checksums.delete(checksum);
        }
        return this;
    };
    SymbologySettings.prototype.toJSON = function () {
        return {
            enabled: this.enabled,
            colorInvertedEnabled: this.colorInvertedEnabled,
            activeSymbolCounts: this.activeSymbolCounts.length === 0 ? undefined : this.activeSymbolCounts,
            extensions: Array.from(this.extensions),
            checksums: Array.from(this.checksums),
        };
    };
    SymbologySettings.prototype.isValidExtension = function (extension) {
        return (extension in SymbologySettings.Extension ||
            Object.values(SymbologySettings.Extension).includes(extension.toLowerCase()));
    };
    SymbologySettings.prototype.isValidChecksum = function (checksum) {
        return (checksum in SymbologySettings.Checksum ||
            Object.values(SymbologySettings.Checksum).includes(checksum.toLowerCase()));
    };
    return SymbologySettings;
}());
exports.SymbologySettings = SymbologySettings;
// istanbul ignore next
(function (SymbologySettings) {
    var _a, _b, _c;
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
        return Array.from({ length: to - from + 1 }, function (_, k) {
            return k + from;
        });
    }
    SymbologySettings.getNumberRange = getNumberRange;
    /**
     * Symbology extensions for particular functionalities, only applicable to specific barcodes.
     * See: https://docs.scandit.com/stable/c_api/symbologies.html.
     */
    var Extension;
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
    var Checksum;
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
    SymbologySettings.defaultActiveSymbolCounts = (_a = {},
        _a[barcode_1.Barcode.Symbology.CODABAR] = getNumberRange(7, 20),
        _a[barcode_1.Barcode.Symbology.CODE11] = getNumberRange(7, 20),
        _a[barcode_1.Barcode.Symbology.CODE128] = getNumberRange(6, 40),
        _a[barcode_1.Barcode.Symbology.CODE25] = getNumberRange(7, 20),
        _a[barcode_1.Barcode.Symbology.CODE32] = [8],
        _a[barcode_1.Barcode.Symbology.CODE39] = getNumberRange(6, 40),
        _a[barcode_1.Barcode.Symbology.CODE93] = getNumberRange(6, 40),
        _a[barcode_1.Barcode.Symbology.EAN13] = [12],
        _a[barcode_1.Barcode.Symbology.EAN8] = [8],
        _a[barcode_1.Barcode.Symbology.FIVE_DIGIT_ADD_ON] = [5],
        _a[barcode_1.Barcode.Symbology.GS1_DATABAR_EXPANDED] = getNumberRange(1, 11),
        _a[barcode_1.Barcode.Symbology.GS1_DATABAR_LIMITED] = [1],
        _a[barcode_1.Barcode.Symbology.GS1_DATABAR] = [2],
        _a[barcode_1.Barcode.Symbology.IATA_2_OF_5] = getNumberRange(7, 20),
        _a[barcode_1.Barcode.Symbology.INTERLEAVED_2_OF_5] = getNumberRange(6, 40),
        _a[barcode_1.Barcode.Symbology.KIX] = getNumberRange(7, 24),
        _a[barcode_1.Barcode.Symbology.LAPA4SC] = [16],
        _a[barcode_1.Barcode.Symbology.MSI_PLESSEY] = getNumberRange(6, 32),
        _a[barcode_1.Barcode.Symbology.RM4SCC] = getNumberRange(7, 24),
        _a[barcode_1.Barcode.Symbology.TWO_DIGIT_ADD_ON] = [2],
        _a[barcode_1.Barcode.Symbology.UPCA] = [12],
        _a[barcode_1.Barcode.Symbology.UPCE] = [6],
        _a);
    /**
     * @hidden
     */
    SymbologySettings.defaultExtensions = (_b = {},
        _b[barcode_1.Barcode.Symbology.CODE128] = [Extension.STRIP_LEADING_FNC1],
        _b[barcode_1.Barcode.Symbology.DATA_MATRIX] = [Extension.STRIP_LEADING_FNC1],
        _b);
    /**
     * @hidden
     */
    SymbologySettings.defaultChecksums = (_c = {},
        _c[barcode_1.Barcode.Symbology.MSI_PLESSEY] = [Checksum.MOD_10],
        _c[barcode_1.Barcode.Symbology.CODE11] = [Checksum.MOD_11],
        _c);
})(SymbologySettings = exports.SymbologySettings || (exports.SymbologySettings = {}));
exports.SymbologySettings = SymbologySettings;
//# sourceMappingURL=symbologySettings.js.map