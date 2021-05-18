import Vue from "vue";
import VPopup from "~/components/Popup.vue";

/**
 * ポップアッププラグイン
 *
 * @param {Object} store
 */
const VuePopup = (context) => {

    /** @type {Object} Popup Component Class */
    const Popup = Vue.extend(VPopup);
    /** @type {Object} Popup Component Singleton Instance */
    const vm = new Popup();

    return {
        /**
         *　インスタンス作成
         *
         * @return {Object} インスタンス
         */
        create() {
            // New Instance
            return new Popup();
        },

        /**
         *　表示
         *
         * @param {string} type アイコン (info, success. warning, error)
         * @param {string} title タイトル
         * @param {string} message メッセージ
         */
        show(type, title, message) {
            vm.show(type, title, message);
        },

        /**
         *　非表示
         *
         */
        hide() {
            vm.hide();
        },

        /**
         *　ボタン設定
         *
         * @param {Array<Object>} btn ボタン情報配列 { caption: "表示文言", color: "primary", callback: ()=>{} }
         */
        buttons(btns) {
            vm.buttons(btns);
        }
    };
}

export default (context, inject) => {
    inject("popup", VuePopup(context));
}
