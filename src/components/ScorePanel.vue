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
        <td class="bg-success" rowspan="3">
          <button type="button" class="btn w-100 text-white" @click="onUndo">
            Undo
          </button>
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
          <button type="button" class="btn w-100 text-white" @click="onOver">
            Over
          </button>
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
            {{ currentModal === "Extra" ? "Innings Extra" : "Innings Wicket" }}
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
export default {
  name: "ScorePanel",
  inject: ["ings"],
  data() {
    return {
      currentModal: "",
      modal: null,
      extra: "",
      wicket: {
        batter: "",
        dismissalType: "",
      },
    };
  },
  components: {
    Extra,
    Wicket,
  },
  computed: {
    ...mapGetters(["getStriker", "getBowler", "getBatters"]),
  },
  methods: {
    onUndo() {
      const ings = this.ings;
      this.$store.commit("UNDO_INNINGS", ings);
    },
    onExtra(extra) {
      this.extra = extra;
      this.modal.hide();
      document.getElementById("modalForm").reset();
      this.score(extra);
      this.extra = "";
    },
    onOut(wicket) {
      this.wicket = wicket;
      this.modal.hide();
      document.getElementById("modalForm").reset();
      this.score(0);
      this.wicket = {
        batter: "",
        dismissalType: "",
      };
    },
    onOver() {
      const ings = this.ings;
      this.$store.commit("ADD_OVER_TO_INNINGS", ings);
    },
    score(num) {
      debugger;
      var nonStriker = {};
      this.getBatters.filter((item) => {
        if (item.id !== this.getStriker.id) nonStriker = item;
      });
      const run = !this.extra ? num : 0;
      const extra = this.extra.split("-");
      const bye = ["bye"].includes(extra[0]) ? parseInt(extra[1]) : 0;
      const legBye = ["legBye"].includes(extra[0]) ? parseInt(extra[1]) : 0;
      const wide = ["wide"].includes(extra[0]) ? parseInt(extra[1]) : 0;
      const noball = ["noBall"].includes(extra[0]) ? parseInt(extra[1]) : 0;
      const noballRunBatsman = ["noBallRun"].includes(extra[0])
        ? parseInt(extra[1] - 1)
        : 0;
      const noballRunBowler = ["noBallRun"].includes(extra[0]) ? 1 : 0;
      const isExtra = ["wide", "noBall", "noBallRun"].includes(extra[0]);
      const ings = this.ings;
      let obj = {
        batsman: {
          striker: {
            name: this.getStriker.name,
            id: this.getStriker.id,
            runs: run || noballRunBatsman,
            ball: wide ? 0 : 1,
            four: run === 4 ? 1 : 0,
            six: run === 6 ? 1 : 0,
            isOut: this.wicket.batter.id === this.getStriker.id ? true : false,
          },
          nonStriker: {
            name: nonStriker.name,
            id: nonStriker.id,
            isOut: this.wicket.batter.id === nonStriker.id ? true : false,
          },
        },
        bowler: {
          name: this.getBowler.name,
          id: this.getBowler.id,
          ball: isExtra ? 0 : 1,
          runs: run || noballRunBatsman,
          wicket:
            this.wicket.dismissalType && this.wicket.dismissalType !== "run out"
              ? 1
              : 0,
          dismissal_type: this.wicket.dismissalType,
          extras: {
            wide: wide,
            noball: noball || noballRunBowler,
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

<style>
</style>