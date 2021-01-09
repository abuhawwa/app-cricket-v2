export default {
  state: () => ({
    bowlers: [],
    activeBowler: {},
  }),
  mutations: {
    BOWLERS(state, items) {
      state.bowlers = items;
    },
    ACTIVE_BOWLER(state, item) {
      state.activeBowler = item;
    },
  },
  actions: {},
  getters: {
    getBowlers: (state) => state.bowlers,
    getActiveBowler: (state) => state.activeBowler,
  },
};
