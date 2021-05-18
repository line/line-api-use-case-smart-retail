"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
var tslib_1 = require("tslib");
/**
 * @hidden
 */
var CustomError = /** @class */ (function (_super) {
    tslib_1.__extends(CustomError, _super);
    // istanbul ignore next
    function CustomError(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.name, name = _c === void 0 ? "" : _c, _d = _b.message, message = _d === void 0 ? "" : _d;
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, CustomError.prototype);
        _this.name = name;
        return _this;
    }
    return CustomError;
}(Error));
exports.CustomError = CustomError;
//# sourceMappingURL=customError.js.map