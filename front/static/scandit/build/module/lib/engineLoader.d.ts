import { EngineWorker } from "./workers/engineWorker";
export declare class EngineLoader {
    private preloadedEngineWorker?;
    private preloadedEngineWorkerAvailable;
    constructor(preload: boolean);
    static load(engineWorker: EngineWorker, preload?: boolean, delayedRegistration?: boolean): void;
    getEngineWorker(): EngineWorker;
    returnEngineWorker(engineWorker: EngineWorker): void;
}
