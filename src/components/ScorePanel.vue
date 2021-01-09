<template>
  <table class="table text-center table-score table-bordered">
    <tbody>
      <tr class="bg-light">
        <td>
          <button type="button" class="btn w-100" @click="score(0)">0</button>
        </td>
        <td>
          <button type="button" class="btn w-100" @click="score(1)">1</button>
        </td>
        <td>
          <button type="button" class="btn w-100" @click="score(2)">2</button>
        </td>
        <td class="bg-success" rowspan="2" @click="onUndo">
          <button type="button" class="btn w-100 text-white">Undo</button>
        </td>
      </tr>
      <tr class="bg-light">
        <td>
          <button type="button" class="btn w-100" @click="score(3)">3</button>
        </td>
        <td>
          <button type="button" class="btn w-100" @click="score(4)">4</button>
        </td>
        <td>
          <button type="button" class="btn w-100" @click="score(6)">6</button>
        </td>
      </tr>
      <tr>
        <td class="bg-info">
          <button
            type="button"
            class="btn w-100 text-white"
            data-bs-toggle="modal"
            data-bs-target="#modal"
            @click="currentModal = 'Extra'"
          >
            Extra
          </button>
        </td>
        <td class="bg-danger">
          <button
            type="button"
            class="btn w-100 text-white"
            data-bs-toggle="modal"
            data-bs-target="#modal"
            @click="currentModal = 'Wicket'"
          >
            Out
          </button>
        </td>
        <td class="bg-primary">
          <button
            type="button"
            class="btn w-100 text-white"
            data-bs-toggle="modal"
            data-bs-target="#modal"
            @click="currentModal = 'Over'"
          >
            Over
          </button>
        </td>
        <td class="bg-secondary">
          <button type="button" class="btn w-100 text-white">Ings End</button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Modal -->
  <div
    class="modal fade"
    id="modal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="modalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">
            {{
              currentModal === "Extra"
                ? "Innings Extra"
                : currentModal === "Wicket"
                ? "Innings Wicket"
                : "Innings Bowler"
            }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <Extra v-if="currentModal === 'Extra'" @extra="onExtra" />
          <Wicket v-if="currentModal === 'Wicket'" @out="onOut" />
          <OverBowler v-if="currentModal === 'Over'" @over="onOver" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { Modal } from "bootstrap";
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
const Extra = defineAsyncComponent(() => import("@/components/Extra.vue"));
const Wicket = defineAsyncComponent(() => import("@/components/Wicket.vue"));
const OverBowler = defineAsyncComponent(() =>
  import("@/components/OverBowler.vue")
);
export default {
  name: "ScorePanel",
  inject: ["ings"],
  data() {
    return {
      currentModal: "",
      modal: null,
    };
  },
  components: {
    Extra,
    Wicket,
    OverBowler,
  },
  computed: {
    ...mapGetters(["getStriker", "getActiveBowler", "getBatters"]),
  },
  methods: {
    onExtra(extra) {
      this.modal.hide();
      document.getElementById("modalForm").reset();
      this.score(extra, "extra");
    },
    onOut(wicket) {
      this.modal.hide();
      document.getElementById("modalForm").reset();
      this.score(wicket, "wicket");
    },
    onOver(overBowler) {
      debugger;
      const ings = this.ings;
      this.$store.commit("ADD_BOWLER", { ings, overBowler });
    },
    onUndo() {
      const ings = this.ings;
      this.$store.commit("UNDO_INGS", ings);
    },
    score(num, type = "score") {
      let striker = this.getStriker;
      let nonStriker = {};
      this.getBatters.filter((item) => {
        if (item.id !== striker.id) nonStriker = item;
      });
      let bowler = this.getActiveBowler;
      const runs = ["extra", "wicket"].includes(type) ? 0 : num;
      const extra = type === "extra" ? num.split("-") : "";
      const bye = ["bye"].includes(extra[0]) ? parseInt(extra[1]) : 0;
      const legBye = ["legBye"].includes(extra[0]) ? parseInt(extra[1]) : 0;
      const wide = ["wide"].includes(extra[0]) ? parseInt(extra[1]) : 0;
      const noBall = ["noBall"].includes(extra[0]) ? parseInt(extra[1]) : 0;
      const noBallRunBatsman = ["noBallRun"].includes(extra[0])
        ? parseInt(extra[1] - 1)
        : 0;
      const noBallRunBowler = ["noBallRun"].includes(extra[0]) ? 1 : 0;
      const isExtra = ["wide", "noBall", "noBallRun"].includes(extra[0]);
      const ings = this.ings;
      const isWicket = type == "wicket" ? true : false;
      const wicket = isWicket ? num : {};
      let obj = {
        batsman: {
          striker: {
            name: striker.name,
            id: striker.id,
            runs: runs || noBallRunBatsman,
            ball: wide ? 0 : 1,
            four: runs === 4 ? 1 : 0,
            six: runs === 6 ? 1 : 0,
            isOut: isWicket
              ? wicket.batter.id === striker.id
                ? true
                : false
              : false,
          },
          nonStriker: {
            name: nonStriker.name,
            id: nonStriker.id,
            isOut: isWicket
              ? wicket.batter.id === nonStriker.id
                ? true
                : false
              : false,
          },
        },
        bowler: {
          name: bowler.name,
          id: bowler.id,
          ball: isExtra ? 0 : 1,
          runs: runs || noBallRunBatsman,
          wicket: isWicket
            ? wicket.dismissalType && wicket.dismissalType !== "run out"
              ? 1
              : 0
            : 0,
          dismissal_type: isWicket ? wicket.dismissalType : "",
          extras: {
            wide: wide,
            noBall: noBall || noBallRunBowler,
          },
          isExtra: isExtra,
        },
        teamExtras: {
          byes: bye,
          legByes: legBye,
        },
      };
      this.$store.commit("ADD_SCORE_TO_INNINGS", { ings, obj });
    },
  },
  mounted() {
    this.modal = new Modal(document.getElementById("modal"));
  },
};
</script>