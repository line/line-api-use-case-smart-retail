/**
 * スマホレジ アプリケーションプラグイン
 *
 * @param {Object} $axios
 * @param {Object} app
 * @param {Object} store
 * @param {Object} env
 * @return {VueSmaphregi} 
 */
const VueSmaphregi = ($axios, app, store, redirect, env) => {
    /** @type {string} 通信モジュール */
    const _module = env.AJAX_MODULE ? env.AJAX_MODULE : "axios";
    /** @type {string} APIGatewayステージ名 */
    const _stage = `/${env.APIGATEWAY_STAGE}`;
    /** @type {Object} ロケール */
    let _i18n = app.i18n.messages[store.state.locale];


    return {
        /**
         * 商品情報検索処理
         *
         * @param {number} barcode バーコード
         * @return {Array<Object>} 商品情報
         */
        async getProductInformation(barcode) {
            let ret = [];

            // Lambdaアクセス
            let data = await this[_module].barcodeInformation(barcode);
            if (!data) { return ret };

            // スキャンデータ取得
            ret = (()=>{
                return {
                    barcode: barcode,
                    image: data.ImageUrl,
                    name: data.Name,
                    price: data.Price,
                    method: data.discountWay ? data.discountWay : 0,
                    rate: data.discountRate ? data.discountRate : 0,
                }
            })();

            return ret;
        },

        /**
         * 購入商品保存処理
         *
         * @param {string} barcode IDトークン
         * @param {Array<Object>} items 購入商品情報一覧
         * @param {Array} coupons 適用クーポン一覧
         * @param {string} orderId オーダーID
         * @return {Object} 保存情報
         */
         async putInCart(idToken, items, coupons, orderId) {
            let ret = false;

            // 購入商品パラメーター作成
            let productList = this.utils.makeProductListParam(items);
            productList = this.utils.addCouponListParam(productList, coupons);
            // 全商品対象クーポンID取得
            let couponId = this.utils.getCouponForAllProducts(coupons);

            // Lambdaアクセス
            let data = await this[_module].productList(idToken, productList, couponId, orderId);
            if (!data) { return ret; }

            // HTTP 200 Return
            ret = data;

            return ret;
        },

        /**
         * 商品決済処理
         *
         * @param {string} barcode IDトークン
         * @param {string} orderId オーダーID
         * @return {string} LINE Pay URL
         */
         async makePayment(idToken, orderId) {
            let ret = false;

            // Lambdaアクセス
            let data = await this[_module].payment(idToken, orderId);
            if (!data) { return ret; }

            // LINE Pay 決済画面URL取得
            try {
                if (data.info.paymentUrl.web) {
                    ret = data.info.paymentUrl.web;
                }
            } catch (ex) {}

            return ret;
        },

        /**
         * 商品決済確定処理
         *
         * @param {string} transactionId トランザクションID
         * @param {string} orderId オーダーID
         * @return {Object} 決済確定情報
         */
         async confirmPayment(transactionId, orderId) {
            let ret = false;

            // Lambdaアクセス
            let data = await this[_module].paymentConfirmed(transactionId, orderId);
            if (!data) { return ret; }

            // HTTP 200 Return
            ret = data;

            return ret;
        },

        /**
         * 商品購入履歴取得処理
         *
         * @param {string} idToken IDトークン
         * @param {string} orderId オーダーID
         * @return {Array<Object>} 購入商品一覧情報
         */
         async getPurchasedItems(idToken, orderId) {
            let ret = [];

            // Lambdaアクセス
            let data = await this[_module].purchaseHistory(idToken, orderId);
            if (!data) { return ret };

            // 購入商品データ取得
            for (const record of data) {
                // 購入済データ格納レコード作成
                const ordered = (()=>{
                    return {
                        date: null,
                        orderId: null,
                        items: [],
                        amount: 0,
                        coupon: {
                            id: null,
                            method: 0,
                            rate: 0,
                        }
                    }
                })();
                // 購入情報格納
                ordered.date = record.paidDateTime;
                ordered.orderId = record.orderId;
                ordered.amount = record.amount;      // ※値引き後金額
                ordered.coupon.method = record.discountWay ? record.discountWay : 0;
                ordered.coupon.rate = record.discountRate ? record.discountRate : 0;
                ordered.coupon.id = (ordered.coupon.method>0) ? "applied" : null;
                // 購入商品情報格納
                for (const item of record.item) {
                    ordered.items.push((()=>{
                        return {
                            barcode: item.barcode,
                            image: item.itemUrl,
                            name: item.itemName,
                            count: item.quantity,
                            price: item.itemPrice,  // ※値引き前金額
                            total: item.itemPrice * item.quantity,
                            method: item.discountWay ? item.discountWay : 0,
                            rate: item.discountRate ? item.discountRate : 0,
                            totalDiscount: this.utils.discount(item.itemPrice, (item.discountWay?item.discountWay:0), (item.discountRate?item.discountRate:0)) * item.quantity,
                            coupon: {
                                id: null,
                                method: 0,
                                rate: 0,
                                totalDiscount: this.utils.discount(item.itemPrice, 0, 0) * item.quantity,
                            }
                        }
                    })());
                }

                ret.push(ordered);
            }

            return ret;
        },

        /**
         * クーポン情報取得処理
         *
         * @return {Array<Object>} 購入商品一覧情報
         */
        async getCoupons() {
            let ret = [];

            // Lambdaアクセス
            let data = await this[_module].couponList();
            if (!data) { return ret };

            // クーポン情報データ格納
            for (const record of data) {
                ret.push((()=>{
                    return {
                        id: record.couponId,
                        barcode: record.barcode ? record.barcode : "*",
                        method: record.discountWay,
                        rate: record.discountRate,
                        comment: record.couponDiscription,
                        remarks: record.remarks,
                        image: record.imageUrl,
                    }
                })());
            }

            return ret;
        },

        // ============================================
        //     ユーティリティ
        // ============================================
        utils: {
            /**
             *　商品情報オブジェクト結合
             *
             * @param {number} count 数
             * @return {Array<Object>} リスト
             */
            sumItems(items, scanItem=null) {
                let ret = [];
    
                let map = {};
                for (const item of items) {
                    if (!(item.barcode in map)) {
                        map[item.barcode] = {
                            image: null,
                            name: null,
                            count: 0,
                            price: 0,
                            total: 0,
                            method: 0,
                            rate: 0,
                            totalDiscount: 0,
                        };
                    }
                    const record = map[item.barcode];
                    record.image = item.image;
                    record.name = item.name;
                    record.price = item.price;
                    record.method = item.method;
                    record.rate = item.rate;
                    if ("count" in item) {
                        record.count += item.count;
                        record.total += item.total;
                        // 値引き額再計算
                        const couponed = this.withCoupon(item.barcode);
                        const coupon = couponed ? this.getCoupon(item.barcode) : null;
                        for (let i=0; i<item.count; i++) {
                            if (couponed) {
                                record.totalDiscount += this.discount(item.price, coupon.method, coupon.rate);
                            } else {
                                record.totalDiscount += this.discount(item.price, item.method, item.rate);
                            }
                        }
                    } else {
                        record.count += 1;
                        record.total += item.price;
                        if (this.withCoupon(item.barcode)) {
                            const coupon = this.getCoupon(item.barcode);
                            record.totalDiscount += this.discount(item.price, coupon.method, coupon.rate);
                        } else {
                            record.totalDiscount += this.discount(item.price, item.method, item.rate);
                        }
                    }
                }

                // 並び変え
                const createRecord = (barcode, records)=>{
                    return {
                        barcode: barcode,
                        image: records[barcode].image,
                        name: records[barcode].name,
                        count: records[barcode].count,
                        price: records[barcode].price,
                        total: records[barcode].total,
                        method: records[barcode].method,
                        rate: records[barcode].rate,
                        totalDiscount: records[barcode].totalDiscount,
                    }
                };
                for (const item of items) {
                    const key = item.barcode;
                    if (scanItem) {
                        if (key == scanItem.barcode) {
                            continue;
                        }
                    }
                    ret.push(createRecord(key, map));
                }
                if (scanItem) {
                    ret.push(createRecord(scanItem.barcode, map));
                }
    
                return ret;
            },

            /**
             *　商品情報パラメーター作成
             *
             * @param {Array<Object>} items 商品情報リスト
             * @return {Array<Object>} 送信用商品情報リスト
             */
            makeProductListParam(items) {
                let productList = [];

                if (items) {
                    for (const item of items) {
                        productList.push((()=>{
                            return {
                                barcode: item.barcode,
                                quantity: item.count,
                            }
                        })());
                    }
                }

                return productList;
            },

            /**
             *　クーポン情報パラメーター付加
             *
             * @param {Array<Object>} produces 購入商品情報リスト
             * @param {Array<Object>} coupons クーポン情報リスト
             * @return {Array<Object>} 送信用商品情報リスト
             */
            addCouponListParam(products, coupons) {
                const productList = products;

                if (coupons) {
                    for (const product of products) {
                        product['couponId'] = null;
                        for (const coupon of coupons) {
                            if (coupon.barcode) {
                                if (product.barcode == coupon.barcode) {
                                    product.couponId = coupon.id;
                                }
                            }
                        }
                    }
                }

                return productList;
            },

            /**
             *　値引き額算出
             *
             * @param {number} price 金額
             * @param {number} method 値引種別 (0:なし, 1:率, 2:額)
             * @param {number} rate 値引率・額
             * @return {number} 値引後金額
             */
             discount(price, method, rate) {
                let ret = price;
    
                if (method == 1) {
                    ret = Math.floor(price * (100 - rate) / 100);
                } else if (method == 2) {
                    ret = price - rate;
                }
    
                return (ret > 0 ? ret : 0);
            },

            /**
             *　値引き額算出（クーポン情報）
             *
             * @param {number} price 金額
             * @param {Object} coupon クーポン情報
             * @return {number} 値引後金額
             */
             discountByCoupon(price, coupon) {
                return this.discount(price, coupon.method, coupon.rate);
            },
            
            /**
             *　値引種別ラベル
             *
             * @param {number} method 値引種別 (0:なし, 1:率, 2:額)
             * @param {number} rate 値引率・額
             * @return {string} 値引種別文言
             */
             discountLabel(method, rate) {
                let ret = "";

                if (method == 1) {
                    ret = `${rate}%OFF`;
                } else if (method == 2) {
                    ret = `${rate}円引き`;
                }
    
                return ret;
            },

            /**
             *　値引種別ラベル（クーポン情報）
             *
             * @param {Object} coupon クーポン情報
             * @return {string} 値引種別文言
             */
             discountLabelByCoupon(coupon) {
                return this.discountLabel(coupon.method, coupon.rate);                
            },

            /**
             * クーポン有無
             *
             * @param {string} barcode バーコード
             */
            withCoupon(barcode) {
                let ret = false;

                const coupons = this.readStore("coupons");
                if (coupons) {
                    for (const coupon of coupons) {
                        if (coupon.barcode == barcode) {
                            ret = true;
                            break;
                        }
                    }
                }

                return ret;
            },

            /**
             * クーポン情報取得
             *
             * @param {string} barcode バーコード
             */
             getCoupon(barcode) {
                let ret = null;

                const coupons = this.readStore("coupons");
                if (coupons) {
                    for (const coupon of coupons) {
                        if (coupon.barcode == barcode) {
                            ret = coupon;
                            break;
                        }
                    }
                }

                return ret;
            },

            /**
             * 全商品対象クーポン情報取得
             *
             * @param {Array<Object>} coupons 適用中クーポン情報
             * @return {string} 全商品対象クーポンID
             */
             getCouponForAllProducts(coupons) {
                let ret = null;

                for (const coupon of coupons) {
                    if (coupon.barcode == "*") {
                        ret = coupon.id;
                        break;
                    }
                }

                return ret;
            },

            /**
             *　アクセス制限処理
             *
             * @return {boolean} 真偽値
             */
             restrictAccess() {
                const origin = window.location.origin;
                const referrer = document.referrer;
                if (!referrer || referrer.indexOf(origin) != 0) {
                    window.location = "/error.html";
                    return false;
                }
                return true;
            },

            /**
             * HTTPエラー表示
             *
             * @param {Object} error
             */
            showError(error) {
                const message = _i18n.error.msg001;
                return app.$utils.showHttpError(error, message);          
            },

            /**
             *　スクロールバー トップ移動
             *
             */
             moveToTopScroll() {
                window.scroll(0, 0);
            },

            /**
             *　スクロールバー ボトム移動
             *
             */
             moveToBottomScroll() {
                const element = document.documentElement;
                const bottom = element.scrollHeight - element.clientHeight;
                window.scroll(0, bottom);
            },
    
            /**
             * Storage読み込み
             *
             * @param {string} name ストレージ要素名
             * @return {any} 値 
             */
            readStore(name) {
                let smaphregi = app.$utils.ocopy(store.state.smaphregi);
                if (!smaphregi) { smaphregi = {}; }
                return (name in smaphregi) ? smaphregi[name] : null;
            },

            /**
             * Storage書き込み
             *
             * @param {string} name ストレージ要素名
             * @param {any} value 値
             */
            writeStore(name, value) {
                let smaphregi = app.$utils.ocopy(store.state.smaphregi);
                if (!smaphregi) { smaphregi = {}; }
                smaphregi[name] = app.$utils.ocopy(value);
                store.commit("smaphregi", smaphregi);
            },

            /**
             * ロケール設定
             *
             * @param {string} locale
             */
            setLocale(locale) {
                _i18n = app.i18n.messages[locale];
            },
        },

        // ============================================
        //     Lambdaアクセス (Axios)
        // ============================================
        axios: {
            /**
             * バーコード情報検索API
             *
             * @param {number} barcode バーコード
             * @return {Object} APIレスポンス内容
             */
            barcodeInformation: async(barcode) => {
                // 送信パラメーター
                const params = {
                    locale: store.state.locale,
                    barcode: barcode,
                }
                // GET送信
                const response = await $axios.get(`${_stage}/get_item_info`, { params: params });
                return response.status==200 ? response.data : null;
            },

            /**
             * 購入商品情報保存API
             *
             * @param {string} idToken IDトークン
             * @param {Array<Object>} items 購入商品情報一覧
             * @param {string} couponId 適用クーポンID
             * @param {string} orderId オーダーID
             * @return {Object} APIレスポンス内容
             */
             productList: async(idToken, items, couponId, orderId) => {
                // 送信パラメーター
                const params = {
                    locale: store.state.locale,
                    idToken: idToken,
                    items: items,
                    couponId: couponId,
                    orderId: orderId,
                }
                // POST送信
                const response = await $axios.post(`${_stage}/put_cart_data`, params);
                return response.status==200 ? response.data : null;
            },

            /**
             * LINE Pay決済API
             *
             * @param {string} idToken IDトークン
             * @param {string} orderId オーダーID
             * @return {Object} APIレスポンス内容
             */
             payment: async(idToken, orderId) => {
                // 送信パラメーター
                const params = {
                    locale: store.state.locale,
                    idToken: idToken,
                    orderId: orderId,
                }
                // POST送信
                const response = await $axios.post(`${_stage}/put_linepay_request`, params);
                return response.status==200 ? response.data : null;
            },

            /**
             * 商品決済確定API
             *
             * @param {string} transactionId トランザクションID
             * @param {string} orderId オーダーID
             * @return {Object} APIレスポンス内容
             */
             paymentConfirmed: async(transactionId, orderId) => {
                // 送信パラメーター
                const params = {
                    locale: store.state.locale,
                    transactionId: transactionId,
                    orderId: orderId,
                }
                // POST送信
                const response = await $axios.post(`${_stage}/put_linepay_confirm`, params);
                return response.status==200 ? response.data : null;
            },

            /**
             * 商品決済確定API
             *
             * @param {string} idToken IDトークン
             * @param {string} orderId オーダーID
             * @return {Array<Object>} APIレスポンス内容
             */
             purchaseHistory: async(idToken, orderId) => {
                // 送信パラメーター
                const params = {
                    locale: store.state.locale,
                    idToken: idToken,
                    orderId: orderId,
                }
                // GET送信
                const response = await $axios.get(`${_stage}/get_order_info`, { params: params });
                return response.status==200 ? response.data : null;
            },

            /**
             * クーポン情報取得API
             *
             * @return {Object} APIレスポンス内容
             */
             couponList: async() => {
                // 送信パラメーター
                const params = {
                    locale: store.state.locale,
                }
                // POST送信
                const response = await $axios.get(`${_stage}/get_coupons_info`, { params: params });
                return response.status==200 ? response.data : null;
            },
        },

        // ============================================
        //     Lambdaアクセス (Amplify API)
        // ============================================
        amplify: {
            /**
             * バーコード情報検索API
             *
             * @param {number} barcode バーコード
             * @return {Object} APIレスポンス内容
             */
            barcodeInformation: async(barcode) => {
                let response = null;
                // 送信パラメーター
                const myInit = {
                    queryStringParameters: {
                        locale: store.state.locale,
                        barcode: barcode,
                    },
                };
                // GET送信
                try {
                    response = await app.$amplify.API.get("LambdaAPIGateway", `${_stage}/get_item_info`, myInit);
                } catch (error) {
                    // エラー処理
                    app.$smaphregi.utils.showError(error);
                }

                return response;
            },

            /**
             * 購入商品情報保存API
             *
             * @param {string} idToken IDトークン
             * @param {Array<Object>} items 購入商品情報一覧
             * @param {string} couponId 適用クーポンID
             * @param {string} orderId オーダーID
             * @return {Object} APIレスポンス内容
             */
             productList: async(idToken, items, couponId, orderId) => {
                let response = null;
                // 送信パラメーター
                const myInit = {
                    body: {
                        locale: store.state.locale,
                        idToken: idToken,
                        items: items,
                        couponId: couponId,
                    }
                };
                if (orderId) {
                    myInit.body['orderId'] = orderId;
                }
                // POST送信
                try {
                    response = await app.$amplify.API.post("LambdaAPIGateway", `${_stage}/put_cart_data`, myInit);
                } catch (error) {
                    app.$smaphregi.utils.showError(error);
                }

                return response;
            },

            /**
             * LINE Pay決済API
             *
             * @param {string} idToken IDトークン
             * @param {string} orderId オーダーID
             * @return {Object} APIレスポンス内容
             */
             payment: async(idToken, orderId) => {
                let response = null;
                // 送信パラメーター
                const myInit = {
                    body: {
                        locale: store.state.locale,
                        idToken: idToken,
                        orderId: orderId,
                    }
                };
                // POST送信
                try {
                    response = await app.$amplify.API.post("LambdaAPIGateway", `${_stage}/put_linepay_request`, myInit);
                } catch (error) {
                    app.$smaphregi.utils.showError(error);
                }

                return response;
            },

            /**
             * 商品決済確定API
             *
             * @param {string} transactionId トランザクションID
             * @param {string} orderId オーダーID
             * @return {Object} APIレスポンス内容
             */
             paymentConfirmed: async(transactionId, orderId) => {
                let response = null;
                // 送信パラメーター
                const myInit = {
                    body: {
                        locale: store.state.locale,
                        transactionId: transactionId,
                        orderId: orderId,
                    }
                };
                // POST送信
                try {
                    response = await app.$amplify.API.post("LambdaAPIGateway", `${_stage}/put_linepay_confirm`, myInit);
                } catch (error) {
                    app.$smaphregi.utils.showError(error);
                }

                return response;
            },

            /**
             * 商品決済確定API
             *
             * @param {string} idToken IDトークン
             * @param {string} orderId オーダーID
             * @return {Array<Object>} APIレスポンス内容
             */
             purchaseHistory: async(idToken, orderId) => {
                let response = null;
                // 送信パラメーター
                const myInit = {
                    queryStringParameters: {
                        locale: store.state.locale,
                        idToken: idToken,
                    },
                };
                if (orderId) {
                    myInit.queryStringParameters['orderId'] = orderId;
                }
                // GET送信
                try {
                    response = await app.$amplify.API.get("LambdaAPIGateway", `${_stage}/get_order_info`, myInit);
                } catch (error) {
                    // エラー処理
                    app.$smaphregi.utils.showError(error);
                }

                return response;
            },

            /**
             * クーポン情報取得API
             *
             * @return {Object} APIレスポンス内容
             */
             couponList: async() => {
                let response = null;
                // 送信パラメーター
                const myInit = {
                    queryStringParameters: {
                        locale: store.state.locale,
                    },
                };
                // GET送信
                try {
                    response = await app.$amplify.API.get("LambdaAPIGateway", `${_stage}/get_coupons_info`, myInit);
                } catch (error) {
                    // エラー処理
                    app.$smaphregi.utils.showError(error);
                }

                return response;
             }
        },

    }
}

export default ({ $axios, app, store, redirect, env }, inject) => {
    inject("smaphregi", VueSmaphregi($axios, app, store, redirect, env));
}
