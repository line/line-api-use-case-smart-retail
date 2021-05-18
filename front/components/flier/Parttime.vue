<template>
    <div class="parttime" style="display:table;">
        <div style="display:table-cell; vertical-align:middle;">
            <v-img class="image" v-bind:src="images.parttime"></v-img>
            <span class="title"><!-- 広告掲載エリア -->{{ $t("flier.parttime.msg001") }}</span>
            <span class="text">
                <span class="text-newline"><br /></span>
                <span class="recruiting shadow"><!-- アルバイト募集中！！ -->{{ $t("flier.parttime.msg002") }}</span><br />
                <div class="information">
                    <div class="hourly-wage">
                        <span class="spacer"></span>
                        <v-chip color="success"><!-- 時給 -->{{ $t("flier.parttime.msg003") }}</v-chip>
                        &nbsp;<span class="shadow"><!-- 900円 -->{{ $t("flier.parttime.wage", { fee: "900" }) }}</span>
                    </div>
                    <div>
                        <span class="spacer"></span>
                        <v-chip color="info"><!-- 時間 -->{{ $t("flier.parttime.msg004") }}</v-chip>
                        <span class="shadow">&nbsp;<!-- 10:30～22:00 -->{{ $t("flier.parttime.timezone") }}</span>
                    </div>
                </div>
            </span>
        </div>
    </div>    
</template>

<script>
export default {
    data() {
        return {
            images: {
                parttime: "https://media.gettyimages.com/vectors/cashiers-and-customers-vector-id636341774?s=2048x2048",
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
.parttime {
    font-size: 1.2em;
    text-align: center;
    margin: auto;
    width: 100%;
    height: 100%;
    background-color: #fffaf0;
}
.parttime .image {
    position: absolute;
    left: 0;
    top: 0;
    object-fit: cover;
    width: 100%;
    height: 100%;
    opacity: 0.9;
}
.parttime .text-newline {
    display: none;
}

.parttime .title {
    position: absolute;
    left: 6px;
    top: 6px;
    font-size: 1.2em;
    color: #F7E33E;
    text-shadow: 1px 1px 2px #fff;
}
.parttime .recruiting {
    font-weight: bold;
    font-size: 1.2em;
    color: red;
}
.parttime .text {
    position: relative;
    color: #000;
    font-weight: bold;
}
.parttime .information {
    display: flex;
    flex-direction: row;
    justify-content: center;
    text-align: left;
}
.parttime .information .spacer {
    display: none;
}
.parttime .information .hourly-wage {
    margin-right: 20px;
}
.parttime .shadow {
    text-shadow: 1px 1px 2px #fff;
}

@media screen and (min-height:480px) {
    .parttime {
        font-size: 1.4em;
    }
    .parttime .title {
        width: 100%;
        top: 30px;
    }
    .parttime .text-newline {
        display: block;
    }
    .parttime .information {
        flex-direction: column;
        justify-content: center;
        text-align: left;
    }
    .parttime .information .spacer {
        display: inline-block;
        width: 15%;
    }
    .parttime .information .hourly-wage {
        margin-right: initial;
    }
}
@media screen and (min-height:768px) {
    .parttime {
        font-size: 2.0em;
    }
}
@media screen and (min-height:1024px) {
    .parttime {
        font-size: 2.6em;
    }
}
</style>
