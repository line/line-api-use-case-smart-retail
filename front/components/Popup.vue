<template>
    <div class="modal-wrap" v-bind:style="style">
        <input type="checkbox" v-bind:checked="showed">
        <div class="modal-overlay" v-on:click="hide">
            <div class="modal-dialog" v-on:click.stop>
                <div class="modal-header">
                    <label class="modal-close-button" v-on:click="hide">
                        <i class="fa fa-times-circle"></i>
                    </label>
                </div>
                <div class="modal-content">
                    <h2 class="modal-title">
                        <span class="modal-icon">
                            <i v-if="type=='info'" class="fa fa-info modal-type info"></i>
                            <i v-if="type=='success'" class="fa fa-check modal-type success"></i>
                            <i v-if="type=='warning'" class="fa fa-exclamation modal-type warning"></i>
                            <i v-if="type=='error'" class="fa fa-times modal-type error"></i>
                        </span>
                        <span class="modal-title-text">{{ title }}</span>
                    </h2>
                    <p class="modal-message"><span v-html="message"></span></p>
                </div>
                <div class="modal-footer" v-show="footer" ref="footer">
                    <div style="width:100%; min-height:100%; margin:0; padding:0;" v-html="elements" ref="buttons"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showed: false,
            type: null,
            title: null,
            message: null,
            footer: false,
            elements: null,
            style: {

            },
            btnStyles: {
                bgPrimary : "background-color:#007bff; color:#ffffff; font-size:1.1em; font-weight:bold;",
                bgSecondary: "background-color:#6c757d; color:#ffffff; font-size:1.1em; font-weight:bold;",
                bgSuccess: "background-color:#28a745; color:#ffffff; font-size:1.1em; font-weight:bold;",
                bgDanger: "background-color:#dc3545; color:#ffffff; font-size:1.1em; font-weight:bold;",
                bgWarning: "background-color:#ffc107; color:#ffffff; font-size:1.1em; font-weight:bold;",
                bgInfo: "background-color:#17a2b8; color:#ffffff; font-size:1.1em; font-weight:bold;",
                bgLight: "background-color:#f8f9fa; color:#000000; font-size:1.1em; font-weight:bold;",
                bgDark: "background-color:#343a40; color:#ffffff; font-size:1.1em; font-weight:bold;",
                bgUser: "background-color:{bgcolor}; color:{color}; font-size:1.1em; font-weight:bold;",
                btnRadiusLeft: "border-radius:0 0 0 10px;",
                btnRadiusRight: "border-radius:0 0 10px 0;",
            },
            btns: [],
        }
    },
    created() {

    },
    mounted() {

    },
    updated(e) {
        this.$nextTick((e)=>{
            const count = this.$refs.buttons.children.length;
            for (let i=0; i<count; i++) {
                if (this.btns && this.btns.length > 0) {
                    const btn = this.btns.shift();
                    if ("callback" in btn) {
                        const button = this.$refs.buttons.children[i];
                        button.addEventListener("click", btn.callback, false);
                        if (!("closed" in btn) || btn.closed) {
                            button.addEventListener("click", this.hide, false);
                        }
                        button.popup = this;
                    }
                }
            }
        });
    },
    beforeDestroy() {

    },
    destroyed() {

    },
    methods: {
        /**
         *　要素追加
         *
         */
        append() {
            this.$mount();
            let body = this.$parent ? this.$parent.$el : document.body;
            body.appendChild(this.$el);
        },

        /**
         *　要素削除
         *
         */
        remove() {
            let body = this.$parent ? this.$parent.$el : document.body;
            if (this.contains(body)) {
                body.removeChild(this.$el);
            }
            this.$destroy();
        },

        /**
         *　表示
         *
         * @param {string} type アイコン (info, success. warning, error)
         * @param {string} title タイトル
         * @param {string} message メッセージ
         */
        show(type, title, message) {
            this.type = type;
            this.title = title;
            this.message = message;

            this.append();
            setTimeout(()=>{
                this.showed = true;
            }, 100);
        },

        /**
         *　非表示
         *
         */
        hide() {
            this.showed = false;
            setTimeout(()=>{
                this.remove();
            }, 600);
        },

        /**
         *　表示確認
         *
         * @return {boolean} 真偽値 
         */
        contains() {
            let ret = false
            let body = this.$parent ? this.$parent.$el : document.body;
            if (body.contains(this.$el)) {
                ret = true;
            }
            return ret;
        },

        /**
         *　ボタン設定
         *
         * @param {Array<Object>} btn ボタン情報配列 [ { caption: "表示文言", color: "primary", callback: ()=>{}, closed: true } ]
         */
        buttons(btns) {
            let elements = [];

            if (btns && btns.length > 0) {
                this.btns = btns;
                const width = 100 / btns.length;
                this.footer = true;
                for (const [idx, btn] of btns.entries()) {
                    let style = `width:${width}%; height:100%; `;
                    style += this.color(("color" in btn) ? btn.color : null);
                    if (idx == 0) { style += this.btnStyles.btnRadiusLeft; }
                    if (idx == (btns.length-1)) { style += this.btnStyles.btnRadiusRight; }
                    elements.push(`<button style="${style}">${btn.caption}</button>`);
                }
            }

            this.elements = elements.join('');
        },

        /**
         *　色クラス指定
         *
         * @return {string} 指定色クラス名 
         */
        color(name) {
            let ret = this.btnStyles.bgUser;

            switch (name) {
            case "primary": ret = this.btnStyles.bgPrimary; break;
            case "secondary": ret = this.btnStyles.bgSecondary; break;
            case "success": ret = this.btnStyles.bgSuccess; break;
            case "danger": ret = this.btnStyles.bgDanger; break;
            case "warning": ret = this.btnStyles.bgWarning; break;
            case "info": ret = this.btnStyles.bgInfo; break;
            case "light": ret = this.btnStyles.bgLight; break;
            case "dark": ret = this.btnStyles.bgDark; break;
            default:
                if (name && "bgcolor" in name) {
                    ret = ret.replace("{bgcolor}", name.bgcolor);
                } else {
                    ret = ret.replace("{bgcolor}", "#ffffff");
                }
                if (name && "color" in name) {
                    ret = ret.replace("{color}", name.color);
                } else {
                    ret = ret.replace("{color}", "#000000");
                }
            }

            return ret;
        },
    }

}
</script>

