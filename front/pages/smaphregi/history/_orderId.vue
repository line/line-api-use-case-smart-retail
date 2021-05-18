<template>
    <v-app>
        <!-- Header -->
        <vue-header history-disabled="true"></vue-header>
        <!-- History Detail -->
        <div class="header-history">
            <!-- 戻るボタン -->
            <v-tooltip open-delay="500" right v-bind:disabled="tooltiped">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn left fab small color="primary" class="ma-2 header-button left" v-bind="attrs" v-on="on" v-on:click="back">
                        <v-icon>fas fa-angle-left</v-icon>
                    </v-btn>
                </template>
                <span><!-- 商品購入に戻る -->{{ $t("history.msg001") }}</span>
            </v-tooltip>
            <h2 class="ma-2 text-center"><!-- 購入履歴 -->{{ $t("history.msg002") }}</h2>
            <!-- 開く＆閉じるボタン -->
            <v-tooltip open-delay="500" left v-bind:disabled="tooltiped">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn fab small color="warning" class="ma-2 header-button right" v-bind="attrs" v-on="on" v-on:click="change">
                        <v-icon>{{ icon }}</v-icon>
                    </v-btn>
                </template>
                <span>{{ iconText }} </span>
            </v-tooltip>
        </div>
        <!-- 購入履歴 -->
        <div v-if="history.length == 0">
            <div style="width:100%; margin-top:150px; text-align:center;">
                <v-alert colored-border type="error" border="top" elevation="2" style="width:80%; margin:0 auto;">
                    <h3><!-- 購入履歴はありません。-->{{ $t("history.msg003") }}</h3>
                </v-alert>
            </div>
        </div>
        <div v-else>
            <v-container fluid class="pa-1" style="margin-top:100px;">
                <v-expansion-panels multiple v-model="panels">
                    <v-expansion-panel v-for="ordered in history" v-bind:key="ordered.orderId">
                        <v-expansion-panel-header class="pa-4 purchased-header">
                            <span>{{ printTimeString(ordered.date) }}</span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content id="innerExPan" class="mt-1 pa-1">
                            <v-row justify="start" align="center">
                                <!-- 合計 -->
                                <div class="product-total">
                                    <span style="position:absolute; left:6px;"><!-- 合計 -->{{ $t("history.msg004") }}</span>
                                    <span v-if="ordered.coupon.id" style="position:absolute; right:6px;">
                                        <span class="product-total-coupon">
                                            {{ $smaphregi.utils.discountLabel(ordered.coupon.method, ordered.coupon.rate) }}
                                        </span>
                                        ¥{{ ordered.totalDiscount.toLocaleString() }}
                                    </span>
                                    <span v-else style="position:absolute; right:6px;">¥{{ ordered.total.toLocaleString() }}</span>
                                </div>
                                <!-- 購入商品 -->
                                <v-col cols="12" md="6" lg="4" xl="3" class="ma-0 pa-0" v-for="(item, index) in ordered.items" v-bind:key="ordered.orderId+'_'+index">
                                    <div v-bind:class="productBox(ordered.items.length, index)">
                                        <div class="product-image">
                                            <v-img contain max-height="110" v-bind:src="item.image"></v-img>
                                        </div>
                                        <div style="width:80%;">
                                            <div class="product-name">
                                                {{ item.name }}
                                            </div>
                                            <div class="product-price">
                                                <!-- 価格 -->{{ $t("history.msg005") }} ¥{{ item.totalDiscount.toLocaleString() }}<!-- （税込） -->{{ $t("history.msg006") }}
                                                <!-- 数量 -->{{ $t("history.msg007") }} {{ item.count }}
                                            </div>
                                        </div>
                                        <div v-if="item.coupon.id" class="product-coupon">{{ $smaphregi.utils.discountLabel(item.coupon.method, item.coupon.rate) }}</div>
                                        <div v-else-if="item.method==1 || item.method==2" class="product-coupon">{{ $smaphregi.utils.discountLabel(item.method, item.rate) }}</div>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-container>
        </div>
    </v-app>    
</template>

<script>
import VueHeader from "~/components/Header.vue";

