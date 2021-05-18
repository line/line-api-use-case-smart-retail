import { Barcode, BarcodeWASMResult } from "../barcode";
import { Camera } from "../camera";
import { ImageSettings } from "../imageSettings";
import { Parser } from "../parser";
declare type ScanWorkUnit = {
    requestId: number;
    data: Uint8Array;
    highQualitySingleFrameMode: boolean;
};
declare type ParseWorkUnit = {
    requestId: number;
    dataFormat: Parser.DataFormat;
    data: string | Uint8Array;
    options: string;
};
/**
 * @hidden
 */
export declare type EngineReceivedMessageData = {
    type: "load-library";
    deviceId: string;
    libraryLocation: string;
    path: string;
    preload: boolean;
    delayedRegistration: boolean;
    licenseKey?: string;
    deviceModelName?: string;
} | {
    type: "scan-settings";
    settings: string;
    blurryRecognitionAvailable: boolean;
    blurryRecognitionRequiresUpdate: boolean;
} | {
    type: "image-settings";
    imageSettings: ImageSettings;
} | {
    type: "scan-image";
    requestId: number;
    data: Uint8Array;
    highQualitySingleFrameMode: boolean;
} | {
    type: "parse";
    requestId: number;
    dataFormat: Parser.DataFormat;
    data: string | Uint8Array;
    options: string;
} | {
    type: "clear-session";
} | {
    type: "create-blurry-table";
    symbology: Barcode.Symbology;
} | {
    type: "camera-properties";
    cameraType: Camera.Type;
    autofocus: boolean;
} | {
    type: "reset";
};
/**
 * @hidden
 */
export declare type EngineSentMessageData = ["library-loaded"] | ["context-created", object] | ["work-result", {
    requestId: number;
    result: {
        scanResult: BarcodeWASMResult[];
    };
}, Uint8Array] | ["work-error", {
    requestId: number;
    error: {
        errorCode: number;
        errorMessage: string;
    };
}, Uint8Array] | ["parse-result", {
    requestId: number;
    result: string;
}] | ["parse-error", {
    requestId: number;
    error: {
        errorCode: number;
        errorMessage: string;
    };
}] | ["create-blurry-table-result", Barcode.Symbology];
/**
 * @hidden
 */
export interface EngineWorker extends Worker {
    onmessage: ((this: Worker, ev: MessageEvent & {
        data: EngineSentMessageData;
    }) => void) | null;
    postMessage(message: EngineReceivedMessageData, transfer: Transferable[]): void;
    postMessage(message: EngineReceivedMessageData, options?: {
        transfer?: any[];
    }): void;
}
/**
 * @hidden
 */
export declare type Engine = {
    loadLibrary(deviceId: string, libraryLocation: string, locationPath: string, preload: boolean, delayedRegistration: boolean, licenseKey?: string, deviceModelName?: string): Promise<void>;
    setScanSettings(newScanSettings: string, blurryRecognitionAvailable: boolean, blurryRecognitionRequiresUpdate: boolean): void;
    setImageSettings(imageSettings: ImageSettings): void;
    workOnScanQueue(): void;
    workOnParseQueue(): void;
    addScanWorkUnit(scanWorkUnit: ScanWorkUnit): void;
    addParseWorkUnit(parseWorkUnit: ParseWorkUnit): void;
    clearSession(): void;
    createBlurryTable(symbology: Barcode.Symbology): void;
    setCameraProperties(cameraType: Camera.Type, autofocus: boolean): void;
    reset(): void;
};
/**
 * @hidden
 *
 * @returns Engine
 */
export declare function engine(): Engine;
/**
 * @hidden
 */
export declare const engineWorkerBlob: Blob;
export {};
