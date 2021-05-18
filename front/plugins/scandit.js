/**
 * Scandit SDK プラグイン
 *
 */
import * as ScanditSDK from "scandit-sdk";

const VueScanditSDK = ($axios, app, store, env) => {
    /** @type {string} Scanditライセンスキー */
    const _scanditLicenseKey = env.SCANDIT_LICENSE;
    /** @type {Object} レジ効果音（OK） */
    const _piSound = new Audio(require("~/assets/mp3/pi.mp3").default);
    /** @type {Object} レジ効果音（同一ラベル） */
    const _sameLabelSound = new Audio(require("~/assets/mp3/samelabel.mp3").default);
    /** @type {Object} レジ効果音（エラー） */
    const _errorSound = new Audio(require("~/assets/mp3/error.mp3").default);
    /** @type {Object} ありがとうございました */
    const _thankyouSound = new Audio(require("~/assets/mp3/thankyou.mp3").default);
    /** @type {Object} バーコードピッカー */
    let _barcodePicker = null;

    // Scandit初期設定
    if (process.env.SCANNER_MODULE == "scandit") {
        ScanditSDK.configure(_scanditLicenseKey, { engineLocation: "/scandit/build/" });
    }


    return {
        /** @type {Object} Scandit SDK オブジェクト */
        sdk: ScanditSDK,

        /**
         *　バーコードスキャナー インスタンス作成
         *
         * @param {Object} barcodeElement HTMLエレメント
         * @param {Function} callback コールバック関数
         * @return {Object} バーコードスキャナーインスタンス
         */
        createScan: async (barcodeElement, callback) => {
            // Scandit SDK
            const sdk = app.$scandit.sdk;
            // Search Area
            const searchArea = { x: 0.05, y: 0.4, width: 0.9, height: 0.1 };
            // GUI Style (NONE, LASER, VIEWFINDER)
            const guiStyle = sdk.BarcodePicker.GuiStyle.LASER;
            // Code Duplicate Interval
            const codeDuplicateInterval = 3000;

            // BarcodePicker Instance
            _barcodePicker = await sdk.BarcodePicker.create(
                barcodeElement,
                {
                    playSoundOnScan: false,
                    vibrateOnScan: true,
                    viewfinderArea: searchArea,
                    laserArea: searchArea,
                    videoFit: "cover",
                }
            );
            const mirrored = _barcodePicker.getActiveCamera().cameraType=="front" ? true : false;
            _barcodePicker.setMirrorImageEnabled(mirrored);
            _barcodePicker.setGuiStyle(guiStyle);
            // Scan Settings
            const scanSettings = new sdk.ScanSettings({
                enabledSymbologies: ["ean8", "ean13", "upca", "upce", "code128", "code39", "code93", "itf"],
                codeDuplicateFilter: codeDuplicateInterval,
                searchArea: searchArea
            });
            _barcodePicker.applyScanSettings(scanSettings);
            // Scan Ready Event
            _barcodePicker.on("ready", () => {
            
            });
            // Scan Event
            _barcodePicker.on("scan", (scanResult) => {
                // 読み取りバーコード情報取得
                const barcode = scanResult.barcodes.reduce((string, barcode) => {
                    return string + sdk.Barcode.Symbology.toHumanizedName(barcode.symbology) + ": " + barcode.data;
                });
                if (typeof(callback) == "function") {
                    callback(barcode);
                }
            }, false);
            // Scan Error Event
            _barcodePicker.on("scanError", (error) => {
                console.error(error);
                alert(error.message);
            });

            return app.$scandit;
        },

        pauseScanning() {
            _barcodePicker.pauseScanning();
        },

        resumeScanning() {
            _barcodePicker.resumeScanning();
        },

        destroy() {
            _barcodePicker.destroy();
        },

        playPiSound(muted=false) {
            _piSound.muted = muted;
            _piSound.play();
        },
        playSamelabelSound(muted=false) {
            _sameLabelSound.muted = muted;
            _sameLabelSound.play();
        },
        playErrorSound(muted=false) {
            _errorSound.muted = muted;
            _errorSound.play();
        },
        playThankyouSound(muted=false) {
            _thankyouSound.muted = muted;
            _thankyouSound.play();
        },
        loadSounds() {
            _piSound.load();
            _sameLabelSound.load();
            _errorSound.load();
            _thankyouSound.load();
        },
        playUnlock() {
            this.loadSounds();
            this.playPiSound(true);
            this.playSamelabelSound(true);
            this.playErrorSound(true);
            this.playThankyouSound(true);
        }
    }
}

export default ({ $axios, app, store, env }, inject) => {
    inject("scandit", VueScanditSDK($axios, app, store, env));
}
