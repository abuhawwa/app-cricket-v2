import * as firebase from "@/firebase";

export default {
  state: () => ({
    batters: [],
    activeBatsman: {},
  }),
  mutations: {
    BATTERS(state, items) {
      state.batters = items;
    },
    ACTIVE_BATSMAN(state, item) {
      state.activeBatsman = item;
    },
  },
  actions: {},
  getters: {},
};
