<template>
    <v-app class="wrap">
        <!-- Header -->
        <vue-header></vue-header>
        <!-- Pages -->
        <nuxt-child />
    </v-app>        
</template>

<script>
import VueHeader from "~/components/Header.vue";

export default {
    layout: "smaphregi/smaphregi",
    components: {
        VueHeader,
    },
    async asyncData(context) {

    },
    head() {
        return {
            title: this.$t("title")
        }
    },
    data() {
        return {
            windowSize: {
                width: 0,
                height: 0
            },
        }
    },
    created() {

    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener("resize", this.resize);
            this.resize();
        });
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.resize);
    },
    methods: {
        /**
         * 画面リサイズイベント処理
         *
         */
        resize() {
            this.windowSize.width = window.innerWidth;
            this.windowSize.height = window.innerHeight;
        },

        /**
         * 商品購入履歴画面遷移
         *
         */
        viewHistory() {
            this.$flash.set("accessed", true);
            this.$router.push({ path: `/smaphregi/history` });
        },
    }
}
</script>

<style scoped>
.wrap {
    background-color: #f3f4f6;
    font-family: Ubuntu, sans-serif;
    margin: 0;
    padding: 0;
}
.header-title {
    font-size: 1.5em;
    color: white;
    margin: 0 auto;
}
</style>
