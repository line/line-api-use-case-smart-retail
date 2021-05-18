"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedBrowserError = void 0;
var tslib_1 = require("tslib");
var customError_1 = require("./customError");
var UnsupportedBrowserError = /** @class */ (function (_super) {
    tslib_1.__extends(UnsupportedBrowserError, _super);
    // istanbul ignore next
    function UnsupportedBrowserError(browserCompatibility) {
        var _this = _super.call(this, {
            name: "UnsupportedBrowserError",
            message: "This OS / browser has one or more missing features preventing it from working correctly (" + browserCompatibility.missingFeatures.join(", ") + ")",
        }) || this;
        _this.data = browserCompatibility;
        return _this;
    }
    return UnsupportedBrowserError;
}(customError_1.CustomError));
exports.UnsupportedBrowserError = UnsupportedBrowserError;
//# sourceMappingURL=unsupportedBrowserError.js.map