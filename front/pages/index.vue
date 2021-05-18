<template>
    <v-app>
        <img v-bind:src="images.top" alt="Smaph Regi" style="width:100%;">
        <div style="color: #555; margin-top: 20px;" class="mx-5">
            <span style="border-left: 12px solid #16C464; padding:0 15px; color: #555" class="text-h5">{{ $t("top.title") }}</span>
            <ul class="text-body-2 mt-5">
                <li>{{ $t("top.msg001") }}</li>
                <li>{{ $t("top.msg002") }}</li>
            </ul>
        </div>
        <div style="line-height: 1.2em; margin-bottom: 70px;" class="mt-5 pa-2">
            <div style="font-size: 0.75em; color:#7c7c7c;" class="mx-5 mb-0">
                {{ $t("top.msg003") }}<br />
                {{ $t("top.msg004") }}<br />
                <br />
                {{ $t("top.msg005") }}
            </div>
        </div>
        <!-- ボタン -->
        <v-footer fixed style="" class="pa-0" height="60px">
            <v-btn class="purchase text-h5 font-weight-bold" color="#00B900" v-on:click="registe" style="color:#fff; width:100%; height:100%;">
                <span v-html="$t('top.msg006')"></span><v-icon large>keyboard_arrow_right</v-icon>
            </v-btn>
        </v-footer>
    </v-app>
</template>

<script>
/**
 * トップページ
 * 
 */
export default {
    layout: "smaphregi/smaphregi",
    head() {
        return {
            title: this.$t("title")
        }
    },
    async asyncData() {

    },
    data() {
        return {
            images: {
                top: "https://media.gettyimages.com/photos/checkout-picture-id172228186?s=2048x2048",
            },
        }
    },
    methods: {
        /**
         * スマホレジ画面へ遷移
         * 
         */
        registe() {
            // 音声アンロック
            this.$scanner.playUnlock();
            // ページ遷移先
            const url = "/smaphregi/";
            // カメラ起動
            this.$flash.set("camera", true);
            // ページ遷移
            this.registeForDemo(url);
        },

        /**
         * 商品購入画面遷移処理（デモ用）
         * 
         * @param {string} url 遷移先URL
         */
        registeForDemo(url) {
            if (liff.isInClient()) {
                // iOS Version Event
                const event1 = (event) => {
                    liff.openWindow({
                        url: `https://liff.line.me/${process.env.LIFF_ID}`,
                        external: true
                    });
                };
                const event2 = (event) => {
                    this.$router.push(url);
                };

                if (this.$utils.isIOS()) {
                    const version = this.$utils.getIOSVersion();
                    if (version <= 14.2) {
                        event1();
                    } else {
                        event2();
                    }
                } else {
                    event2();
                }
            } else {
                this.$router.push(url);
            }
        },
    }
}
</script>

<style scoped>
html, body {
    margin: 0;
    width: 100%;
    height: 100%;
}
li {
    margin-top: 20px;
}
.purchase {
    border-radius: 0 0 6px 6px;
}
</style>
