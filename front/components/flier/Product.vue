<template>
    <div class="new-product" style="display:table;">
        <div style="display:table-cell; vertical-align:middle;">
            <v-img class="image" v-bind:src="images.product"></v-img>
            <v-img class="image-thumb" v-bind:src="images.product"></v-img>
            <span class="title"><!-- 広告掲載エリア -->{{ $t("flier.product.msg001") }}</span>
            <span class="text">
                <span class="text-newline"><br /></span>
                <span class="price"><!-- 新発売！¥480-->{{ $t("flier.product.msg002") }}</span><br />
                <!-- とろ～りとろける ぷるぷるプリン -->{{ $t("flier.product.msg003") }}
            </span>
        </div>
    </div>    
</template>

<script>
export default {
    data() {
        return {
            images: {
                product: "https://media.gettyimages.com/photos/flan-also-known-as-creme-caramel-picture-id161664321?s=2048x2048",
            },
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style scoped>
.new-product {
    font-size: 1.2em;
    text-align: center;
    margin: auto;
    width: 100%;
    height: 100%;
    background-color: #cccbc7;
}
.new-product .image {
    opacity: 0.5;
}
.new-product .image-thumb {
    position: absolute;
    right: 0;
    top: 0;
    height: auto;
    max-width: 160px;
    opacity: 1.0;
}
.new-product .text-newline {
    display: none;
}
.new-product .title {
    position: absolute;
    left: 6px;
    top: 6px;
    font-size: 1.2em;
    color: #F7E33E;
    text-shadow: 1px 1px 2px #fff;
}
.new-product .price {
    display: inline;
    font-weight: bold;
    font-size: 1.4em;
    color:red;    
}
.new-product .text {
    position: absolute;
    left: 0;
    top: 16px;
    width: 100%;
    margin: auto;
    font-weight: bold;
    color: #FF6600;
    text-shadow: 1px 1px 2px #fff;
}

@media screen and (min-height:480px) {
    .new-product {
        font-size: 1.3em;
    }
    .new-product .image {
        position: absolute;
        left: 0;
        top: 0;
        object-fit: contain;
        width: 100%;
        height: 100%;
        opacity: 1.0;
    }
    .new-product .image-thumb {
        display: none;
    }
    .new-product .title {
        width: 100%;
        top: 20px;
    }
    .new-product .text-newline {
        display: block;
    }
}
@media screen and (min-height:768px) {
    .new-product {
        font-size: 2.2em;
    }
}
@media screen and (min-height:1024px) {
    .new-product {
        font-size: 2.8em;
    }
}
@media screen and (min-width:768px) and (min-height:480px) {
    .new-product .image {
        opacity: 0.5;
    }
    .new-product .image-thumb {
        display: block;
        max-width: initial;
        width: 50%;
        height: 100%;
    }
}
@media screen and (min-width:1024px) and (min-height:480px) {
    .new-product .image-thumb {
        display: block;
        width: 40%;
        height: 100%;
    }
}
</style>