export default {
    layout: "smaphregi/smaphregi",
    components: {
        VueHeader,
    },
    head() {
        return {
            title: this.$t("title")
        }
    },
    async asyncData({ app, store, params }) {
        // アクセス制限
        if (!app.$flash.get("accessed")) {
            if (!app.$smaphregi.utils.restrictAccess()) {
                return;
            }
        }

        // パラメーター取得
        const idToken = store.state.lineUser.idToken;
        const orderId = params['orderId'];

        // 購入履歴取得
        let history = await app.$smaphregi.getPurchasedItems(idToken, orderId);
        if (!history) { history = []; }

        // 並び順変更
        history.sort(
            (previous, after) => {
                const val1 = previous.date ? previous.date : "0000/01/01 00:00:00";
                const val2 = after.date ? after.date : "0000/01/01 00:00:00";
                if (val1 < val2) return 1;
                if (val1 > val2) return -1;
                return 0;
            }
        );
        // 合計金額算出
        for (const ordered of history) {
            let items = ordered.items;
            let total = 0;
            for (const item of items) {
                if (item.coupon.id) {
                    // クーポン値引き
                    total += item.coupon.totalDiscount;
                } else if (item.method == 1 || item.method == 2) {
                    //品目値引き
                    total += item.totalDiscount;
                } else {
                    total += item.total;
                }
            }
            ordered['total'] = total;
            ordered['totalDiscount'] = app.$smaphregi.utils.discount(total, ordered.coupon.method, ordered.coupon.rate);
        }

        return {
            history: history,
        };
    },
    data() {
        return {
            panels: [0],
            history: null,
            opened: false,
        }
    },
    computed: {
        icon() {
            return this.opened ? "fas fa-folder-open" : "fas fa-folder";
        },
        iconText() {
            return this.opened ? this.$t("history.msg008") : this.$t("history.msg009"); // "全て閉じる" : "全て開く"
        },
        tooltiped() {
            return (this.$utils.isSmartphone() || this.$utils.isTablet()) ?  true : false;
        }
    },
    created() {

    },
    mounted() {
        this.$nextTick(() => {
            
        });
    },
    methods: {
        /**
         * 商品表示枠（表示幅別）
         *
         * @param {number} count 表示件数
         * @param {number} index 表示インデックス
         * @return {string} 適用クラス名
         */
        productBox(count, index) {
            let ret = ((count - 1) == index) ?  "product box product-info last" : "product box product-info";

            const breakpoint = this.$vuetify.breakpoint.name;
            switch (breakpoint) {
            case "xl":  // 4個横並び
                ret = this.productBoxClass(count, index, 4);
                break;
            case "lg":  // 3個横並び
                ret = this.productBoxClass(count, index, 3);
                break;
            case "md":  // 2個横並び
                ret = this.productBoxClass(count, index, 2);
                break;
            }

            return ret;
        },

        /**
         * 戻るイベント処理
         *
         */
        back() {
            const url = "/smaphregi/";
            this.$router.push({ path: url });
        },

        /**
         * 商品表示開くイベント処理
         *
         */
        open() {
            const count = this.history ? Object.keys(this.history).length : null;
            if (count) {
                for (let i=0; i<count; i++) {
                    this.panels.push(i);
                }
            }
        },

        /**
         * 商品表示閉じるイベント処理
         *
         */
        close() {
            this.panels = [];
        },

        /**
         * 商品表示開閉イベント処理
         *
         */
        change() {
            this.opened = !this.opened;
            if (this.opened) {
                this.open();
            } else {
                this.close();
            }
        },

        /**
         * 商品購入時刻表示処理
         *
         * @param {string} time 時刻文字列
         * @return {string} 表示用時刻文字列
         */
        printTimeString(time) {
            if (!time) return this.$t("history.msg010"); // "日時不明"

            time = time.replace(/-|:|\//g, "");
            const year = parseInt(time.substr(0, 4), 10);
            const month = parseInt(time.substr(4, 2), 10);
            const day = parseInt(time.substr(6, 2), 10);
            const hour = parseInt(time.substr(9, 2), 10);
            const minutes = parseInt(time.substr(11, 2), 10);
            const text = { year: year, month: month, day: day, hour: hour, minutes: minutes };

            return this.$t("history.yyyymmdd", text); // "{year}年{month}月{day}日 {hour}時{minutes}分"
        },

        /**
         * 商品表示枠クラス
         *
         * @param {number} count 表示件数
         * @param {number} index 表示インデックス
         * @param {number} pieces 横表示件数
         * @return {string} 適用クラス名
         */
        productBoxClass(count, index, pieces) {
            let ret = null;

            if ((count - 1) == index) {
                ret = "product box product-info right";
            } else {
                if (pieces == 1) {
                    ret = "product box product-info last";
                } else {
                    ret = "product box product-info";
                }
            }

            return ret;
        }
    }
}
</script>

<style scoped>
.header-title {
    font-size: 1.5em;
    color: white;
    margin: 0 auto;
}
.header-history {
    position: fixed;
    width: 100%;
    margin-top: 48px;
    z-index: 2;
    background-color: #FFFAFA;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .5);    
}
.header-button {
    position: absolute;
    opacity: 0.8;    
}
.header-button.left {
    left: 0;
    top: 0;
}
.header-button.right {
    right: 0;
    top:0;
}

/* History Header */
.purchased-header {
    background-color: #00ba00;
}
.purchased-header span {
    font-weight: bold;
    font-size: 1.2em;
    color: #fff;
}

/* Product */
.product.box {
    position: relative;
    display: flex;
    flex-direction: row;
    min-height: 120px;
    max-height: 120px;
    margin: 1px;
    padding: 3px;
}
.product-info {
    text-align: center;
    width: auto;
    font-weight: normal;
    background: #FFF;
    border: solid 3px #00ba00;
    border-radius: 0;
}
.product-info.last {
    border-radius: 0 0 10px 10px;
}
.product-info.left {
    border-radius: 0 0 0 10px;
}
.product-info.right {
    border-radius: 0 0 10px 0;
}
.product-image {
    width: 20%;
    margin: auto;
    padding: 0;
    overflow: hidden;    
}
.product-name {
    position:absolute;
    font-weight: bold;
    left: 22%;
    top: 0;
    padding: 12px 12px 0 0;
}
.product-price {
    position: absolute;
    left: 24%;
    bottom: 0;
    padding: 6px 0 6px 0;
    font-size: 0.9em;
}
.product-total {
    position: relative;
    width: 100%;
    height: 30px;
    margin: 1px;
    padding: 0;
    font-weight: bold;
    font-size: 1.0em;    
    color: #fff;
    background-color: #00ba00;
    border: solid 3px #00ba00;
    border-radius: 10px 10px 0 0;
}
.product-total-coupon {
    font-size: 1.0em;
    font-weight: bold;
    margin: 0 8px 0 0;
    padding: 0 6px;
    color: #fff;
    background-color: #ff3333; 
    border: 2px solid #ff3333;
    border-radius: 6px;
}
.product-coupon {
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
</style>

<style>
#innerExPan > * {
    padding: 6px;
}
</style>