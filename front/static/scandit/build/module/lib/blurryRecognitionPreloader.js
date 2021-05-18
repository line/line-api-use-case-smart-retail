import { EventEmitter } from "eventemitter3";
import { Barcode } from "./barcode";
import { BrowserHelper } from "./browserHelper";
import { EngineLoader } from "./engineLoader";
import { engineWorkerBlob } from "./workers/engineWorker";
class BlurryRecognitionPreloaderEventEmitter extends EventEmitter {
}
export class BlurryRecognitionPreloader {
    constructor(preload) {
        this.eventEmitter = new EventEmitter();
        this.queuedBlurryRecognitionSymbologies = Array.from(BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies.values());
        this.readyBlurryRecognitionSymbologies = new Set();
        this.preload = preload;
    }
    static async create(preload) {
        if (preload) {
            // Edge <= 18 doesn't support IndexedDB in blob Web Workers so data wouldn't be persisted,
            // hence it would be useless to preload blurry recognition as data couldn't be saved.
            // Verify support for IndexedDB in blob Web Workers.
            const browserName = BrowserHelper.userAgentInfo.getBrowser().name;
            if (browserName != null && browserName.includes("Edge")) {
                const worker = new Worker(URL.createObjectURL(new Blob([`(${BlurryRecognitionPreloader.workerIndexedDBSupportTestFunction.toString()})()`], {
                    type: "text/javascript",
                })));
                return new Promise((resolve) => {
                    worker.onmessage = (message) => {
                        worker.terminate();
                        resolve(new BlurryRecognitionPreloader(message.data));
                    };
                });
            }
        }
        return new BlurryRecognitionPreloader(preload);
    }
    // istanbul ignore next
    static workerIndexedDBSupportTestFunction() {
        try {
            indexedDB.deleteDatabase("scandit_indexeddb_support_test");
            // @ts-ignore
            postMessage(true);
        }
        catch (error) {
            // @ts-ignore
            postMessage(false);
        }
    }
    async prepareBlurryTables() {
        let alreadyAvailable = true;
        if (this.preload) {
            try {
                alreadyAvailable = await this.checkBlurryTablesAlreadyAvailable();
            }
            catch (error) {
                // istanbul ignore next
                console.error(error);
            }
        }
        if (alreadyAvailable) {
            this.queuedBlurryRecognitionSymbologies = [];
            this.readyBlurryRecognitionSymbologies = new Set(BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies);
            this.eventEmitter.emit("blurryTablesUpdate", new Set(this.readyBlurryRecognitionSymbologies));
        }
        else {
            this.engineWorker = new Worker(URL.createObjectURL(engineWorkerBlob));
            this.engineWorker.onmessage = this.engineWorkerOnMessage.bind(this);
            EngineLoader.load(this.engineWorker, true, true);
        }
    }
    on(eventName, listener) {
        // istanbul ignore else
        if (eventName === "blurryTablesUpdate") {
            if (this.readyBlurryRecognitionSymbologies.size ===
                BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies.size) {
                listener(this.readyBlurryRecognitionSymbologies);
            }
            else {
                this.eventEmitter.on(eventName, listener);
            }
        }
    }
    updateBlurryRecognitionPriority(scanSettings) {
        const newQueuedBlurryRecognitionSymbologies = this.queuedBlurryRecognitionSymbologies.slice();
        this.getEnabledSymbologies(scanSettings).forEach((symbology) => {
            const symbologyQueuePosition = newQueuedBlurryRecognitionSymbologies.indexOf(symbology);
            if (symbologyQueuePosition !== -1) {
                newQueuedBlurryRecognitionSymbologies.unshift(newQueuedBlurryRecognitionSymbologies.splice(symbologyQueuePosition, 1)[0]);
            }
        });
        this.queuedBlurryRecognitionSymbologies = newQueuedBlurryRecognitionSymbologies;
    }
    isBlurryRecognitionAvailable(scanSettings) {
        const enabledBlurryRecognitionSymbologies = this.getEnabledSymbologies(scanSettings);
        return enabledBlurryRecognitionSymbologies.every((symbology) => {
            return this.readyBlurryRecognitionSymbologies.has(symbology);
        });
    }
    getEnabledSymbologies(scanSettings) {
        return Array.from(BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies.values()).filter((symbology) => {
            return scanSettings.isSymbologyEnabled(symbology);
        });
    }
    createNextBlurryTableSymbology() {
        let symbology;
        do {
            symbology = this.queuedBlurryRecognitionSymbologies.shift();
        } while (symbology != null && this.readyBlurryRecognitionSymbologies.has(symbology));
        // istanbul ignore else
        if (symbology != null) {
            this.engineWorker.postMessage({
                type: "create-blurry-table",
                symbology,
            });
        }
    }
    checkBlurryTablesAlreadyAvailable() {
        return new Promise((resolve) => {
            const openDbRequest = indexedDB.open(BlurryRecognitionPreloader.writableDataPath);
            function handleErrorOrNew() {
                openDbRequest?.result?.close();
                // this.error
                resolve(false);
            }
            openDbRequest.onupgradeneeded = () => {
                try {
                    openDbRequest.result.createObjectStore(BlurryRecognitionPreloader.fsObjectStoreName);
                }
                catch (error) {
                    // Ignored
                }
            };
            openDbRequest.onsuccess = () => {
                try {
                    const transaction = openDbRequest.result.transaction(BlurryRecognitionPreloader.fsObjectStoreName, "readonly");
                    transaction.onerror = handleErrorOrNew;
                    const storeKeysRequest = transaction
                        .objectStore(BlurryRecognitionPreloader.fsObjectStoreName)
                        .getAllKeys();
                    storeKeysRequest.onsuccess = () => {
                        openDbRequest.result.close();
                        if (BlurryRecognitionPreloader.blurryTableFiles.every((file) => {
                            return storeKeysRequest.result.indexOf(file) !== -1;
                        })) {
                            return resolve(true);
                        }
                        else {
                            return resolve(false);
                        }
                    };
                    storeKeysRequest.onerror = handleErrorOrNew;
                }
                catch (error) {
                    handleErrorOrNew.call({ error });
                }
            };
            openDbRequest.onblocked = openDbRequest.onerror = handleErrorOrNew;
        });
    }
    engineWorkerOnMessage(ev) {
        const data = ev.data;
        // istanbul ignore else
        if (data[1] != null) {
            switch (data[0]) {
                case "context-created":
                    this.createNextBlurryTableSymbology();
                    break;
                case "create-blurry-table-result":
                    this.readyBlurryRecognitionSymbologies.add(data[1]);
                    if ([Barcode.Symbology.EAN8, Barcode.Symbology.EAN13, Barcode.Symbology.UPCA, Barcode.Symbology.UPCE].includes(data[1])) {
                        this.readyBlurryRecognitionSymbologies.add(Barcode.Symbology.EAN13);
                        this.readyBlurryRecognitionSymbologies.add(Barcode.Symbology.EAN8);
                        this.readyBlurryRecognitionSymbologies.add(Barcode.Symbology.UPCA);
                        this.readyBlurryRecognitionSymbologies.add(Barcode.Symbology.UPCE);
                    }
                    else if ([Barcode.Symbology.CODE32, Barcode.Symbology.CODE39].includes(data[1])) {
                        this.readyBlurryRecognitionSymbologies.add(Barcode.Symbology.CODE32);
                        this.readyBlurryRecognitionSymbologies.add(Barcode.Symbology.CODE39);
                    }
                    this.eventEmitter.emit("blurryTablesUpdate", new Set(this.readyBlurryRecognitionSymbologies));
                    if (this.readyBlurryRecognitionSymbologies.size ===
                        BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies.size) {
                        // Avoid data not being persisted if IndexedDB operations in WebWorker are slow
                        setTimeout(() => {
                            this.engineWorker.terminate();
                        }, 250);
                    }
                    else {
                        this.createNextBlurryTableSymbology();
                    }
                    break;
                // istanbul ignore next
                default:
                    break;
            }
        }
    }
}
BlurryRecognitionPreloader.writableDataPath = "/scandit_sync_folder_preload";
BlurryRecognitionPreloader.fsObjectStoreName = "FILE_DATA";
// From AndroidLowEnd
BlurryRecognitionPreloader.blurryTableFiles = [
    "/1a3f08f42d1332344e3cebb5c53d9837.scandit",
    "/9590b4b7b91d4a5ed250c07e3e6d817c.scandit",
    "/d5739c566e6804f3870e552f90e3afd6.scandit",
    "/131e51bb75340269aa65fd0e79092b88.scandit",
    "/6e1a9119f3e7960affc7ec57d5444ee7.scandit",
    "/d6fc3b403665c15391a34f142ee5a59a.scandit",
    "/01c4e5de021dbfcf8d2379ce1cf92e73.scandit",
    "/102ada10d9d30c97397b492d7d0f1723.scandit",
    "/fbe00505a2fc101192022da06b10f6e4.scandit",
    "/b7ee4f18825bd3369ad7afbca72f4a58.scandit",
    "/d6401bde0bf283d9e25b41ce39eb37f5.scandit",
    "/f40acf1ec5d358e51e0339ace0e52513.scandit",
    "/76ca9155b19b81b4ea4a209c9c2154a4.scandit",
    "/9da3d4277f729835f5a1b00f8222de44.scandit",
    "/bdbc0442a6bd202f813411397db5e7d7.scandit",
    "/3c977e4745212da13b988db64d793b01.scandit",
    "/b04cd3b79ca8a4972422d95b71c4a33f.scandit",
    "/deaa2ce67c6953bdeef1fb9bcdd91d3f.scandit",
].map((path) => {
    return `${BlurryRecognitionPreloader.writableDataPath}${path}`;
});
// Roughly ordered by priority
BlurryRecognitionPreloader.availableBlurryRecognitionSymbologies = new Set([
    Barcode.Symbology.EAN13,
    Barcode.Symbology.EAN8,
    Barcode.Symbology.CODE32,
    Barcode.Symbology.CODE39,
    Barcode.Symbology.CODE128,
    Barcode.Symbology.CODE93,
    Barcode.Symbology.INTERLEAVED_2_OF_5,
    Barcode.Symbology.MSI_PLESSEY,
    Barcode.Symbology.UPCA,
    Barcode.Symbology.UPCE,
]);
//# sourceMappingURL=blurryRecognitionPreloader.js.map