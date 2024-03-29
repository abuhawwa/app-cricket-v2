import * as firebase from "@/firebase";
import router from "@/router";

export default {
  state: () => ({
    innings: [],
    overs: 0,
    score: {
      total: 0,
      wickets: 0,
      extras: 0,
      overs: 0,
    },
  }),
  mutations: {
    INNINGS(state, innings) {
      state.innings = innings;
    },
    UNDO_INGS(state, ings) {
      const overs = state.innings[ings].overs;
      const lastOver = overs[overs.length - 1].over;
      lastOver.forEach((item) => {
        const lastItem = item.balls.length - 1;
        item.balls.forEach((ball, index) => {
          if (index === lastItem) {
            item.balls.splice(lastItem, 1);
          }
        });
      });
      this.dispatch("updateScore", ings);
    },
    ADD_SCORE_TO_INNINGS(state, { ings, obj }) {
      if (!state.innings[ings].overs) {
        state.innings[ings].overs = [];
        state.innings[ings].overs.push({ over: [{ balls: [obj] }] });
      } else {
        const lastindex = state.innings[ings].overs.length - 1;
        state.innings[ings].overs.forEach((item, index) => {
          if (lastindex === index) {
            item.over.forEach((over) => {
              over.balls.push(obj);
            });
          }
        });
      }
      this.dispatch("updateScore", ings);
    },
    INDIVIDUAL_BATSMAN_SCORE(state, ings) {
      let batsmans = state.innings[ings].batsmans;
      let overs = state.innings[ings].overs;
      if (!overs) return false;
      batsmans.forEach((batsman) => {
        let runs = 0;
        let balls = 0;
        let fours = 0;
        let sixes = 0;
        overs.forEach((item) => {
          item.over.forEach((over) => {
            if (!over.balls.length) {
              batsman.runs = runs;
              batsman.balls = balls;
              batsman.fours = fours;
              batsman.sixes = sixes;
              batsman.isOut = false;
              return true;
            }
            over.balls.forEach((ball) => {
              if (batsman.id === ball.batsman.striker.id) {
                runs += ball.batsman.striker.runs;
                balls += ball.batsman.striker.ball;
                fours += ball.batsman.striker.four;
                sixes += ball.batsman.striker.six;
                batsman.isOut = ball.batsman.striker.isOut;
                batsman.runs = runs;
                batsman.balls = balls;
                batsman.fours = fours;
                batsman.sixes = sixes;
              }
              if (batsman.id === ball.batsman.nonStriker.id)
                batsman.isOut = ball.batsman.nonStriker.isOut;
            });
          });
        });
      });
    },
    INDIVIDUAL_BOWLER_SCORE(state, ings) {
      let bowlers = state.innings[ings].bowlers;
      let overs = state.innings[ings].overs;
      if (!overs) return false;
      bowlers.forEach((bowler) => {
        let runs = 0;
        let balls = 0;
        let wides = 0;
        let noBalls = 0;
        let wickets = [];
        overs.forEach((item) => {
          item.over.forEach((over) => {
            if (!over.balls.length) {
              bowler.runs = runs;
              bowler.balls = balls;
              bowler.wides = wides;
              bowler.noBalls = noBalls;
              bowler.wickets = wickets;
              bowler.overs = 0;
              return true;
            }
            over.balls.forEach((ball) => {
              if (bowler.id === ball.bowler.id) {
                runs += ball.bowler.runs;
                runs += ball.bowler.extras.wide;
                runs += ball.bowler.extras.noBall;
                balls += ball.bowler.ball;
                wides += ball.bowler.extras.wide;
                noBalls += ball.bowler.extras.noBall;
                if (ball.bowler.wicket)
                  wickets.push({
                    wicket: ball.bowler.wicket,
                    dismissal_type: ball.bowler.dismissal_type,
                  });
                bowler.runs = runs;
                bowler.balls = balls;
                bowler.wides = wides;
                bowler.noBalls = noBalls;
                bowler.wickets = wickets;
                bowler.overs = Number.isInteger(balls / 6)
                  ? balls / 6
                  : parseFloat(parseInt(balls / 6) + "." + (balls % 6));
              }
            });
          });
        });
      });
    },
    TEAM_SCORE(state, ings) {
      let overs = state.innings[ings].overs;
      if (!overs) return false;
      let score = state.score;
      let total = 0;
      let balls = 0;
      let extras = 0;
      let wickets = 0;
      overs.forEach((item) => {
        item.over.forEach((over) => {
          over.balls.forEach((ball) => {
            total += ball.bowler.runs;
            total += ball.bowler.extras.wide;
            total += ball.bowler.extras.noBall;
            total += ball.teamExtras.byes;
            total += ball.teamExtras.legByes;
            balls += ball.bowler.ball;
            extras += ball.bowler.extras.wide;
            extras += ball.bowler.extras.noBall;
            extras += ball.teamExtras.byes;
            extras += ball.teamExtras.legByes;
            if (ball.bowler.dismissal_type) wickets += 1;
            score.total = total;
            score.extras = extras;
            score.wickets = wickets;
            score.overs = Number.isInteger(balls / 6)
              ? balls / 6
              : parseFloat(parseInt(balls / 6) + "." + (balls % 6));
          });
        });
      });
    },
    ADD_BOWLER(state, { ings, overBowler }) {
      debugger;
      let bowlers = state.innings[ings].bowlers;
      bowlers.filter((item) => {
        item.isCurrent = false;
      });
      let bowler = {};
      if (overBowler.bowler) {
        bowler = {
          name: overBowler.bowler,
          id: bowlers.length + 1,
          isCurrent: true,
        };
        bowlers.push(bowler);
      } else {
        bowler = {
          name: overBowler.existingBowler,
        };
      }
      this.dispatch("updateScore", ings);
    },
  },
  actions: {
    async addMatch({ dispatch }, match) {
      await firebase.matchesCollection
        .add(match)
        .then(() => {
          dispatch("fetchMatch", match);
          router.push({ name: "Play", params: { matchId: match.id } });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async fetchMatch({ commit }, match) {
      await firebase.matchesCollection
        .where("id", "==", parseInt(match.id))
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((item) => {
            commit("INNINGS", item.data());
          });
        });
    },
    async addIngsPlayers({ dispatch }, match) {
      await firebase.matchesCollection
        .where("id", "==", parseInt(match.id))
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            firebase.matchesCollection.doc(doc.id).update(match);
          });
        });
      dispatch("fetchMatch", match);
      router.push({ name: "Scorecard", params: { match: match.id } });
    },
    async updateScore({ state, commit }, ings) {
      commit("INDIVIDUAL_BATSMAN_SCORE", ings);
      commit("INDIVIDUAL_BOWLER_SCORE", ings);
      commit("TEAM_SCORE", ings);
      const innings = state.innings;
      await firebase.matchesCollection
        .where("id", "==", parseInt(innings.id))
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            firebase.matchesCollection.doc(doc.id).update(innings);
          });
        });
    },
  },
  getters: {
    innings: (state) => state.innings,
    overLimit: (state) => state.innings.overs,
    score: (state) => state.score,
  },
};
