<template>
    <v-app>
        <!-- Header -->
        <vue-header coupon-disabled="true"></vue-header>
        <!-- Coupon Detail -->
        <div class="header-coupon">
            <!-- 戻るボタン -->
            <v-tooltip open-delay="500" right v-bind:disabled="tooltiped">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn left fab small color="primary" class="ma-2 header-button left" v-bind="attrs" v-on="on" v-on:click="back">
                        <v-icon>fas fa-angle-left</v-icon>
                    </v-btn>
                </template>
                <span><!-- 商品購入に戻る -->{{ $t("coupon.msg001") }}</span>
            </v-tooltip>
            <h2 class="ma-2 text-center"><!-- クーポン一覧 -->{{ $t("coupon.msg002") }}</h2>
        </div>
        <!-- Coupon List -->
        <v-container fluid style="margin:100px 0 0 0;">
            <v-row justify="start" align="center">
                <v-col cols="12" md="6" lg="4" xl="3" class="coupon-list" v-for="coupon in coupons" v-bind:key="coupon.id">
                    <v-card elevation="24" class="coupon">
                        <div class="content">
                            <div style="width:25%; margin:auto;">
                                <v-img contain max-height="110" v-bind:src="coupon.image"></v-img>
                            </div>
                            <div style="width:75%; padding:6px 0 0 0; text-align:center;">
                                <v-chip color="error">{{ $smaphregi.utils.discountLabel(coupon.method, coupon.rate) }}</v-chip>
                                <p style="margin:8px 0 0 0; font-size:1.0em; font-weight:bold;" v-html="coupon.comment"></p>
                                <span style="font-size:0.8em;" v-html="coupon.remarks"></span>
                            </div>
                        </div>
                        <div class="footer" style="border-radius:0;">
                            <span style="color:#f70000; text-shadow:1px 1px 2px #fff;">適用中クーポン</span>
                        </div>
                        <div class="selected" v-show="hitCoupon(coupon)">
                        </div>
                        <div class="apply" v-show="hitCoupon(coupon)">
                            <v-chip outlined color="#f00" class="apply-text">
                                クーポン適用中
                            </v-chip>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
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
    async asyncData({ app, store }) {
        // 適用中クーポン取得
        const applyCoupons = app.$smaphregi.utils.readStore("coupons");


        return {
            coupons: applyCoupons,
            applyCoupons: applyCoupons ? applyCoupons : [],
        };
    },
    data() {
        return {
            coupons: null,
            applyCoupons: [],
        }
    },
    computed: {
        // ツールチップ表示・非表示フラグ
        tooltiped() {
            return (this.$utils.isSmartphone() || this.$utils.isTablet()) ?  true : false;
        },
    },
    created() {

    },
    mounted() {
        this.$nextTick(()=>{

        });
    },
    destroyed() {

    },
    methods: {
        /**
         * 戻るイベント処理
         *
         */
        back() {
            const url = "/smaphregi/";
            this.$router.push({ path: url });
        },

        /**
         * クーポン選択状態判定処理
         *
         * @param {Object} coupon クーポン情報
         * @return {boolean} 真偽値
         */
        hitCoupon(coupon) {
            let ret = false;
            const element = this.applyCoupons.filter((v)=>v.id===coupon.id);
            if (element && element.length > 0) {
                ret = true;
            }
            return ret;
        },

        /**
         * クーポン選択状態切替処理
         *
         * @param {Object} coupon クーポン情報
         */
        switchCoupon(coupon) {
            if (!this.hitCoupon(coupon)) {
                this.applyCoupons.push(coupon);
            } else {
                this.applyCoupons = this.applyCoupons.filter((v) => {
                    return v.id !== coupon.id;
                });
            }
            this.$smaphregi.utils.writeStore("coupons", this.applyCoupons);
        },
    }
}
</script>

<style scoped>
.header-coupon {
    position: fixed;
    width: 100%;
    margin-top: 48px;
    z-index: 99;
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

.coupon-list {
    margin: 0;
    padding: 6px 10px 0 10px;
}
.coupon {
    position: relative;
    min-height: 150px;
    background-color: #fff;
    border-radius: 16px 16px 0 0;
}
.coupon .content {
    position: absolute;
    width: 100%;
    height: calc(100% - 35px);
    display: flex;
    flex-direction: row;
}
.coupon .footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    text-align: center;
    background-color: #00ba00;
    color: #fff;
    font-weight: bold;
    padding: 6px;
}
.coupon .selected {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 9;
    background-color: #000;
    border-radius: 16px 16px 0 0;
    opacity: 0;
}
.coupon .apply {
    position: absolute;
    width: 100%;
    top: 46px;
    z-index: 9;
    text-align: center;
    font-weight: bold;
    opacity: 0;
}
.coupon .apply-text {
    z-index: 9;
    box-shadow: #fff 0 0 4px;
    text-shadow: #fff 0px 0px 4px;
}

.v-sheet.v-card {
    border-radius: 16px 16px 0 0;
}
</style>
