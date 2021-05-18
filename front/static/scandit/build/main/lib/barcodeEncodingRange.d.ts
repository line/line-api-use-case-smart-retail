/**
 * A character encoding of a range of bytes.
 */
export interface BarcodeEncodingRange {
    /**
     * The encoding name for the range (http://www.iana.org/assignments/character-sets/character-sets.xhtml).
     */
    readonly encoding: string;
    /**
     * The index of the first element of the encoded data range.
     */
    readonly startIndex: number;
    /**
     * The index after the last element of the encoded data range.
     */
    readonly endIndex: number;
}
