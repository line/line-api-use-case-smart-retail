import { ListenerFn } from "eventemitter3";
import { Camera } from "./camera";
import { ImageSettings } from "./imageSettings";
import { Parser } from "./parser";
import { ParserResult } from "./parserResult";
import { ScanResult } from "./scanResult";
import { ScanSettings } from "./scanSettings";
/**
 * @hidden
 */
declare type EventName = "ready" | "contextCreated" | "newScanSettings";
/**
 * A low-level scanner interacting with the external Scandit Engine library.
 * Used to set up scan / image settings and to process single image frames.
 *
 * The loading of the external Scandit Engine library can take some time, the [[on]] method targeting the [[ready]]
 * event can be used to set up a listener function to be called when the library is loaded and the [[isReady]] method
 * can return the current status. The scanner will be ready to start scanning when the library is fully loaded.
 *
 * By default the external Scandit Engine library is preloaded in order to reduce the initialization time as much as
 * possible.
 *
 * In the special case where a single [[Scanner]] instance is shared between multiple active [[BarcodePicker]]
 * instances, the fairness in resource allocation for processing images between the different pickers is not guaranteed.
 */
export declare class Scanner {
    private static workerScanRequestId;
    private readonly engineWorker;
    private readonly eventEmitter;
    private scanSettings;
    private imageSettings?;
    private workerParseRequestId;
    private workerScanQueueLength;
    private isReadyToWork;
    private licenseKeyFeatures?;
    private imageDataConversionContext?;
    private activeBlurryRecognitionSymbologies;
    private blurryRecognitionAvailable;
    /**
     * Create a Scanner instance.
     *
     * It is required to having configured the library via [[configure]] before this object can be created.
     *
     * Before processing an image the relative settings must also have been set.
     *
     * Depending on library configuration, browser features and user permissions for camera access, any of the following
     * errors could be thrown:
     * - `LibraryNotConfiguredError`
     * - `UnsupportedBrowserError`
     *
     * @param scanSettings <div class="tsd-signature-symbol">Default =&nbsp;new ScanSettings()</div>
     * The configuration object for scanning options.
     * @param imageSettings <div class="tsd-signature-symbol">Default =&nbsp;undefined</div>
     * The configuration object to define the properties of an image to be scanned.
     */
    constructor({ scanSettings, imageSettings, }?: {
        scanSettings?: ScanSettings;
        imageSettings?: ImageSettings;
    });
    /**
     * Fired when the external Scandit Engine library has been loaded and the scanner can thus start to scan barcodes.
     *
     * @event
     */
    static ready(): void;
    /**
     * Stop/reset the internal WebWorker and destroy the scanner itself; ensuring complete cleanup.
     *
     * This method should be called after you don't plan to use the scanner anymore,
     * before the object is automatically cleaned up by JavaScript.
     * The scanner must not be used in any way after this call.
     */
    destroy(): void;
    /**
     * Apply a new set of scan settings to the scanner (replacing old settings).
     *
     * @param scanSettings The scan configuration object to be applied to the scanner.
     * @returns The updated [[Scanner]] object.
     */
    applyScanSettings(scanSettings: ScanSettings): Scanner;
    /**
     * Apply a new set of image settings to the scanner (replacing old settings).
     *
     * @param imageSettings The image configuration object to be applied to the scanner.
     * @returns The updated [[Scanner]] object.
     */
    applyImageSettings(imageSettings: ImageSettings): Scanner;
    /**
     * Clear the scanner session.
     *
     * This removes all recognized barcodes from the scanner session and allows them to be scanned again in case a custom
     * *codeDuplicateFilter* was set in the [[ScanSettings]].
     *
     * @returns The updated [[Scanner]] object.
     */
    clearSession(): Scanner;
    /**
     * Process a given image using the previously set scanner and image settings,
     * recognizing codes and retrieving the result as a list of barcodes (if any).
     *
     * Multiple requests done without waiting for previous results will be queued and handled in order.
     *
     * If *highQualitySingleFrameMode* is enabled the image will be processed with really accurate internal settings,
     * resulting in much slower but more precise scanning results. This should be used only for single images not part
     * of a continuous video stream.
     *
     * Passing image data as a *Uint8Array* is the fastest option, passing a *HTMLImageElement*
     * will incur in additional operations.
     *
     * Data passed to this function is "detached"/"neutered" becoming unusable as it's being passed to the external
     * Scandit Engine library. You can access the same data once it's returned in the [[ScanResult.imageData]] property.
     *
     * Depending on the current image settings, given *imageData* and scanning execution, any of the following errors
     * could be the rejected result of the returned promise:
     * - `NoImageSettings`
     * - `ImageSettingsDataMismatch`
     * - `ScanditEngineError`
     *
     * @param imageData The image data given as byte array or image element, complying with the previously set
     * image settings.
     * @param highQualitySingleFrameMode Whether to process the image as a high quality single frame.
     * @returns A promise resolving to the [[ScanResult]] object.
     */
    processImage(imageData: Uint8Array | HTMLImageElement, highQualitySingleFrameMode?: boolean): Promise<ScanResult>;
    /**
     * @returns Whether the scanner is currently busy processing an image.
     */
    isBusyProcessing(): boolean;
    /**
     * @returns Whether the scanner has loaded the external Scandit Engine library and is ready to scan.
     */
    isReady(): boolean;
    /**
     * Add the listener function to the listeners array for an event.
     *
     * No checks are made to see if the listener has already been added.
     * Multiple calls passing the same listener will result in the listener being added, and called, multiple times.
     *
     * @param eventName The name of the event to listen to.
     * @param listener The listener function.
     * @returns The updated [[Scanner]] object.
     */
    on(eventName: EventName, listener: ListenerFn): Scanner;
    /**
     * Add the listener function to the listeners array for the [[ready]] event, fired only once when the external
     * Scandit Engine library has been loaded and the scanner can thus start to scan barcodes.
     * If the external Scandit Engine library has already been loaded the listener is called immediately.
     *
     * No checks are made to see if the listener has already been added.
     * Multiple calls passing the same listener will result in the listener being added, and called, multiple times.
     *
     * @param eventName The name of the event to listen to.
     * @param listener The listener function.
     * @returns The updated [[Scanner]] object.
     */
    on(eventName: "ready", listener: () => void): Scanner;
    /**
     * *See the [[on]] method.*
     *
     * @param eventName The name of the event to listen to.
     * @param listener The listener function.
     * @returns The updated [[Scanner]] object.
     */
    addListener(eventName: EventName, listener: ListenerFn): Scanner;
    /**
     * Create a new parser object.
     *
     * @param dataFormat The format of the input data for the parser.
     * @returns The newly created parser.
     */
    createParserForFormat(dataFormat: Parser.DataFormat): Parser;
    /**
     * Return the current image settings.
     *
     * Note that modifying this object won't directly apply these settings: the [[applyImageSettings]] method must be
     * called with the updated object.
     *
     * @returns The current image settings.
     */
    getImageSettings(): ImageSettings | undefined;
    /**
     * Return the current scan settings.
     *
     * Note that modifying this object won't directly apply these settings: the [[applyScanSettings]] method must be
     * called with the updated object.
     *
     * @returns The current scan settings.
     */
    getScanSettings(): ScanSettings;
    /**
     * @hidden
     *
     * Process a given string or byte array using the Scandit Parser library,
     * parsing the data in the given format and retrieving the result as a [[ParserResult]] object.
     *
     * Multiple requests done without waiting for previous results will be queued and handled in order.
     *
     * If parsing of the data fails the returned promise is rejected with a `ScanditEngineError` error.
     *
     * @param dataFormat The format of the given data.
     * @param data The string or byte array containing the data to be parsed.
     * @param options Options for the specific data format parser.
     * @returns A promise resolving to the [[ParserResult]] object.
     */
    parse(dataFormat: Parser.DataFormat, data: string | Uint8Array, options?: object): Promise<ParserResult>;
    /**
     * @hidden
     *
     * Report new camera properties.
     *
     * This ensures optimal settings usage and detailed analytics information.
     *
     * @param cameraType The camera type (facing mode/direction).
     * @param autofocus Whether the camera supports autofocus, by default it's assumed it does.
     * @returns The updated [[Scanner]] object.
     */
    reportCameraProperties(cameraType: Camera.Type, autofocus?: boolean): Scanner;
    /**
     * Remove the specified listener from the given event's listener array.
     *
     * @param eventName The name of the event from which to remove the listener.
     * @param listener The listener function to be removed.
     * @returns The updated [[Scanner]] object.
     */
    removeListener(eventName: string, listener: ListenerFn): Scanner;
    /**
     * Remove all listeners from the given event's listener array.
     *
     * @param eventName The name of the event from which to remove all listeners.
     * @returns The updated [[Scanner]] object.
     */
    removeAllListeners(eventName: EventName): Scanner;
    private handleBlurryTablesUpdate;
    private engineWorkerOnMessage;
}
export {};
