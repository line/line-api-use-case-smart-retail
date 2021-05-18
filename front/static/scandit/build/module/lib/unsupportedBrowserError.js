import { CustomError } from "./customError";
export class UnsupportedBrowserError extends CustomError {
    // istanbul ignore next
    constructor(browserCompatibility) {
        super({
            name: "UnsupportedBrowserError",
            message: `This OS / browser has one or more missing features preventing it from working correctly (${browserCompatibility.missingFeatures.join(", ")})`,
        });
        this.data = browserCompatibility;
    }
}
//# sourceMappingURL=unsupportedBrowserError.js.map