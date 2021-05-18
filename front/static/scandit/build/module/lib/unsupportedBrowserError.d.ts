import { BrowserCompatibility } from "./browserCompatibility";
import { CustomError } from "./customError";
export declare class UnsupportedBrowserError extends CustomError {
    readonly data?: BrowserCompatibility;
    constructor(browserCompatibility: BrowserCompatibility);
}
