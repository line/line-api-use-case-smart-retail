/**
 * A result of a scanning operation on an image.
 */
export class ScanResult {
    /**
     * @hidden
     *
     * Create a ScanResult instance.
     *
     * @param barcodes The list of barcodes found in the image.
     * @param imageData The image data given as a byte array, formatted accordingly to the set settings.
     * @param imageSettings The configuration object defining the properties of the processed image.
     */
    constructor(barcodes, imageData, imageSettings) {
        this.barcodes = barcodes;
        this.imageData = imageData;
        this.imageSettings = imageSettings;
        this.rejectedCodes = new Set();
    }
    /**
     * Prevent playing a sound, vibrating or flashing the GUI for a particular code.
     * If all codes in the result are rejected (or no barcode is present), sound, vibration and GUI flashing will be
     * suppressed.
     *
     * Rejected codes will still be part of the [[ScanResult.barcodes]] property like all other codes.
     *
     * @param barcode The barcode to be rejected.
     */
    rejectCode(barcode) {
        this.rejectedCodes.add(barcode);
    }
}
//# sourceMappingURL=scanResult.js.map