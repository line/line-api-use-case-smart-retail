export var Barcode;
(function (Barcode) {
    /**
     * @hidden
     *
     * Create a [[Barcode]] object from a partial object returned by the external Scandit Engine library.
     * The *rawData* and *data* fields are computed and stored.
     *
     * @param result The barcode result coming from the external Scandit Engine library.
     * @returns The generated [[Barcode]] object.
     */
    function createFromWASMResult(result) {
        let decodedData;
        try {
            decodedData = decodeURIComponent(escape(String.fromCharCode.apply(null, result.rawData)));
        }
        catch {
            decodedData = "";
        }
        return {
            symbology: result.symbology,
            data: decodedData,
            rawData: new Uint8Array(result.rawData),
            location: {
                topLeft: { x: result.location[0][0], y: result.location[0][1] },
                topRight: { x: result.location[1][0], y: result.location[1][1] },
                bottomRight: { x: result.location[2][0], y: result.location[2][1] },
                bottomLeft: { x: result.location[3][0], y: result.location[3][1] },
            },
            compositeFlag: result.compositeFlag,
            isGs1DataCarrier: result.isGs1DataCarrier,
            encodingArray: result.encodingArray,
        };
    }
    Barcode.createFromWASMResult = createFromWASMResult;
    /**
     * Barcode symbology type.
     */
    let Symbology;
    (function (Symbology) {
        Symbology["AZTEC"] = "aztec";
        Symbology["CODABAR"] = "codabar";
        Symbology["CODE11"] = "code11";
        Symbology["CODE128"] = "code128";
        Symbology["CODE25"] = "code25";
        Symbology["CODE32"] = "code32";
        Symbology["CODE39"] = "code39";
        Symbology["CODE93"] = "code93";
        Symbology["DATA_MATRIX"] = "data-matrix";
        Symbology["DOTCODE"] = "dotcode";
        Symbology["EAN13"] = "ean13";
        Symbology["EAN8"] = "ean8";
        Symbology["FIVE_DIGIT_ADD_ON"] = "five-digit-add-on";
        Symbology["GS1_DATABAR"] = "databar";
        Symbology["GS1_DATABAR_EXPANDED"] = "databar-expanded";
        Symbology["GS1_DATABAR_LIMITED"] = "databar-limited";
        Symbology["IATA_2_OF_5"] = "iata2of5";
        Symbology["INTERLEAVED_2_OF_5"] = "itf";
        Symbology["KIX"] = "kix";
        Symbology["LAPA4SC"] = "lapa4sc";
        Symbology["MAXICODE"] = "maxicode";
        Symbology["MICRO_PDF417"] = "micropdf417";
        Symbology["MICRO_QR"] = "microqr";
        Symbology["MSI_PLESSEY"] = "msi-plessey";
        Symbology["PDF417"] = "pdf417";
        Symbology["QR"] = "qr";
        Symbology["RM4SCC"] = "rm4scc";
        Symbology["TWO_DIGIT_ADD_ON"] = "two-digit-add-on";
        Symbology["UPCA"] = "upca";
        Symbology["UPCE"] = "upce";
    })(Symbology = Barcode.Symbology || (Barcode.Symbology = {}));
    /**
     * Flags to hint that two codes form a composite code.
     */
    let CompositeFlag;
    (function (CompositeFlag) {
        /**
         * Code is not part of a composite code.
         */
        CompositeFlag[CompositeFlag["NONE"] = 0] = "NONE";
        /**
         * Code could be part of a composite code. This flag is set by linear (1D) symbologies that have
         * no composite flag support but can be part of a composite code like the EAN/UPC symbology family.
         */
        CompositeFlag[CompositeFlag["UNKNOWN"] = 1] = "UNKNOWN";
        /**
         * Code is the linear component of a composite code. This flag can be set by GS1 DataBar or GS1-128 (Code 128).
         */
        CompositeFlag[CompositeFlag["LINKED"] = 2] = "LINKED";
        /**
         * Code is a GS1 Composite Code Type A (CC - A).This flag can be set by MicroPDF417 codes.
         */
        CompositeFlag[CompositeFlag["GS1_A"] = 4] = "GS1_A";
        /**
         * Code is a GS1 Composite Code Type B (CC-B). This flag can be set by MicroPDF417 codes.
         */
        CompositeFlag[CompositeFlag["GS1_B"] = 8] = "GS1_B";
        /**
         * Code is a GS1 Composite Code Type C (CC-C). This flag can be set by PDF417 codes.
         */
        CompositeFlag[CompositeFlag["GS1_C"] = 16] = "GS1_C";
    })(CompositeFlag = Barcode.CompositeFlag || (Barcode.CompositeFlag = {}));
    // istanbul ignore next
    (function (Symbology) {
        /**
         * @hidden
         */
        // tslint:disable:no-unnecessary-qualifier
        const humanizedSymbologyNames = new Map([
            [Symbology.AZTEC, "Aztec"],
            [Symbology.CODABAR, "Codabar"],
            [Symbology.CODE11, "Code 11"],
            [Symbology.CODE128, "Code 128"],
            [Symbology.CODE25, "Code 25"],
            [Symbology.CODE32, "Code 32"],
            [Symbology.CODE39, "Code 39"],
            [Symbology.CODE93, "Code 93"],
            [Symbology.DATA_MATRIX, "Data Matrix"],
            [Symbology.DOTCODE, "DotCode"],
            [Symbology.EAN13, "EAN-13"],
            [Symbology.EAN8, "EAN-8"],
            [Symbology.FIVE_DIGIT_ADD_ON, "Five-Digit Add-On"],
            [Symbology.GS1_DATABAR_EXPANDED, "GS1 DataBar Expanded"],
            [Symbology.GS1_DATABAR_LIMITED, "GS1 DataBar Limited"],
            [Symbology.GS1_DATABAR, "GS1 DataBar 14"],
            [Symbology.IATA_2_OF_5, "IATA 2 of 5"],
            [Symbology.INTERLEAVED_2_OF_5, "Interleaved 2 of 5"],
            [Symbology.KIX, "KIX"],
            [Symbology.LAPA4SC, "LAPA4SC"],
            [Symbology.MAXICODE, "MaxiCode"],
            [Symbology.MICRO_PDF417, "MicroPDF417"],
            [Symbology.MICRO_QR, "Micro QR"],
            [Symbology.MSI_PLESSEY, "MSI-Plessey"],
            [Symbology.PDF417, "PDF417"],
            [Symbology.QR, "QR"],
            [Symbology.RM4SCC, "RM4SCC"],
            [Symbology.TWO_DIGIT_ADD_ON, "Two-Digit Add-On"],
            [Symbology.UPCA, "UPC-A"],
            [Symbology.UPCE, "UPC-E"],
        ]);
        /**
         * @hidden
         */
        const jsonSymbologyNames = new Map([
            [Symbology.AZTEC, "aztec"],
            [Symbology.CODABAR, "codabar"],
            [Symbology.CODE11, "code11"],
            [Symbology.CODE128, "code128"],
            [Symbology.CODE25, "code25"],
            [Symbology.CODE32, "code32"],
            [Symbology.CODE39, "code39"],
            [Symbology.CODE93, "code93"],
            [Symbology.DATA_MATRIX, "data-matrix"],
            [Symbology.DOTCODE, "dotcode"],
            [Symbology.EAN13, "ean13"],
            [Symbology.EAN8, "ean8"],
            [Symbology.FIVE_DIGIT_ADD_ON, "five-digit-add-on"],
            [Symbology.GS1_DATABAR_EXPANDED, "databar-expanded"],
            [Symbology.GS1_DATABAR_LIMITED, "databar-limited"],
            [Symbology.GS1_DATABAR, "databar"],
            [Symbology.IATA_2_OF_5, "iata2of5"],
            [Symbology.INTERLEAVED_2_OF_5, "itf"],
            [Symbology.KIX, "kix"],
            [Symbology.LAPA4SC, "lapa4sc"],
            [Symbology.MAXICODE, "maxicode"],
            [Symbology.MICRO_PDF417, "micropdf417"],
            [Symbology.MICRO_QR, "microqr"],
            [Symbology.MSI_PLESSEY, "msi-plessey"],
            [Symbology.PDF417, "pdf417"],
            [Symbology.QR, "qr"],
            [Symbology.RM4SCC, "rm4scc"],
            [Symbology.TWO_DIGIT_ADD_ON, "two-digit-add-on"],
            [Symbology.UPCA, "upca"],
            [Symbology.UPCE, "upce"],
        ]);
        // tslint:enable:no-unnecessary-qualifier
        /**
         * Get the humanized name of a symbology.
         *
         * @param symbology The symbology for which to retrieve the name.
         * @returns The humanized name of the symbology.
         */
        function toHumanizedName(symbology) {
            return humanizedSymbologyNames.get(symbology.toLowerCase()) ?? "Unknown";
        }
        Symbology.toHumanizedName = toHumanizedName;
        /**
         * Get the JSON key name of a symbology, used for JSON-formatted ScanSettings and Scandit Engine library.
         *
         * @param symbology The symbology for which to retrieve the name.
         * @returns The json key name of the symbology.
         */
        function toJSONName(symbology) {
            return jsonSymbologyNames.get(symbology.toLowerCase()) ?? "unknown";
        }
        Symbology.toJSONName = toJSONName;
    })(Symbology = Barcode.Symbology || (Barcode.Symbology = {}));
})(Barcode || (Barcode = {}));
//# sourceMappingURL=barcode.js.map