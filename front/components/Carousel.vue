<template>
    <v-carousel
        cycle
        width="100%"
        height="100%"
        delimiter-icon="fas fa-dot-circle"
        v-bind:interval="interval"
        v-bind:hide-delimiter-background="hideDelimiterBackground"
        v-bind:hide-delimiters="hideDelimiters"
        v-bind:show-arrows-on-hover="showArrowsOnHover"
        v-model="currentPanel"
        v-on:change="change"
    >
        <v-carousel-item v-for="index of Number(count)" v-bind:key="index">
            <slot v-bind:name="'panel-'+index"></slot>
        </v-carousel-item>
    </v-carousel>
</template>

<script>
export default {
    props: {
        count: {
            type: [String, Number],
            required: false,
            default: 1
        },
    },
    data() {
        return {
            interval: 6000,
            currentPanel: 0,
            hideDelimiterBackground: true,
            hideDelimiters: false,
            showArrowsOnHover: true
        }
    },
    computed: {
        panel: {
            get() {
                return this.currentPanel;
            },
            set(value) {
                this.currentPanel = value;
                this.interval = 600 * 1000;
            }
        }
    },
    created() {

    },
    mounted() {

    },
    destroyed() {

    },
    methods: {
        /**
         *　表示内容変更イベント処理
         *
         */
        change(index) {
            if (this.interval > 6000) {
                this.interval = 6000;
            }
        }
    }
}
</script>

<style scoped>

</style>
