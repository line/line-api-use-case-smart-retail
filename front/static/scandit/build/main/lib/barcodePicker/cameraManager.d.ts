import { Camera } from "../camera";
import { CameraSettings } from "../cameraSettings";
import { Scanner } from "../scanner";
import { GUI } from "./gui";
export declare enum MeteringMode {
    CONTINUOUS = "continuous",
    MANUAL = "manual",
    NONE = "none",
    SINGLE_SHOT = "single-shot"
}
export declare enum CameraResolutionConstraint {
    ULTRA_HD = 0,
    FULL_HD = 1,
    HD = 2,
    SD = 3,
    NONE = 4
}
export interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
    focusMode?: MeteringMode[];
    torch?: boolean;
    zoom?: {
        max: number;
        min: number;
        step: number;
    };
}
export interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
    torch?: boolean;
    zoom?: number;
}
/**
 * A barcode picker utility class used to handle camera interaction.
 */
export declare class CameraManager {
    private static readonly cameraAccessTimeoutMs;
    private static readonly videoMetadataCheckTimeoutMs;
    private static readonly videoMetadataCheckIntervalMs;
    private static readonly getCapabilitiesTimeoutMs;
    private static readonly autofocusIntervalMs;
    private static readonly manualToAutofocusResumeTimeoutMs;
    private static readonly manualFocusWaitTimeoutMs;
    private static readonly noCameraErrorParameters;
    private static readonly notReadableErrorParameters;
    selectedCamera?: Camera;
    activeCamera?: Camera;
    activeCameraSettings?: CameraSettings;
    private readonly scanner;
    private readonly triggerFatalError;
    private readonly gui;
    private readonly postStreamInitializationListener;
    private readonly videoResizeListener;
    private readonly videoTrackEndedListener;
    private readonly videoTrackMuteListener;
    private readonly triggerManualFocusListener;
    private readonly triggerZoomStartListener;
    private readonly triggerZoomMoveListener;
    private cameraType;
    private selectedCameraSettings?;
    private mediaStream?;
    private mediaTrackCapabilities?;
    private cameraAccessTimeout;
    private videoMetadataCheckInterval;
    private getCapabilitiesTimeout;
    private autofocusInterval;
    private manualToAutofocusResumeTimeout;
    private manualFocusWaitTimeout;
    private cameraSwitcherEnabled;
    private torchToggleEnabled;
    private tapToFocusEnabled;
    private pinchToZoomEnabled;
    private pinchToZoomDistance?;
    private pinchToZoomInitialZoom;
    private torchEnabled;
    private cameraInitializationPromise?;
    private cameraSetupPromise?;
    constructor(scanner: Scanner, triggerFatalError: (error: Error) => void, gui: GUI);
    setInteractionOptions(cameraSwitcherEnabled: boolean, torchToggleEnabled: boolean, tapToFocusEnabled: boolean, pinchToZoomEnabled: boolean): void;
    isCameraSwitcherEnabled(): boolean;
    setCameraSwitcherEnabled(enabled: boolean): Promise<void>;
    isTorchToggleEnabled(): boolean;
    setTorchToggleEnabled(enabled: boolean): void;
    isTapToFocusEnabled(): boolean;
    setTapToFocusEnabled(enabled: boolean): void;
    isPinchToZoomEnabled(): boolean;
    setPinchToZoomEnabled(enabled: boolean): void;
    setInitialCameraType(cameraType: Camera.Type): void;
    setCameraType(cameraType: Camera.Type): Promise<void>;
    setSelectedCamera(camera?: Camera): void;
    setSelectedCameraSettings(cameraSettings?: CameraSettings): void;
    setupCameras(): Promise<void>;
    stopStream(): void;
    applyCameraSettings(cameraSettings?: CameraSettings): Promise<void>;
    reinitializeCamera(): Promise<void>;
    initializeCameraWithSettings(camera: Camera, cameraSettings?: CameraSettings): Promise<void>;
    setTorchEnabled(enabled: boolean): Promise<void>;
    toggleTorch(): Promise<void>;
    setZoom(zoomPercentage: number, currentZoom?: number): Promise<void>;
    private recoverStreamIfNeeded;
    private setupCamerasAndStream;
    private getInitialCameraResolutionConstraint;
    private accessAutoselectedCamera;
    private accessInitialCamera;
    private updateActiveCameraCurrentResolution;
    private postStreamInitialization;
    private videoResizeHandle;
    private videoTrackEndedRecovery;
    private videoTrackMuteRecovery;
    private triggerManualFocusForContinuous;
    private triggerManualFocusForSingleShot;
    private triggerManualFocus;
    private triggerZoomStart;
    private triggerZoomMove;
    private storeStreamCapabilities;
    private setupAutofocus;
    private triggerAutoFocus;
    private triggerFocusMode;
    private enableTapToFocusListeners;
    private enablePinchToZoomListeners;
    private disableTapToFocusListeners;
    private disablePinchToZoomListeners;
    private initializeCameraAndCheckUpdatedSettings;
    private handleCameraInitializationError;
    private initializeCamera;
    private checkCameraAccess;
    private checkVideoMetadata;
    private setupCameraStreamVideo;
}
