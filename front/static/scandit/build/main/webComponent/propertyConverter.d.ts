import { AttributeDescriptor } from "./schema";
/**
 * Convert the given value to a string aimed to be used as an attribute value
 *
 * @param schema description of the attribute
 * @param value the value in its primary form
 * @returns the converted value as a string
 */
export declare function convertProperty(schema: AttributeDescriptor, value: any): string;
