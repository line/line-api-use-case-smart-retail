<template>
    <v-app-bar fixed dense color="#00ba00" style="z-index:999;">
        <v-menu transition="slide-x-transition" z-index="999" v-bind:close-on-content-click="true" ref="menu_list">
            <template v-slot:activator="{ on, attrs }">
                <v-app-bar-nav-icon v-on="on" v-bind="attrs"></v-app-bar-nav-icon>
            </template>
            <v-list shaped>
                <v-subheader>Menu</v-subheader>
                <v-list-item v-bind:disabled="Boolean(historyDisabled)" v-on:click="viewHistory">
                    <v-list-item-avatar>
                        <v-icon style="color:#00ba00;">mdi-history</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title><!-- 購入履歴 -->{{ $t("header.menu01") }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                    </v-list-item-action>
                </v-list-item>
                <v-list-item v-bind:disabled="Boolean(couponDisabled)" v-on:click="viewCouponList">
                    <v-list-item-avatar>
                        <v-icon color="warning">fas fa-ticket-alt</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title><!-- お得なクーポン -->{{ $t("header.menu02") }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-app-bar-title class="header-title"><span v-html="$t('header.store')"><!-- ○×ストア△□店 --></span></v-app-bar-title>
    </v-app-bar>
    
</template>

<script>
export default {
    props: {
        historyDisabled: {
            type: [String, Boolean],
            required: false,
            default: false
        },
        couponDisabled: {
            type: [String, Boolean],
            required: false,
            default: false
        }
    },
    data() {
        return {

        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
        /**
         * 商品購入履歴画面表示
         *
         */
        viewHistory() {
            this.$flash.set("accessed", true);
            this.$router.push({ path: "/smaphregi/history" });
        },

        /**
         * クーポン広告表示
         *
         */
        viewCoupon() {
            // ページ遷移先
            const url = "/smaphregi/";
            // ページ遷移
            this.$router.push({ path: url });
            // 広告領域表示
            if (this.$route.name == "smaphregi-index") {
                this.$nuxt.$emit("showCarousel", 0);
            } else {
                setTimeout(() => {
                    this.$nuxt.$emit("showCarousel", 0);
                }, 100);
            }
        },

        /**
         * クーポン一覧表示
         *
         */
        viewCouponList() {
            this.$router.push({ path: "/smaphregi/coupon" });
        },
    }
}
</script>

<style scoped>
.header-title {
    margin: 0 auto;
    font-size: 1.5em;
    color: white;
    pointer-events: none;
}
</style>
