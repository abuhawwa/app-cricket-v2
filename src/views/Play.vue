<template>
  <div class="card">
    <h5 class="card-header">Add Players</h5>
    <div class="card-body">
      <form autocomplete="off" @submit.prevent="onPlay">
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="striker"
            placeholder="Striker Name"
            v-model="striker"
          />
          <label for="batsmenOne">Striker Name</label>
        </div>
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="nonStriker"
            placeholder="Non Striker Name"
            v-model="nonStriker"
          />
          <label for="nonStriker">Non Striker Name</label>
        </div>
        <div class="form-floating mb-3">
          <input
            type="text"
            class="form-control"
            id="bowler"
            placeholder="Bowler Name"
            v-model="bowler"
          />
          <label for="bowler">Bowler Name</label>
        </div>
        <button type="submit" class="btn btn-success d-block ml-auto">
          Let's Play
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Play",
  data() {
    return {
      innings: {},
      striker: "",
      nonStriker: "",
      bowler: "",
    };
  },
  methods: {
    onPlay() {
      debugger;
      let innings = this.innings;
      const batsmans = [{ name: this.striker }, { name: this.nonStriker }];
      const bowlers = [{ name: this.bowler }];
      var ings = !innings.firstIngs.isEnd ? "firstIngs" : "secondIngs";
      innings[ings].batsmans = batsmans;
      innings[ings].bowlers = bowlers;
      innings[ings].batsmans.map((item, index) => {
        item.id = index + 1;
      });
      innings[ings].bowlers.map((item, index) => {
        item.id = index + 1;
      });
      debugger;
      this.$store.dispatch("addIngsPlayers", innings);
    },
  },
  mounted() {
    this.innings = this.$store.getters.innings;
  },
};
</script>

<style>
</style>