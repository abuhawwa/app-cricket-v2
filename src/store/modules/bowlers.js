export default {
  state: () => ({
    activeBowler: {},
  }),
  mutations: {
    ACTIVE_BOWLER(state, item) {
      state.activeBowler = item;
    },
  },
  actions: {},
  getters: {
    getBowler: (state) => state.activeBowler,
  },
};
