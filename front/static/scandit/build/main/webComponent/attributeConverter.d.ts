import { AttributeDescriptor } from "./schema";
export declare type ConvertedAttribute = boolean | string | unknown[] | number | object | undefined;
export declare function convertAttribute(schema: AttributeDescriptor, value: string | null): ConvertedAttribute | undefined;
