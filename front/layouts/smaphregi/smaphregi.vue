<template>
    <div v-show="loggedIn">
        <nuxt />
    </div>
</template>

<script>
/**
 * スマホレジ レイアウト画面
 * 
 */
import "~/assets/css/style.css";
import "~/assets/sass/app.scss";

export default {
    middleware: [
        "initialize"
    ],
    components: {

    },
    data() {
        return {
            loggedIn: false,
        }
    },
    created() {
        this.$nuxt.$on("v-show", this.show);
        this.$vuetify.theme.dark = false;
    },
    mounted() {
        liff.ready.then(() => {
            this.loggedIn = liff.isLoggedIn();
        });
    },
    destroyed() {
        this.$nuxt.$off("v-show");
    },
    methods: {
        /**
         * 画面表示処理
         * 
         * @param {boolean} showed 表示・非表示値
         */
        show(showed) {
            this.loggedIn = showed;
        }
    }
}
</script>

<style scoped>

</style>
