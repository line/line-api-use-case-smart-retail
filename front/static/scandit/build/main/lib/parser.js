"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
/**
 * A data string parser.
 *
 * Parsers are capable of parsing one particular data format, which is passed to them during construction.
 *
 * The parser is created through [[BarcodePicker.createParserForFormat]] or [[Scanner.createParserForFormat]].
 *
 * Note that you need to have a valid license key with the parsing feature enabled to use the parser functionalities.
 *
 * For documentation on the available formats, check the official parser library documentation here:
 * https://docs.scandit.com/parser/formats.html.
 */
var Parser = /** @class */ (function () {
    /**
     * @hidden
     *
     * @param scanner The [[Scanner]] object used to interact with the external Scandit library.
     * @param dataFormat The data format for this parser.
     */
    function Parser(scanner, dataFormat) {
        this.scanner = scanner;
        this.dataFormat = dataFormat;
    }
    /**
     * Apply the option map to the parser, allowing the user to fine-tune the behaviour of the parser.
     * Available options depend on the data format and are specified in the respective documentation.
     *
     * @param options The new options to be applied (replacing previous ones, if any).
     */
    Parser.prototype.setOptions = function (options) {
        this.options = options;
    };
    /**
     * Process the given raw (byte array) data with the parser, retrieving the result as a [[ParserResult]] object.
     *
     * Multiple requests done without waiting for previous results will be queued and handled in order.
     *
     * If parsing of the data fails the returned promise is rejected with a `ScanditEngineError` error.
     *
     * @param rawData The raw (byte array) data to be parsed.
     * @returns A promise resolving to the [[ParserResult]] object.
     */
    Parser.prototype.parseRawData = function (rawData) {
        return this.scanner.parse(this.dataFormat, rawData, this.options);
    };
    /**
     * Process the given string data with the parser, retrieving the result as a [[ParserResult]] object.
     *
     * Multiple requests done without waiting for previous results will be queued and handled in order.
     *
     * If parsing of the data fails the returned promise is rejected with a `ScanditEngineError` error.
     *
     * Note that you should use [[parseRawData]] whenever possible: some codes, such as those found on driving licenses,
     * might have non-printable characters and will need to use [[Barcode.rawData]] information to be parsed correctly.
     *
     * @param data The string data to be parsed.
     * @returns A promise resolving to the [[ParserResult]] object.
     */
    Parser.prototype.parseString = function (data) {
        return this.scanner.parse(this.dataFormat, data, this.options);
    };
    return Parser;
}());
exports.Parser = Parser;
// istanbul ignore next
(function (Parser) {
    /**
     * Data format of a string to be parsed into a set of key-value mappings by the Scandit Parser Library.
     *
     * See https://docs.scandit.com/parser/formats.html for more details.
     */
    var DataFormat;
    (function (DataFormat) {
        /**
         * GS1 Application Identifier (AI).
         *
         * See: http://www.gs1.org/docs/barcodes/GS1_General_Specifications.pdf.
         */
        DataFormat[DataFormat["GS1_AI"] = 1] = "GS1_AI";
        /**
         * Health Industry Bar Code (HIBC).
         *
         * See: http://www.hibcc.org.
         */
        DataFormat[DataFormat["HIBC"] = 2] = "HIBC";
        /**
         * AAMVA Driver License/Identification (DL/ID).
         *
         * See: http://www.aamva.org.
         */
        DataFormat[DataFormat["DLID"] = 3] = "DLID";
        /**
         * ICAO Machine Readable Travel Document (MRTD).
         *
         * See: https://www.icao.int.
         */
        DataFormat[DataFormat["MRTD"] = 4] = "MRTD";
        /**
         * Swiss QR ISO 20022.
         *
         * See: https://www.paymentstandards.ch.
         */
        DataFormat[DataFormat["SWISSQR"] = 5] = "SWISSQR";
        /**
         * Vehicle Identification Number (VIN).
         *
         * See: https://www.iso.org/standard/52200.html.
         */
        DataFormat[DataFormat["VIN"] = 6] = "VIN";
        /**
         * US Uniformed Services ID.
         *
         * See: https://www.cac.mil.
         */
        DataFormat[DataFormat["US_USID"] = 7] = "US_USID";
    })(DataFormat = Parser.DataFormat || (Parser.DataFormat = {}));
})(Parser = exports.Parser || (exports.Parser = {}));
exports.Parser = Parser;
//# sourceMappingURL=parser.js.map