<style scoped>
.modal-wrap input {
    display: none;
}
.modal-overlay {
    display: flex;
    justify-content: center;
    overflow: auto;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    opacity: 0;
    transition: opacity 0.5s, transform 0s 0.5s;
    transform: scale(0);
}
.modal-dialog {
    align-self: center;
    width: 80%;
    min-width: 100px;
    max-width: 500px;
    min-height: 200px;
    max-height: 600px;
    box-sizing: border-box;
    transform: scale(0.3);
    transition: 0.3s;
    background: #fff;
    border-radius: 10px;
    box-shadow: 6px 6px 18px #262626;
}
.modal-header {
    width: 100%;
    height: 36px;
    background-color: #00ba00;
    border-radius: 10px 10px 0 0;
}
.modal-content {
    padding: 10px;
    line-height: 1.4em;
}
@media screen and (min-width:768px) {
    .modal-content {
        padding: 20px;
    }
}
.modal-footer {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 36px;
    border-radius: 0 0 10px 10px;
}
.modal-close-button {
    position: absolute;
    top: 2px;
    right: 6px;
    font-size: 24px;
    color: #fff;
    cursor: pointer;
}
.modal-wrap input:checked ~ .modal-overlay {
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.5s;
}
.modal-wrap input:checked ~ .modal-overlay .modal-dialog {
    transform: scale(1);
}
.modal-icon {
    position: relative;
}
.modal-title {
    margin: 15px;
    text-align: center;
}
.modal-title-text {
    vertical-align: middle;
}
.modal-message {
    margin: 20px;
    text-align: center;
}
.modal-type {
    text-align: center;
    margin: 0 8px 0 0;
    padding: 10px;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    background-color: transparent;
    width: 45px;
    font-size: 20px;
    opacity: 0.8;
}
.modal-type.info {
    border: 2px solid #059;
    color: #059;
}
.modal-type.success {
    border: 2px solid #270;
    color: #270;
}
.modal-type.warning {
    border: 2px solid #9F6000;
    color: #9F6000;
}
.modal-type.error {
    border: 2px solid #D8000C;
    color: #D8000C;
}
</style>
