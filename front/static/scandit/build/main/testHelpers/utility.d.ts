import { Camera } from "..";
export declare function wait(ms: number): Promise<void>;
export declare function fakeGetCameras(cameraAmount: number, cameraTypes?: Camera.Type[], cameraLabels?: string[]): void;
export declare function fakeFullCompatibleBrowser(configureLibrary?: boolean, cameraDevices?: MediaDeviceInfo[]): Promise<void>;
