import { ListenerFn } from "eventemitter3";
import { Barcode } from "./barcode";
import { ScanSettings } from "./scanSettings";
declare type EventName = "blurryTablesUpdate";
export declare class BlurryRecognitionPreloader {
    private static readonly writableDataPath;
    private static readonly fsObjectStoreName;
    private static readonly blurryTableFiles;
    private static readonly availableBlurryRecognitionSymbologies;
    private readonly eventEmitter;
    private readonly preload;
    private queuedBlurryRecognitionSymbologies;
    private readyBlurryRecognitionSymbologies;
    private engineWorker;
    private constructor();
    static create(preload: boolean): Promise<BlurryRecognitionPreloader>;
    private static workerIndexedDBSupportTestFunction;
    prepareBlurryTables(): Promise<void>;
    on(eventName: EventName, listener: ListenerFn): void;
    updateBlurryRecognitionPriority(scanSettings: ScanSettings): void;
    isBlurryRecognitionAvailable(scanSettings: ScanSettings): boolean;
    getEnabledSymbologies(scanSettings: ScanSettings): Barcode.Symbology[];
    private createNextBlurryTableSymbology;
    private checkBlurryTablesAlreadyAvailable;
    private engineWorkerOnMessage;
}
export {};
