import * as firebase from "@/firebase";
import router from "@/router";

export default {
  state: {
    innings: [],
  },
  mutations: {
    INNINGS(state, innings) {
      state.innings = innings;
    },
  },
  actions: {
    async addMatch({ dispatch }, match) {
      await firebase.matchesCollection
        .add(match)
        .then(() => {
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
      router.push({ name: "Play" });
    },
    async addIngsPlayers({ dispatch }, innings) {
      const ings = await firebase.matchesCollection
        .where("id", "==", innings.id)
        .get();
      ings.forEach((doc) => {
        firebase.matchesCollection.doc(doc.id).update(innings);
      });
      dispatch("fetchMatch", innings);
      router.push({ name: "Scorecard" });
    },
  },
  getters: {
    innings: (state) => state.innings,
  },
};
