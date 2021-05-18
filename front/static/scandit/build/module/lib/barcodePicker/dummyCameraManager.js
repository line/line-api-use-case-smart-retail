import { CameraManager } from "./cameraManager";
/**
 * A dummy barcode picker utility class used to (not) handle camera interaction.
 */
// istanbul ignore next
export class DummyCameraManager extends CameraManager {
    setInteractionOptions(_1, _2, _3, _4) {
        return;
    }
    isCameraSwitcherEnabled() {
        return false;
    }
    async setCameraSwitcherEnabled(_1) {
        return;
    }
    isTorchToggleEnabled() {
        return false;
    }
    setTorchToggleEnabled(_1) {
        return;
    }
    isTapToFocusEnabled() {
        return false;
    }
    setTapToFocusEnabled(_1) {
        return;
    }
    isPinchToZoomEnabled() {
        return false;
    }
    setPinchToZoomEnabled(_1) {
        return;
    }
    setInitialCameraType(_1) {
        return;
    }
    async setCameraType(_1) {
        return;
    }
    setSelectedCamera(_1) {
        return;
    }
    setSelectedCameraSettings(_1) {
        return;
    }
    async setupCameras() {
        return;
    }
    stopStream() {
        return;
    }
    async applyCameraSettings(_1) {
        return;
    }
    async reinitializeCamera() {
        return;
    }
    async initializeCameraWithSettings(_1, _2) {
        return;
    }
    async setTorchEnabled(_1) {
        return;
    }
    async toggleTorch() {
        return;
    }
    async setZoom(_1, _2) {
        return;
    }
}
//# sourceMappingURL=dummyCameraManager.js.map