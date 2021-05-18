<template>
    <div class="ma-0 pa-0">
        <v-container class="pa-0" style="min-width:100%; margin:0 0 70px 0;">
            <!-- Fixed Area -->
            <div style="position:fixed; top:48px; width:100%; z-index:1; background-color:#fff;">
                <!-- Staff -->
                <v-row justify="center" align="center" class="active-area ma-0 pa-0" style="background-color:#67c2df;" v-show="staff" >
                    <span class="staff-message" v-html="staffMessage"></span>
                    <v-img class="staff-image" v-bind:src="images.supermarket"></v-img>
                </v-row>
                <!-- Camera -->
                <v-row justify="center" align="center" class="active-area ma-0 pa-0" v-show="camera">
                    <!-- Camera -->
                    <v-alert dense icon="info" outlined prominent border="left" class="ma-0 caution">
                        <span v-html="cameraMessage"><!-- 商品バーコードをレーザーラインに合わせて読み取ってください --></span>
                        <div class="caution-close" v-on:click="closeScan">
                            <v-icon color="#00ba00" class="font-weight-bold">mdi-window-close</v-icon>
                        </div>
                    </v-alert>
                    <div v-if="$scanner.quagga" id="id_quagga" ref="barcode_picker" style="width:100%; height:100%;"></div>
                    <div v-else id="id_scandit" ref="barcode_picker" style="width:100%; height:100%;"></div>
                    <span class="shake-text" v-show="error">{{ errorMessage }}</span>
                    <div v-if="$scanner.quagga" style="position:absolute; background-color:#fff; width:80%; height:3px; opacity:0.9; border-radius:12px; box-shadow:0 0 10px #2ABABD,0 0 15px #2ABABD;"></div>
                </v-row>
                <!-- Carousel -->
                <v-row class="active-area ma-0 pt-0 flier" v-show="carousel">
                    <!-- Carousel -->
                    <vue-carousel count="3" ref="smaphregi_carousel">
                        <template v-slot:panel-1>
                            <!-- Coupon -->
                            <vue-coupon v-bind:period="couponPeriod"></vue-coupon>
                        </template>
                        <template v-slot:panel-2>
                            <!-- Product -->
                            <vue-product></vue-product>
                        </template>
                        <template v-slot:panel-3>
                            <!-- Part Time -->
                            <vue-parttime></vue-parttime>
                        </template>
                    </vue-carousel>
                </v-row>
                <!-- Barcode Scanner-->
                <v-row class="ma-0 pa-0">
                    <v-btn class="add-product read" height="60" v-bind:disabled="scanDisabled" v-on:click="openScanner">
                        <v-row v-if="!camera">
                            <v-col cols="2" sm="1">
                                <v-icon large color="primary">fas fa-plus-square</v-icon>
                            </v-col>
                            <v-col class="pt-4 pl-0 pr-0 pb-0">
                                <span class="info-color" style="font-size:0.8em;"><!-- バーコードスキャナーを起動する -->{{ $t("register.msg002") }}</span>
                            </v-col>
                        </v-row>
                        <v-row v-else>
                            <v-col cols="2" sm="1">
                                <v-icon large color="error">fas fa-minus-square</v-icon>
                            </v-col>
                            <v-col class="pt-4 pl-0 pr-0 pb-0">
                                <span class="error-color" style="font-size:0.8em;"><!-- バーコードスキャナーを閉じる -->{{ $t("register.msg003") }}</span>
                            </v-col>
                        </v-row>
                    </v-btn>
                </v-row>
                <!-- Cart -->
                <v-row align="center" justify="center" class="mt-1 mb-6" v-show="cart">
                    <v-btn class="cart" v-on:click="viewCart">
                        <v-icon left large>mdi-cart</v-icon>&nbsp;<!-- カートを見る -->{{ $t("register.msg004") }}
                    </v-btn>
                </v-row>
                <!-- Camera Starting -->
                <div class="camera-starting" v-show="starting">
                    <v-chip color="grey darken-1" style="color:#fff; opacity:0.8;"><!-- カメラ起動中... -->{{ $t("register.msg005") }}</v-chip>
                </div>
                <!-- Coupon Applied-->
                <div v-show="couponApplied && !carousel" v-bind:class="couponAppliedClass">
                    <v-chip outlined color="#f00" class="label"><span class="count">{{ couponCount }}</span>{{ $t("register.coupon") }}</v-chip>
                </div>
            </div>

            <!-- List -->
            <v-slide-y-transition>
                <div class="item-list" v-show="list">
                    <v-row justify="start" align="center" class="ma-0">
                        <v-col cols="12" md="6" lg="4" xl="3" class="pa-0" v-for="(item, index) in items" v-bind:key="index">
                            <div class="product box">
                                <div class="image">
                                    <v-img contain max-height="110" v-bind:src="item.image"></v-img>
                                </div>
                                <div style="width:80%;">
                                    <div class="name">
                                        {{ item.name }}
                                    </div>
                                    <div class="price">
                                        <span v-if="$smaphregi.utils.withCoupon(item.barcode) || item.method==1 || item.method==2">
                                            <span v-html="$t('register.msg006', { total: item.total ? item.total.toLocaleString() : 0 })"><!-- 価格 ¥{total} --></span>
                                            ⇒
                                            <span v-html="$t('register.msg007', { totalDiscount: item.totalDiscount ? item.totalDiscount.toLocaleString() : 0 })"><!-- ¥{totalDiscount}（税込） --></span>
                                        </span>
                                        <span v-else>
                                            <span v-html="$t('register.msg008', { total: item.total ? item.total.toLocaleString() : 0 })"><!-- 価格 ¥{total}（税込） --></span>
                                        </span>
                                        <span v-html="$t('register.msg009', { count: item.count })"><!-- 数量 {count} --></span>
                                    </div>
                                    <div class="buttons">
                                        <v-icon color="error" v-on:click="decrease(item)">fas fa-minus-circle</v-icon>
                                        <v-icon color="success" v-on:click="increase(item)">fas fa-plus-circle</v-icon>
                                        <v-icon v-on:click="remove(index)">fas fa-trash-alt</v-icon>
                                    </div>
                                </div>
                                <div class="barcode">{{ item.barcode }}</div>
                                <div v-if="$smaphregi.utils.withCoupon(item.barcode)" class="coupon">{{ $smaphregi.utils.discountLabelByCoupon($smaphregi.utils.getCoupon(item.barcode)) }}</div>
                                <div v-else-if="item.method==1 || item.method==2" class="coupon">{{ $smaphregi.utils.discountLabel(item.method, item.rate) }}</div>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </v-slide-y-transition>
        </v-container>

        <!-- Footer -->
        <v-footer class="footer" v-show="total">
            <!-- iOS 14.2 -->
            <span class="ios-warning" v-show="ios"><!-- ※ iOS 14.2以下は外部ブラウザーでの起動になります -->{{ $t("register.msg010") }}</span>
            <v-row align="center" justify="center" class="pt-0 pb-0 pl-2 pr-2">
                <v-col cols="2" align="left">
                    <span class="label-total"><!-- 合計 -->{{ $t("register.msg011") }}</span>
                </v-col>
                <v-col cols="10" align="right">
                    <span class="total" v-if="$smaphregi.utils.withCoupon('*')">
                        <div v-if="totalPrice > 0">
                            <span style="text-decoration:line-through;">¥{{ totalPrice.toLocaleString() }}</span>
                            ⇒
                            <span style="color:#f70000;">¥{{ totalDiscountPrice.toLocaleString() }}</span> 
                            <span class="tax"><!-- (税込み) -->{{ $t("register.msg012") }}</span>
                        </div>
                        <div v-else>
                            <span>¥{{ totalPrice.toLocaleString() }}</span>
                            <span class="tax"><!-- (税込み) -->{{ $t("register.msg012") }}</span>
                        </div>
                    </span>
                    <span class="total" v-else>¥{{ totalPrice.toLocaleString() }}<span class="tax"><!-- (税込み) -->{{ $t("register.msg012") }}</span></span>
                </v-col>
            </v-row>
            <v-btn class="casher" style="color:#fff;" v-bind:disabled="disabled" v-on:click="payment"><!-- 購入する -->{{ $t("register.msg013") }}</v-btn>
        </v-footer>

        <!-- Scanned Product Dialog -->
        <v-dialog max-width="500" v-bind:hide-overlay="true" v-model="productDialog.showed">
            <div class="dialog item">
                <div class="image">
                    <v-img contain max-height="110" v-bind:src="productDialog.item.image"></v-img>
                </div>
                <div class="description">
                    <div class="name">
                        {{ productDialog.item.name }}
                    </div>
                    <div class="price">
                        <!-- クーポン適用 -->
                        <span v-if="$smaphregi.utils.withCoupon(productDialog.item.barcode)" class="discount">
                            <span class="coupon">
                                {{ $smaphregi.utils.discountLabelByCoupon($smaphregi.utils.getCoupon(productDialog.item.barcode)) }}
                            </span>
                            ¥{{ $smaphregi.utils.discountByCoupon(productDialog.item.price, $smaphregi.utils.getCoupon(productDialog.item.barcode)).toLocaleString() }}
                        </span>
                        <!-- 品目値引き -->
                        <span v-else-if="productDialog.item.method==1 || productDialog.item.method==2" class="discount">
                            <span class="coupon">
                                {{ $smaphregi.utils.discountLabel(productDialog.item.method, productDialog.item.rate) }}
                            </span>
                            ¥{{ $smaphregi.utils.discount(productDialog.item.price, productDialog.item.method, productDialog.item.rate).toLocaleString() }}
                        </span>
                        <span v-else>¥{{ productDialog.item.price.toLocaleString() }}</span>
                        <!-- （税込） -->{{ $t("register.msg014") }}
                    </div>
                </div>
            </div>
            <div class="dialog barcode">
                <span>{{ productDialog.item.barcode }}</span>
            </div>
        </v-dialog>
        <!-- Scan Error Dialog -->
        <v-dialog max-width="500" v-bind:hide-overlay="true" v-model="errorDialog.showed">
            <div class="error-box">
                {{ errorDialog.item.message }}
            </div>
            <div class="error-barcode">
                <span>{{ errorDialog.item.barcode }}</span>
            </div>
        </v-dialog>
    </div>
