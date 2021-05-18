/**
 * A particular field of a parsed result of a data string.
 */
export interface ParserField {
    /**
     * The name of the field.
     */
    readonly name: string;
    /**
     * The parsed representation of the data contained in the field.
     * If no parsed representation is available for the field, this property is undefined.
     * Use [[ParserField.rawString]] to retrieve the data for these fields.
     */
    readonly parsed?: any;
    /**
     * The raw substring of the original code containing the field data.
     * For fields that are inferred and do not have a direct correspondence to a particular part of the string,
     * the string is set to an empty string.
     */
    readonly rawString: string;
}
