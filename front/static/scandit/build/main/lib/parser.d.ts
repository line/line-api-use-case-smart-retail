import { ParserResult } from "./parserResult";
import { Scanner } from "./scanner";
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
export declare class Parser {
    private readonly scanner;
    private readonly dataFormat;
    private options?;
    /**
     * @hidden
     *
     * @param scanner The [[Scanner]] object used to interact with the external Scandit library.
     * @param dataFormat The data format for this parser.
     */
    constructor(scanner: Scanner, dataFormat: Parser.DataFormat);
    /**
     * Apply the option map to the parser, allowing the user to fine-tune the behaviour of the parser.
     * Available options depend on the data format and are specified in the respective documentation.
     *
     * @param options The new options to be applied (replacing previous ones, if any).
     */
    setOptions(options?: object): void;
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
    parseRawData(rawData: Uint8Array): Promise<ParserResult>;
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
    parseString(data: string): Promise<ParserResult>;
}
export declare namespace Parser {
    /**
     * Data format of a string to be parsed into a set of key-value mappings by the Scandit Parser Library.
     *
     * See https://docs.scandit.com/parser/formats.html for more details.
     */
    enum DataFormat {
        /**
         * GS1 Application Identifier (AI).
         *
         * See: http://www.gs1.org/docs/barcodes/GS1_General_Specifications.pdf.
         */
        GS1_AI = 1,
        /**
         * Health Industry Bar Code (HIBC).
         *
         * See: http://www.hibcc.org.
         */
        HIBC = 2,
        /**
         * AAMVA Driver License/Identification (DL/ID).
         *
         * See: http://www.aamva.org.
         */
        DLID = 3,
        /**
         * ICAO Machine Readable Travel Document (MRTD).
         *
         * See: https://www.icao.int.
         */
        MRTD = 4,
        /**
         * Swiss QR ISO 20022.
         *
         * See: https://www.paymentstandards.ch.
         */
        SWISSQR = 5,
        /**
         * Vehicle Identification Number (VIN).
         *
         * See: https://www.iso.org/standard/52200.html.
         */
        VIN = 6,
        /**
         * US Uniformed Services ID.
         *
         * See: https://www.cac.mil.
         */
        US_USID = 7
    }
}