</template>

<script>
import VueCarousel from "~/components/Carousel.vue";
import VueCoupon from "~/components/flier/Coupon.vue";
import VueProduct from "~/components/flier/Product.vue";
import VueParttime from "~/components/flier/Parttime.vue";

export default {
    components: {
        VueCarousel,
        VueCoupon,
        VueProduct,
        VueParttime,
    },
    async asyncData({ app, store }) {
        let items = [];
        // カート内商品取得
        let storage = app.$smaphregi.utils.readStore("cart");
        if (storage) {
            items = app.$smaphregi.utils.sumItems(storage);            
        }
        // カメラ起動オプション取得
        const startCamera = app.$flash.get("camera") ? true : false;

        return {
            items: items,
            sended: false,
            startCamera: startCamera,
        };
    },
    async fetch({ app, store }) {
        // クーポン情報取得
        const coupons = await app.$smaphregi.getCoupons();
        // 獲得クーポン格納
        app.$smaphregi.utils.writeStore("coupons", coupons);
    },
    data() {
        return {
            staff: false,
            camera: false,
            carousel: false,
            cart: false,
            list: false,
            total: true,
            images: {
                supermarket: "https://media.gettyimages.com/vectors/online-shopping-concept-vector-id1131955420?s=2048x2048",
            },
            items: null,
            ngItems: [],
            productDialog: {
                handle: null,
                showed: false,
                item: {
                    image: null,
                    name: null,
                    price: 0,
                    barcode: null,
                    method: 0,
                    rate: 0,
                }
            },
            sended: false,
            picker: null,
            interval: 800,
            error: false,
            errorMessage: null,
            errorDialog: {
                handle: null,
                showed: false,
                item: {
                    message: null,
                    barcode: null,
                }
            },
            startCamera: false,
            scanDisabled: true,
            starting: false,
            panels: 0,
            scanMessage: this.$t("register.msg001"), // "商品バーコードをレーザーラインに合わせて読み取ってください"
            staffMessage: this.$t("register.msg015"),  // "商品をご確認の上 [ 購入する ] ボタンを押してください。"
        }
    },
    computed: {
        // 画面上部アクティブプロパティ
        active: {
            get() {
                let mode = null;
                if (this.camera) {
                    mode = "camera";
                } else if (this.staff) {
                    mode = "staff";
                } else if (this.carousel) {
                    mode = "carousel";
                }
                return mode;
            },
            set(value) {
                if (value == "camera") {
                    this.staff = false;
                    this.carousel = false;
                    this.camera = true;
                } else if (value == "staff") {
                    this.camera = false;
                    this.carousel = false;
                    this.staff = true;
                } else if (value == "carousel") {
                    this.camera = false;
                    this.staff = false;
                    this.carousel = true;
                } else if (value == "auto") {
                    if (this.items && this.items.length > 0) {
                        this.camera = false;
                        this.carousel = false;
                        this.staff = true;
                    } else {
                        this.camera = false;
                        this.staff = false;
                        this.carousel = true;
                    }
                } else {
                    this.camera = false;
                    this.staff = false;
                    this.carousel = false;
                }
            }
        },
        // カメラONプロパティ
        cameraOn: {
            get() {
                return this.camera;
            },
            set(value) {
                this.active = value ? "camera" : "auto";
            }
        },
        // カメラ情報
        cameraMessage() {
            return this.scanMessage;
        },
        // 合計金額プロパティ
        totalPrice() {
            let price = 0;
            for (const item of this.items) {
                if (item.method == 1 || item.method == 2 || this.$smaphregi.utils.withCoupon(item.barcode)) {
                    //値引き
                    price += item.totalDiscount;
                } else {
                    price += item.total;
                }
            }
            return price;
        },
        // 合計値引金額プロパティ
        totalDiscountPrice() {
            let price = this.totalPrice;

            if (this.$smaphregi.utils.withCoupon("*")) {
                const coupon = this.$smaphregi.utils.getCoupon("*");
                price = this.$smaphregi.utils.discount(price, coupon.method, coupon.rate);
            }        

            return price;
        },
        // [購入する]ボタン使用不可プロパティ
        disabled() {
            return (this.items && this.items.length > 0 && !this.sended) ? false : true;
        },
        // iOSバージョン判定プロパティ
        ios() {
            let ret = false;
            if (this.$utils.isIOS()) {
                const version = this.$utils.getIOSVersion();
                if (version <= 14.2) {
                    ret = true;
                }
            }
            return ret; 
        },
        // クーポン期間プロパティ
        couponPeriod() {
            let period = this.$utils.now("mm/dd", 1);
            period = period.replace(/^0+/, "").replace(/\/0+/, "/");
            return this.$t("register.until", { period: period }); // "～{period}まで"
        },
        // クーポン適用件数
        couponCount() {
            const coupons = this.$smaphregi.utils.readStore("coupons");
            return (coupons && coupons.length > 0) ? coupons.length : 0;
        },
        // クーポン適用中
        couponApplied() {
            const coupons = this.$smaphregi.utils.readStore("coupons");
            return (coupons && coupons.length > 0 && !this.starting) ? true : false;
        },
        // クーポン適用中表示クラス
        couponAppliedClass() {
            return this.camera ? "coupon-applied" : "coupon-applied top";
        }
    },
    created() {
        // 購入商品一覧表示
        if (this.items && this.items.length > 0) {
            this.cart = true;
            window.scroll(0, 0);
        }
        // クーポン表示イベント設定
        this.$nuxt.$on("showCarousel", this.showCarousel);
    },
    mounted() {
        this.$nextTick(() => {
            // カート内商品表示
            this.viewCart();
            // バックグラウンド＆フォアグランドイベント設定
            document.addEventListener("visibilitychange", this.changeBackgroundAndForeground, false);
            // カメラ起動
            if (this.startCamera) {
                this.openScanner();
            } else {
                this.scanDisabled = false;
                this.cameraOn = false;
            }
        });
    },
    beforeDestroy() {
        // カメラ終了
        this.closeScan();
    },
    destroyed() {
        // バックグラウンド＆フォアグラウンドイベント設定
        document.removeEventListener("visibilitychange", this.changeBackgroundAndForeground);
        // クーポン表示イベントクリア
        this.$nuxt.$off("showCarousel");
    },
    methods: {
        /**
         * カート内商品表示
         *
         */
        viewCart() {
            this.list = true;
            this.cart = false;
        },

        /**
         * バーコードスキャナー表示
         *
         */
        async openScanner() {
            if (!this.camera) {
                this.starting = true;
                try {
                    // 音声出力
                    this.$scanner.playUnlock();
                    // Create BarcodePicker Instance
                    this.picker = await this.$scanner.createScan(this.$refs.barcode_picker, this.scanBarcode);
                    this.cameraOn = true;
                    this.scanDisabled = false;
                } finally {
                    setTimeout(() => {
                        this.starting = false;
                    }, 0);
                }
            } else {
                this.closeScan();
            }
        },

        /**
         * 商品購入処理
         *
         */
        payment() {
            if (this.sended) return;    // 二重送信禁止
            this.sended = true;
            this.staffMessage = null;
            this.closeScan();

            this.$smaphregi.utils.writeStore("cart", this.items);
            const idToken = this.$store.state.lineUser.idToken;
            const items = this.items;
            const coupons = this.$smaphregi.utils.readStore("coupons");

            let waitingMsg = this.$t("register.msg016"); // "LINE Pay を呼び出しています.."
            if (this.totalDiscountPrice == 0) { waitingMsg = this.$t("register.msg017"); } // "決済処理を行っています.."
            this.$processing.show(0, waitingMsg); 

            // サーバー側カートに購入商品情報配置
            let orderId = this.$smaphregi.utils.readStore("orderId");
            this.$smaphregi.putInCart(idToken, items, coupons, orderId)
            .then(async (response) => {
                if (response) {
                    orderId = response.orderId;
                    // 決済判定
                    if (orderId) {
                        this.$smaphregi.utils.writeStore("orderId", orderId);
                        // LINE Pay 決済
                        const url = await this.$smaphregi.makePayment(idToken, orderId);
                        if (url) {
                            window.location = url;
                        }
                        this.$processing.hide();
                    } else {
                        // 0円決済
                        this.$flash.set("accessed", true);
                        this.$processing.hide();
                        this.$router.push({ path: "/smaphregi/completed/none" });
                    }
                }
            })
            .catch((error) => {
                console.error(error);
                this.$processing.hide();
            });
        },

        /**
         * カート内商品数増加
         *
         * @param {Object} item 商品情報
         */
        increase(item) {
            if (item.count < 100) {
                item.count += 1;
                item.total = item.price * item.count;
                if (this.$smaphregi.utils.withCoupon(item.barcode)) {
                    const coupon = this.$smaphregi.utils.getCoupon(item.barcode);
                    item.totalDiscount = this.$smaphregi.utils.discount(item.price, coupon.method, coupon.rate) * item.count;
                } else {
                    item.totalDiscount = this.$smaphregi.utils.discount(item.price, item.method, item.rate) * item.count;
                }
                setTimeout(() => {
                    this.$smaphregi.utils.writeStore("cart", this.items);
                }, 0);
            }
        },

        /**
         * カート内商品数減少
         *
         * @param {Object} item 商品情報
         */
        decrease(item) {
            if (item.count > 1) {
                item.count -= 1;
                item.total = item.price * item.count;
                if (this.$smaphregi.utils.withCoupon(item.barcode)) {
                    const coupon = this.$smaphregi.utils.getCoupon(item.barcode);
                    item.totalDiscount = this.$smaphregi.utils.discount(item.price, coupon.method, coupon.rate) * item.count;
                } else {
                    item.totalDiscount = this.$smaphregi.utils.discount(item.price, item.method, item.rate) * item.count;
                }
                setTimeout(() => {
                    this.$smaphregi.utils.writeStore("cart", this.items);
                }, 0);
            }
        },

        /**
         * カート内商品削除
         *
         * @param {number} index 商品配列インデックス
         */
        remove(index) {
            this.items.splice(index, 1);
            if (this.items.length == 0 && !this.cameraOn) {
                this.active = "auto";
            }
            setTimeout(() => {
                this.$smaphregi.utils.writeStore("cart", this.items);
            }, 0);
        },

        /**
         * スキャン商品表示
         *
         * @param {Object} item 商品情報
         */
        popupItem(item) {
            this.productDialog.item = item;
            this.productDialog.showed = true;
            clearTimeout(this.productDialog.handle);
            this.productDialog.handle = setTimeout(() => {
                this.productDialog.showed = false;
            }, 3000);
        },

        /**
         * 商品カート追加
         *
         * @param {Object} item 商品情報
         */
        addItem(item) {
            let items = this.items;

            let scanned = [item];
            if (scanned) {
                const scanItems = this.$smaphregi.utils.sumItems(scanned)
                items = items.concat(scanItems);
                items = this.$smaphregi.utils.sumItems(items, item);
                setTimeout(() => {
                    this.$smaphregi.utils.writeStore("cart", items);
                }, 0);
            }

            this.items = items;
            setTimeout(() => {
                // スキャン商品情報ポップアップ表示
                this.popupItem(item);
                // スキャン商品情報カート格納
                this.$smaphregi.utils.writeStore("cart", this.items);
            }, 0);
        },

        /**
         * バーコード読取処理
         *
         * @param {number} barcode 商品バーコード
         */
        scanBarcode(barcode) {
            // スキャン一時停止
            this.$scanner.pauseScanning();
            // 商品情報取得
            this.$smaphregi.getProductInformation(barcode.data)
            .then((item) => {
                if (!item || item.length == 0) { return; }
                // 効果音再生
                if (item.name == "ERROR" || item.price == "ERROR") {
                    this.$scanner.playErrorSound();
                    // エラーメッセージ
                    this.showError(barcode.data, this.$t("register.error01")); // "認識しない商品です"

                    setTimeout(()=>{
                        // スキャン再開
                        this.$scanner.resumeScanning();
                        // スクロール操作
                        this.$smaphregi.utils.moveToBottomScroll();
                    }, this.interval);

                    return;
                } else {
                    this.$scanner.playPiSound();
                }
                // 同一ラベル確認
                if (this.items && this.items.length > 0) {
                    const prevBarcode = this.items[this.items.length-1].barcode;
                    if (barcode.data == prevBarcode) {
                        this.$scanner.playSamelabelSound();
                    }
                }
                // 商品リスト格納
                this.addItem(item);

                setTimeout(()=>{
                    // スキャン再開
                    this.$scanner.resumeScanning();
                    // スクロール操作
                    if (this.items && this.items.length > 1) {
                        this.ngItems = [];
                        this.$smaphregi.utils.moveToBottomScroll();
                    }

                }, this.interval);
            }).catch((error)=>  {
                this.$scanner.playErrorSound();
                setTimeout(()=>{
                    this.$scanner.resumeScanning();
                }, this.interval);
                console.error(error);
                this.showError(this.$t("register.error02")); // "読取りに失敗しました"
            });
        },

        /**
         * バーコードスキャナー非表示
         *
         */
        closeScan() {
            if (this.picker) {
                this.$scanner.destroy();
                this.picker = null;
            }
            this.cameraOn = false;
            this.ngItems = [];
        },

        /**
         * バーコードスキャンエラー表示
         *
         * @param {number} barcode 商品バーコード
         * @param {string} message メッセージ文言
         */
        showError(barcode, message) {
            this.errorMessage = message;
            this.error = true;
            const ngItem = {
                barcode: barcode,
                message: this.$t("register.error03"), // "この商品は登録されていません"
            }
            this.errorDialog.item = ngItem;
            this.errorDialog.showed = true;
            setTimeout(() => { this.error = false; }, 2500);
            clearTimeout(this.errorDialog.handle);
            this.errorDialog.handle = setTimeout(() => { 
                this.errorDialog.showed = false;
            }, 3000);
        },

        /**
         * カルーセル指定表示
         *
         * @param {number} index カルーセルインデックス
         */
        showCarousel(index) {
            this.closeScan();
            this.$refs.smaphregi_carousel.panel = index;
            this.active = "carousel";
        },

        /**
         * 画面バックグラウンド＆フォアグラウンド切替わり時処理
         *
         */
        changeBackgroundAndForeground() {
            if (document.visibilityState == "visible") {
                // カメラ起動
                this.openScanner();
            } else {
                // カメラ終了
                this.closeScan();
            }
        }
    }
}
</script>

