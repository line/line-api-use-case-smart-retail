import { BarcodePicker } from "..";
import { AttributeValue, BarcodePickerView } from "./barcodePickerView";
export declare class ScanditBarcodePicker extends HTMLElement implements BarcodePickerView {
    static readonly TAG_NAME: string;
    private readonly shadowDom;
    private readonly controller;
    static get observedAttributes(): string[];
    constructor();
    static registerComponent(): undefined | string;
    /**
     * Expose main objects on view
     */
    get barcodePicker(): BarcodePicker | undefined;
    get root(): HTMLElement;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string): void;
    initializeDom(): void;
    dispatchCustomEvent(e: CustomEvent): void;
    getAttributes(): AttributeValue[];
    waitOnChildrenReady(): Promise<void>;
    private get initialDomContent();
    private get wcStyles();
    private get styles();
}
