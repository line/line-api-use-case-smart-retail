<template>
    <v-app>
        <div>
            <v-app-bar color="#00ba00" dense>
                <v-app-bar-title class="header-title"><span v-html="$t('completed.store')"><!-- ○×ストア△□店 --></span></v-app-bar-title>
            </v-app-bar>
        </div>
        <v-container>
            <v-row justify="center" align="center" style="position:relative; min-height:86px;">
                <span class="staff-message shake-text"><!-- ありがとうございました。-->{{ $t("completed.msg001") }}</span>
                <v-img class="staff-image" v-bind:src="images.thanks" alt="Thanks"></v-img>
            </v-row>
            <v-row justify="center" align-content="center">
                <v-col align="center" class="mt-3">
                    <p class="text-h5"><v-icon large color="success">done</v-icon><!-- 決済が完了しました。 -->{{ $t("completed.msg002") }}</p>
                    <v-divider class="mt-1 mb-5"></v-divider>
                    <p><!-- またのご利用をお待ちしております。 -->{{ $t("completed.msg003") }}</p>
                    <div>
                        <v-img width="85" v-bind:src="images.linepay" alt="LINE Pay"></v-img>
                    </div>
                    <v-btn color="#00ba00" class="white--text ma-5" width="200px" v-on:click="back">
                        <v-icon>house</v-icon><span>&nbsp;<!-- TOPへ戻る -->{{ $t("completed.msg004") }}</span>
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
export default {
//    layout: "smaphregi/smaphregi",
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
        const liffId = process.env.LIFF_ID;
        const transactionId = params['transactionId'];
        const orderId = params['orderId'];
        let successed = false;

        // トランザクションID==none、オーダーID空の場合（0円決済）
        if (transactionId == "none" && !orderId) {
            successed = true;
            return {
                liffId: liffId,
                successed: successed,
            };        
        } 

        // エラーメッセージ
        let _i18n = app.i18n.messages[store.state.locale];            
        const message = (text) => {
            app.$popup.show("error", _i18n.completed.error, text); // "LINE Pay 支払"
        };

        // 連続確定処理3秒未満確認
        let intervaled = true;
        const accessTime = store.state.completed;
        if (accessTime) {
            const interval = app.$utils.dateFormat(app.$utils.addSeconds(accessTime, 3), "yyyy/mm/dd hh:mi:ss"); 
            const now = app.$utils.dateFormat(new Date(), "yyyy/mm/dd hh:mi:ss");
            if (interval > now) {
                intervaled = false;
            }
        }

        if (intervaled) {
            // 支払確定時刻
            const completedTime = app.$utils.dateFormat(new Date(), "yyyy/mm/dd hh:mi:ss");
            store.commit("completed", completedTime);
            // LINE Pay 支払い確定処理
            try {
                const response = await app.$smaphregi.confirmPayment(transactionId, orderId);
                if (response && ("returnCode" in response)) {
                    if (response.returnCode == "0000") {
                        successed = true;
                    } else {
                        // "LINE Pay 支払い確定処理に失敗しました。  Return Code: {returnCode}"
                        message(_i18n.completed.error01.replace("{returnCode}", response.returnCode));
                    }
                } else {
                    // "LINE Pay 支払い確定処理に失敗しました。  Transaction ID: {transactionId}  Order ID: {orderId}"
                    message(_i18n.completed.error02.replace("{transactionId}", transactionId).replace("{orderId}", orderId));
                }
            } catch (error) {
                console.error(error);
                // "{message}  支払い確定の通信に失敗しました。"
                message(_i18n.completed.error03.replace("{message}", error.message));
            }
        }

        return {
            liffId: liffId,
            successed: successed,
        }
    },
    fetch({ app, store }) {
        // オーダーID、カート、クーポン クリア
        app.$smaphregi.utils.writeStore("orderId", null);
        app.$smaphregi.utils.writeStore("cart", null);
        app.$smaphregi.utils.writeStore("coupons", null);
    },
    data() {
        return {
            liffId: null,
            successed: false,
            images: {
                linepay: require("~/assets/img/line_pay2.png"),
                thanks: "https://media.gettyimages.com/vectors/payment-from-smartphone-to-pos-terminal-using-nfc-technology-vector-id1131959835?s=2048x2048",
            },
        }
    },
    created() {

    },
    mounted() {
        this.$nextTick(() => {
            this.$scanner.playThankyouSound();
        });
    },
    destroyed() {

    },
    methods: {
        /**
         * トップへ画面遷移
         *
         */
        back() {
            // 音声アンロック
            this.$scanner.playUnlock();
            // カメラ起動
            this.$flash.set("camera", true);
            // 画面遷移
            this.$router.push({ path: "/smaphregi" });
        },
    }
}
</script>

<style scoped>
.header-title {
    font-size: 1.5em;
    color: white;
    margin: 0 auto;
}
.staff-message {
    position: absolute;
    font-weight: bold;
    font-size: 1.2em;
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
    right: 20px;
    top: 10px;
}
@media screen and (min-height:480px) {
    .staff-message {
        font-size: 1.4em;
        bottom: 2px;
    }
    .staff-image {
        position: relative;
        max-width: 250px;
        right: initial;
    }
}
@media screen and (min-height:768px) {
    .staff-message {
        font-size: 1.8em;
    }
    .staff-image {
        position: relative;
        max-width: 300px;
        right: initial;
    }
}
@media screen and (min-height:1024px) {
    .staff-message {
        font-size: 2.0em;
    }
    .staff-image {
        position: relative;
        max-width: 400px;
        right: initial;
    }
}
</style>
