import { ParserField } from "./parserField";
/**
 * A result of a successfully parsed data string.
 */
export interface ParserResult {
    /**
     * The result object as a serialized JSON string.
     */
    readonly jsonString: string;
    /**
     * The fields contained in the result as an array of [[ParserField]] objects.
     * The order of the fields in array depends on the order of the fields in the input data.
     */
    readonly fields: ParserField[];
    /**
     * The fields contained in the result as a map of [[ParserField]] objects.
     * The entries in the map are field names pointing to the parser field.
     */
    readonly fieldsByName: {
        [fieldName: string]: ParserField;
    };
}