<style scoped>
.active-area {
    position: relative;
    height: 100px;
    min-height: 100px;
    max-height: 100px;
    background-color: #000;
}
.staff-message {
    position: absolute;
    font-weight: bold;
    font-size: 1.0em;
    color: #d9534f;
    text-align: center;
    text-shadow: 1px 1px 2px #fff;
    z-index: 1;
    width: 100%;
    bottom: 10px;    
}
.staff-image {
    position: absolute;
    max-width: 150px;
    height: auto;
    right: 20px;
}
.item-list {
    margin-top: 211px;
    margin-bottom: 96px;
}
@media screen and (min-height:480px) {
    .active-area {
        position: relative;
        height: 200px;
        min-height: 200px;
        max-height: 200px;
    }
    .staff-message {
        font-size: 1.1em;
        bottom: 14px;
    }
    .staff-image {
        position: relative;
        max-width: 300px;
        right: initial;
    }
    .item-list {
        margin-top: 312px;
        margin-bottom: 96px;
    }
}
@media screen and (min-height:768px) {
    .active-area {
        position: relative;
        height: 200px;
        min-height: 200px;
        max-height: 200px;
    }
    .staff-message {
        font-size: 1.6em;
        bottom: 14px;
    }
    .staff-image {
        position: relative;
        max-width: 300px;
        right: initial;
    }
    .item-list {
        margin-top: 312px;
        margin-bottom: 96px;
    }
}
@media screen and (min-height:1024px) {
    .active-area {
        position: relative;
        height: 300px;
        min-height: 300px;
        max-height: 300px;
    }
    .staff-message {
        font-size: 1.8em;
        bottom: 30px;
    }
    .staff-image {
        position: relative;
        max-width: 450px;
        right: initial;
    }
    .item-list {
        margin-top: 412px;
        margin-bottom: 96px;
    }
}
.add-product {
    width: 100%;
    font-size: 1.5em;
    letter-spacing: 5px;
    text-align: center;
    border: none;
    border-radius: 5px;
    font-weight: bold;
}
.read {
    text-align: left;
    font-size: 1.3em;
    letter-spacing: 0;
    line-height: 0;
}
.cart {
    width: 100%;
    font-size: 1.2em;
    font-weight: bold;
    padding: 30px !important;
}
.list {
    overflow-y: scroll;
    width: 100%;
    height: auto;
    margin-bottom: 100px;
}
.casher {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    min-height: 60px;
    font-size: 1.5em;
    font-weight: bold;
    letter-spacing: 0.2em;
    background-image: linear-gradient(#00ba00 0%, #00ba00 100%);
    color: white;
    border-radius: 0 0 6px 6px;
}
/* Footer */
.footer {
    background-color: white;
    width: 100%;
    position: fixed;
    bottom: 0;
    margin: 0;
    padding: 0;
}
.footer .label-total {
    font-size: 1.2em;
    white-space: nowrap;
}
.footer .total {
    font-size: 1.5em;
    font-weight: bold;
    white-space: nowrap;
}
.footer .total .tax {
    font-size: 0.9rem;
    font-weight: normal;
    padding-left: 3px;
}
@media screen and (max-width:360px) {
    .footer {
        font-size: 0.9em;
    }
}
@media screen and (max-width:280px) {
    .footer {
        font-size: 0.8em;
    }
}

/* Product */
.product {
    position: relative;
    display: flex;
    flex-direction: row;
    min-height: 120px;
    max-height: 120px;
    margin: 1px;
    padding: 3px;
}
.product.box {
    text-align: center;
    width: auto;
    font-weight: normal;
    background: #FFF;
    border: solid 3px #6091d3;
    border-radius: 10px;
}
.product .image {
    width: 20%;
    margin: auto;
    padding: 0;
    overflow: hidden;    
}
.product .name {
    position: relative;
    text-align: left;
    font-weight: bold;
    top: 0;
    padding: 6px 6px 0 4px;
}
.product .price {
    position: absolute;
    bottom: 28px;
    text-align: left;
    margin: 0 0 0 8px;
    font-size: 0.9em;    
}
.product .barcode {
    position: absolute;
    left: 0;
    bottom: 0;
    margin: 0;
    padding: 0 6px;
    border: solid #6091d3;
    border-width: 2px 2px 0 0;
    border-radius: 0 12px 0 0;
    color: #2ABABD;
    opacity: 0.8;
}
.product .buttons {
    position: absolute;
    right: 4px;
    bottom: 2px;
    opacity: 0.9;
    letter-spacing: 0.2em;
}
.product .scanning {
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
}
.product .coupon {
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
    padding: 0 6px 0 3px;
    border: solid #f70000;
    border-width: 0 2px 2px 0;
    border-radius: 0 0 12px 0;
    font-weight: bold;
    color: #f70000;
    opacity: 0.9;
}

/* Flier */
.flier {
    font-size: 1.0em;
    background-color: #fff;
}

/* Caution */
.caution {
    position: absolute;
    top: 2px;
    z-index: 1;
    width: 99%;
    color: #00ba00;
    font-size: 0.8em;
}
.caution span {
    font-weight: bold;
    text-shadow: 1px 1px 2px #fff;    
}
.caution-close {
    position: absolute;
    right: 0;
    top: 0;
    margin: 0;
    cursor: pointer;    
}
@media screen and (min-width:360px) {
    .caution {
        font-size: 1.0em;
    }
}

/* Scan Error */
.scanerror-enter-active {
    transition: opacity 1.0s;
}
.scanerror-enter {
    opacity: 0;
}
.scanerror-enter-to {
    opacity: 1;
}
.scanerror-leave-active {
    transition: opacity 1.0s;
}
.scanerror-leave {
    opacity: 1;
}
.scanerror-leave-to {
    opacity: 0;
}
.error-box {
    position: relative;
    min-height: 60px;
    max-height: 60px;
    margin: 1px;
    padding: 3px;
    /* Message */
    text-align: center;
    padding: 16px;
    width: auto;
    font-weight: bold;
    color: #f00;
    background: #FFF;
    border: solid 3px #f00;
    border-radius: 10px 10px 0 0;
}
.error-barcode {
    position: relative;
    height: 36px;
    margin: 1px;
    padding: 0;
    font-weight: normal;
    font-size: 1.1em;
    text-align: center;
    background: #FFF;
    border: solid 3px #f00;
    border-radius: 0 0 10px 10px;
}

/* iOS 14.2以前 */
.ios-warning {
    position: absolute;
    right: 6px;
    top: -18px;
    font-size: 0.8em;
    font-weight: bold;
    color: #f00;
    text-shadow: 0.5px 0.5px 0.5px #fff;
    pointer-events: none;
}

/* Camera Starting */
.camera-starting {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 32%;
    margin: 0 auto;
    text-align: center;
}

/* Dialog Item */
.dialog.item {
    position: relative;
    display: flex;
    flex-direction: row;
    min-height: 120px;
    max-height: 120px;
    margin: 0 auto;
    padding: 3px;
    /* Information */
    text-align: center;
    width: 0 auto;
    font-weight: normal;
    background: #FFF;
    border: solid 4px #6091d3;
    border-radius: 10px 10px 0 0;
    opacity: 0.9;
}
.dialog .image {
    position: relative;
    width: 20%;
    margin: auto;
    padding: 0;
    overflow: hidden;
}
.dialog .description {
    position: relative;
    width: 80%;
}
.dialog .description .name {
    position: absolute;
    left: 0;
    top: 10px;
    padding: 0 3px;
    font-size: 1.0em;
    font-weight: bold;
    white-space: normal;   
}
.dialog .description .price {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 1.0em;
    font-weight: bold;    
}
.dialog .description .price .discount {
    color: #f70000;
}
.dialog .description .price .coupon {
    font-size: 1.0em;
    font-weight: bold;
    margin: 0 8px 0 0;
    padding: 0 6px;
    color: #f70000;
    border: 2px solid #f70000;
    border-radius: 6px;
}
.dialog.barcode {
    position: relative;
    height: 36px;
    margin: 1px auto 0 auto;
    padding: 0;
    font-weight: normal;
    font-size: 1.1em;
    text-align: center;
    background: #FFF;
    border: solid 4px #6091d3;
    border-radius: 0 0 10px 10px;
    opacity: 0.9;
}

/* Coupon Applied */
.coupon-applied {
    position: absolute;
    left: 5px;
    bottom: 65px;
    width: 100%;
    text-align: left;
    font-weight: 900;
    pointer-events: none;
}
.coupon-applied.top {
   top: 10px;
}
.coupon-applied .label {
    font-size: 0.6em;
    box-shadow: #fff 0 0 10px;
    text-shadow: #fff 1px 2px 4px;
}
.coupon-applied .count {
    font-size: 1.3em;
    margin: 0 3px 2px 0;
}
</style>

<style>
.v-dialog {
    border-radius: 12px;
}
/* Quagga */
#id_quagga video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    object-fit: cover;
}
canvas.drawingBuffer, video.drawingBuffer {
    width: 100%;
    height: 100%;
}
</style>