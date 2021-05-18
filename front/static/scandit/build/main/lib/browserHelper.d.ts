import UAParser from "ua-parser-js";
export { UAParser };
import { BrowserCompatibility } from "./browserCompatibility";
export declare namespace BrowserHelper {
    /**
     * @hidden
     */
    interface Browser {
        name?: string;
        version?: string;
    }
    /**
     * @hidden
     */
    interface CPU {
        architecture?: string;
    }
    /**
     * @hidden
     */
    interface Device {
        model?: string;
        vendor?: string;
        type?: string;
    }
    /**
     * @hidden
     */
    interface Engine {
        name?: string;
        version?: string;
    }
    /**
     * @hidden
     */
    interface OS {
        name?: string;
        version?: string;
    }
    /**
     * @hidden
     */
    export const userAgentInfo: {
        getBrowser(): Browser;
        getOS(): OS;
        getEngine(): Engine;
        getDevice(): Device;
        getCPU(): CPU;
        getUA(): string;
        setUA(uastring: string): void;
    };
    /**
     * @hidden
     */
    export const canvas: HTMLCanvasElement;
    /**
     * @hidden
     *
     * @returns Whether the device is a desktop/laptop for sure.
     */
    export function isDesktopDevice(): boolean;
    /**
     * @returns The built [[BrowserCompatibility]] object representing the current OS/Browser's support for features.
     */
    export function checkBrowserCompatibility(): BrowserCompatibility;
    /**
     * @hidden
     *
     * Get a device id for the current browser.
     *
     * When available it's retrieved from localStorage, as fallback from cookies (used by older library versions),
     * when not available it's randomly generated and stored in localStorage to be retrieved by later calls and returned.
     *
     * @returns The device id for the current browser.
     */
    export function getDeviceId(): string;
    /**
     * @hidden
     *
     * Check if a given object is a valid HTMLElement
     *
     * @param object The object to check.
     * @returns Whether the given object is a valid HTMLElement.
     */
    export function isValidHTMLElement(object: any): boolean;
    export {};
}
