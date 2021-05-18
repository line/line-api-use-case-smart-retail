import { default as pickerStyles } from "../styles/styles.scss";
import { Controller } from "./controller";
import { attributes } from "./schema";
export class ScanditBarcodePicker extends HTMLElement {
    constructor() {
        super();
        this.controller = new Controller(this);
        this.shadowDom = this.attachShadow({ mode: "open" });
    }
    static get observedAttributes() {
        return attributes.map((s) => {
            return s.toLowerCase();
        });
    }
    static registerComponent() {
        if (!("customElements" in window)) {
            return;
        }
        if (!customElements.get(ScanditBarcodePicker.TAG_NAME)) {
            customElements.define(ScanditBarcodePicker.TAG_NAME, ScanditBarcodePicker);
        }
        return ScanditBarcodePicker.TAG_NAME;
    }
    /**
     * Expose main objects on view
     */
    get barcodePicker() {
        return this.controller.picker;
    }
    get root() {
        return this.shadowDom.querySelector("#root");
    }
    async connectedCallback() {
        await this.controller.viewConnectedCallback();
    }
    disconnectedCallback() {
        this.controller.viewDisconnectedCallback();
    }
    attributeChangedCallback(name) {
        this.controller.attributeChangedCallback(name);
    }
    initializeDom() {
        // tslint:disable-next-line:no-inner-html
        this.shadowDom.innerHTML = this.initialDomContent;
    }
    dispatchCustomEvent(e) {
        this.dispatchEvent(e);
    }
    getAttributes() {
        return Array.from(this.attributes).map((att) => {
            return { name: att.name, value: att.value };
        });
    }
    waitOnChildrenReady() {
        return new Promise((resolve) => {
            setTimeout(resolve, 50);
        });
    }
    get initialDomContent() {
        return `
      <style>${this.styles}</style>
      <div id="root"></div>
    `;
    }
    get wcStyles() {
        return `
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none;
      }

      #root {
        height: inherit;
        max-height: inherit;
      }
    `;
    }
    get styles() {
        return `
      ${this.wcStyles}
      ${pickerStyles}
    `;
    }
}
ScanditBarcodePicker.TAG_NAME = "scandit-barcode-picker";
//# sourceMappingURL=index.js.map