import * as firebase from "@/firebase";
import router from "@/router";

export default {
  state: {
    innings: [],
  },
  mutations: {
    INNINGS(state, innings) {
      state.innings = innings;
      router.push({ name: "Play" });
    },
  },
  actions: {
    async addMatch({ dispatch }, match) {
      debugger;
      await firebase.matchesCollection
        .add(match)
        .then(() => {
          debugger;
          dispatch("fetchMatch", match);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchMatch({ commit }, innings) {
      await firebase.matchesCollection
        .where("id", "==", innings.id)
        .get()
        .then((res) => {
          res.forEach((item) => {
            commit("INNINGS", item.data());
          });
        });
    },
    async addIngsPlayers({ dispatch }, innings) {
      debugger;
      const ings = await firebase.matchesCollection
        .where("id", "==", innings.id)
        .get();
      ings.forEach((doc) => {
        debugger;
        firebase.matchesCollection.doc(doc.id).update(innings);
      });
      dispatch("fetchMatch", innings);
    },
  },
  getters: {
    innings: (state) => state.innings,
  },
};
