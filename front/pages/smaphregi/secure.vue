<template>
    <div></div>
</template>

<script>
export default {
    async asyncData({ app }) {
        // アクセス制限
        app.$smaphregi.utils.restrictAccess();
    },
    data() {
        return {

        }
    },
    created() {
        if ("transactionId" in this.$route.query && "orderId") {
            // トランザクションID取得
            const transactionId = this.$route.query['transactionId']
            // オーダー番号取得
            const orderId = this.$route.query['orderId'];
            // LIFF Login Redirect URL
            const completedRedirectUrl = `${location.protocol}//${location.host}/smaphregi/secure?orderId=${orderId}`;
            // 支払完了画面へ遷移
            this.gotoCompleted(transactionId, orderId, completedRedirectUrl);

        } else if ("orderId" in this.$route.query) {
            // オーダー番号取得
            const orderId = this.$route.query['orderId'];
            // LIFF Login Redirect URL
            const loginRedirectUrl = `${location.protocol}//${location.host}/smaphregi/secure?orderId=${orderId}`;
            // 商品履歴画面へ遷移
            this.gotoHistory(orderId, loginRedirectUrl);
        }
    },
    mounted() {
        this.$processing.show(1, "");
    },
    destroyed() {
        this.$processing.hide();
    },
    methods: {
        /**
         * 商品購入履歴画面遷移
         *
         * @param {string} orderId オーダーID
         * @param {string} redirectUrl LIFF Login エンドポイントURL
         */
        gotoHistory(orderId, redirectUrl) {
            // LIFF Initialize
            this.$liff.init(redirectUrl, async () => {
                // Get LIFF Profile
                this.$flash.set("LIFF_INITED", true);
                const lineUser = await this.$liff.getLiffProfile();
                this.$store.commit("lineUser", lineUser);
                // 商品購入履歴画面へ遷移
                this.$router.push({ path: `/smaphregi/history/${orderId}` });
            });
        },

        /**
         * 商品購入確定画面遷移
         *
         * @param {string} transactionId トランザクションID
         * @param {string} orderId オーダーID
         * @param {string} redirectUrl LIFF Login エンドポイントURL
         */
        gotoCompleted(transactionId, orderId, redirectUrl) {
            // LIFF Initialize
            this.$liff.init(redirectUrl, async () => {
                // Get LIFF Profile
                this.$flash.set("LIFF_INITED", true);
                this.$store.commit("lineUser", null);
                // 商品購入履歴画面へ遷移
                this.$router.push({ path: `/smaphregi/completed/${transactionId}/${orderId}` });
            });
        },
    }
}
</script>

<style scoped>

</style>
