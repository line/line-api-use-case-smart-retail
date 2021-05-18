/**
 * Store
 *
 */
export const state = ()=>({
    started: null,
    locales: ['ja'],
    locale: 'ja',
    sessionId: null,
    lineUser: null,
    smaphregi: null,
    completed: null,
});

export const mutations = {
    clear(state) {
        state.started = null;
        state.locale = 'ja';
        state.sessionId = null;
        state.lineUser = null;
        state.smaphregi = null;
        state.compoleted = null;
    },
    started(state, started) {
        state.started = started;
    },
    locale(state, locale) {
        if (state.locales.includes(locale)) {
            state.locale = locale;
        }
    },
    session(state, sessionId) {
        state.sessionId = sessionId;
    },
    lineUser(state, lineUser) {
        state.lineUser = lineUser;
    },
    smaphregi(state, smaphregi) {
        state.smaphregi = smaphregi;
    },
    completed(state, completed) {
        state.completed = completed;
    }
};
