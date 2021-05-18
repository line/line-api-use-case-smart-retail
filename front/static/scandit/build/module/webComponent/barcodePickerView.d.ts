import { BarcodePicker } from "..";
import { Attribute } from "./schema";
export interface BarcodePickerView {
    barcodePicker?: BarcodePicker;
    root: HTMLElement;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    attributeChangedCallback(name: Attribute): void;
    initializeDom(): void;
    dispatchCustomEvent(e: CustomEvent): void;
    getAttribute(qualifiedName: string): string | null;
    removeAttribute(qualifiedName: string): void;
    setAttribute(qualifiedName: string, value: string): void;
    getAttributes(): AttributeValue[];
    querySelector<E extends Element = Element>(selectors: string): E | null;
    waitOnChildrenReady(): Promise<void>;
}
export interface AttributeValue {
    name: string;
    value: string;
}
