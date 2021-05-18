/**
 * Barcode Scanner プラグイン
 *
 */
 const VueBarcodeScanner = (app, env) => {

    const _scanner = process.env.SCANNER_MODULE=="scandit" ? app.$scandit : app.$quagga;

    return _scanner;
}

export default ({ app, env }, inject) => {
    inject("scanner", VueBarcodeScanner(app, env));
}
