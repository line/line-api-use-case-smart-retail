"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanditBarcodePicker = void 0;
var tslib_1 = require("tslib");
var styles_scss_1 = tslib_1.__importDefault(require("../styles/styles.scss"));
var controller_1 = require("./controller");
var schema_1 = require("./schema");
var ScanditBarcodePicker = /** @class */ (function (_super) {
    tslib_1.__extends(ScanditBarcodePicker, _super);
    function ScanditBarcodePicker() {
        var _this = _super.call(this) || this;
        _this.controller = new controller_1.Controller(_this);
        _this.shadowDom = _this.attachShadow({ mode: "open" });
        return _this;
    }
    Object.defineProperty(ScanditBarcodePicker, "observedAttributes", {
        get: function () {
            return schema_1.attributes.map(function (s) {
                return s.toLowerCase();
            });
        },
        enumerable: false,
        configurable: true
    });
    ScanditBarcodePicker.registerComponent = function () {
        if (!("customElements" in window)) {
            return;
        }
        if (!customElements.get(ScanditBarcodePicker.TAG_NAME)) {
            customElements.define(ScanditBarcodePicker.TAG_NAME, ScanditBarcodePicker);
        }
        return ScanditBarcodePicker.TAG_NAME;
    };
    Object.defineProperty(ScanditBarcodePicker.prototype, "barcodePicker", {
        /**
         * Expose main objects on view
         */
        get: function () {
            return this.controller.picker;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScanditBarcodePicker.prototype, "root", {
        get: function () {
            return this.shadowDom.querySelector("#root");
        },
        enumerable: false,
        configurable: true
    });
    ScanditBarcodePicker.prototype.connectedCallback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.controller.viewConnectedCallback()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ScanditBarcodePicker.prototype.disconnectedCallback = function () {
        this.controller.viewDisconnectedCallback();
    };
    ScanditBarcodePicker.prototype.attributeChangedCallback = function (name) {
        this.controller.attributeChangedCallback(name);
    };
    ScanditBarcodePicker.prototype.initializeDom = function () {
        // tslint:disable-next-line:no-inner-html
        this.shadowDom.innerHTML = this.initialDomContent;
    };
    ScanditBarcodePicker.prototype.dispatchCustomEvent = function (e) {
        this.dispatchEvent(e);
    };
    ScanditBarcodePicker.prototype.getAttributes = function () {
        return Array.from(this.attributes).map(function (att) {
            return { name: att.name, value: att.value };
        });
    };
    ScanditBarcodePicker.prototype.waitOnChildrenReady = function () {
        return new Promise(function (resolve) {
            setTimeout(resolve, 50);
        });
    };
    Object.defineProperty(ScanditBarcodePicker.prototype, "initialDomContent", {
        get: function () {
            return "\n      <style>" + this.styles + "</style>\n      <div id=\"root\"></div>\n    ";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScanditBarcodePicker.prototype, "wcStyles", {
        get: function () {
            return "\n      :host {\n        display: block;\n      }\n\n      :host([hidden]) {\n        display: none;\n      }\n\n      #root {\n        height: inherit;\n        max-height: inherit;\n      }\n    ";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScanditBarcodePicker.prototype, "styles", {
        get: function () {
            return "\n      " + this.wcStyles + "\n      " + styles_scss_1.default + "\n    ";
        },
        enumerable: false,
        configurable: true
    });
    ScanditBarcodePicker.TAG_NAME = "scandit-barcode-picker";
    return ScanditBarcodePicker;
}(HTMLElement));
exports.ScanditBarcodePicker = ScanditBarcodePicker;
//# sourceMappingURL=index.js.map