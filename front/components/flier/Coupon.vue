<template>
    <div class="coupon" style="display:table;">
        <div style="display:table-cell; vertical-align:middle;">
            <v-img contain class="image" v-bind:src="images.coupon"></v-img>
            <span class="title"><!-- 広告掲載エリア -->{{ $t("flier.coupon.msg001") }}</span>
            <span class="text">
                <span class="text-newline"><br /></span>
                <span class="line-color period" v-show="period">{{ period }}</span>&nbsp;<span v-html="$t('flier.coupon.msg002')"><!--クーポンつかえる！ 対象商品20%OFF！！ --></span>
            </span>
        </div>
        <v-btn color="warning" elevation="10" class="btn-coupon" v-on:click="viewCouponList">
            <v-icon>fas fa-ticket-alt</v-icon>&nbsp;
            <span>獲得クーポンをみる</span>
        </v-btn>
    </div>    
</template>

<script>
export default {
    props: {
        period: {
            type: [String],
            required: false,
            default: null
        }
    },
    data() {
        return {
            images: {
                coupon: "https://media.gettyimages.com/vectors/golden-ticket-certificatecoupon-vector-id124566564?s=2048x2048",
            },
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
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
.coupon {
    font-size: 1.2em;
    text-align: center;
    margin: auto;
    width: 100%;
    height: 100%;
    background-color: #FFFDB2;
}
.coupon .image {
    position: absolute;
    left: 18px;
    top: 4px;
    width: 96%;
    height: auto;
    max-width: 180px;
    opacity: 0.9;
}
.coupon .title {
    position: absolute;
    left: 6px;
    top: 6px;
    font-size: 1.2em;
    color: #F7E33E;
    text-shadow: 1px 2px 3px #fff;
}
.coupon .text-newline {
    display: none;
}
.coupon .text {
    position: relative;
    color: red;
    font-weight: bold;
    font-size: 1.0em;
}
.coupon .period {
    font-size: 0.9em;
    text-shadow: 1px 2px 3px #B2B2B2;
}

@media screen and (min-height:480px) {
    .coupon {
        font-size: 1.4em;
    }
    .coupon .image {
        display: inline-block;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        max-width: 360px;
    }
    .coupon .title {
        width: 100%;
        top: 40px;
    }
    .coupon .text-newline {
        display: block;
    }
}
@media screen and (min-height:768px) {
    .coupon {
        font-size: 2.2em;
    }
    .coupon .image {
        max-width: 380px;
    }
}
@media screen and (min-height:1024px) {
    .coupon {
        font-size: 2.8em;
    }
    .coupon .image {
        max-width: 520px;
    }
}
.btn-coupon {
    position: absolute;
    right: 3px;
    top: 3px;
    font-weight: bold;
    opacity: 0.9;
}
</style>
