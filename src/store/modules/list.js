const ADD = 'ADD';
const REMOVE = 'REMOVE';

export default {
  state() {
    return {
      _entries: []
    };
  },

  mutations: {
    [ADD](state, value) {
      state._entries.push(value);
    },
    [REMOVE](state, atIndex) {
      state._entries.splice(atIndex, 1);
    }
  },

  actions: {
    [`LIST.${ADD}`]({commit}, value) {
      commit(ADD, value);
    },
    [`LIST.${REMOVE}`]({commit}, atIndex) {
      commit(REMOVE, atIndex);
    },
  },

  getters: {
    listEntries(state) {
      return state._entries;
    }
  }
};