/**
 * Quagga.js プラグイン
 *
 */
import Quagga from "@ericblade/quagga2";


const VueQuaggaJS = ($axios, app, store, env) => {
    /** @type {Object} レジ効果音（OK） */
    const _piSound = new Audio(require("~/assets/mp3/pi.mp3").default);
    /** @type {Object} レジ効果音（同一ラベル） */
    const _sameLabelSound = new Audio(require("~/assets/mp3/samelabel.mp3").default);
    /** @type {Object} レジ効果音（エラー） */
    const _errorSound = new Audio(require("~/assets/mp3/error.mp3").default);
    /** @type {Object} ありがとうございました */
    const _thankyouSound = new Audio(require("~/assets/mp3/thankyou.mp3").default);
    /** @type {boolean} 読取り中フラグ */
    let _reading = false;


    return {
        // Quaggaフラグ
        quagga: true,

        /**
         *　バーコードスキャナー インスタンス作成
         *
         * @param {Object} barcodeElement HTMLエレメント
         * @param {Function} callback コールバック関数
         * @return {Object} バーコードスキャナーインスタンス
         */
        createScan: async (barcodeElement, callback) => {
            //Quagga Initialize
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: barcodeElement,
                    constraints: {
                        decodeBarCodeRate: 3,
                        successTimeout: 500,
                        codeRepetition: true,
                        tryVertical: true,
                        frameRate: 12,
                        width: 1280,
                        height: 720,
                        aspectRatio: { min: 1, max: 2 },
                        facingMode: "environment",
                    },
                    area: {
                        left: "10%",
                        right: "10%",
                        top: "20%",
                        bottom: "20%"                        
                    },
                    singleChannel: false,
                },
                locator: {
                    halfSample: true,
                    patchSize: "medium",
                },
                numOfWorkers: navigator.hardwareConcurrency,
                locate: true,
                frequency: 1,
                multiple: false,
                decoder: {
                    readers: [
                        //'code_128_reader',
                        'ean_reader',
                        'ean_8_reader',
                        //'code_39_reader',
                        //'code_39_vin_reader',
                        //'codabar_reader',
                        //'upc_reader',
                        //'upc_e_reader',
                        //'i2of5_reader',
                        //'2of5_reader',
                        //'code_93_reader'                        
                    ]
                },
                debug: false,

            }, (error) => {
                if (!error) {
                    Quagga.start();
                }
            });

            // Scan Event
            Quagga.onDetected((result) => {
                if (_reading) return;
                const barcode = result.codeResult.code;
                if (typeof(callback) == "function") {
                    callback({ data: barcode });
                }
            });

            return app.$quagga;
        },

        pauseScanning() {
            _reading = true;
        },

        resumeScanning() {
            _reading = false;
        },

        destroy() {
            Quagga.stop();
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
    inject("quagga", VueQuaggaJS($axios, app, store, env));
}
