<template>
  <div class="match">
    <div class="card">
      <h5 class="card-header clearfix">
        New Match
        <a href="#" class="btn btn-outline-info btn-sm float-end">Back</a>
      </h5>
      <div class="card-body">
        <form autocomplete="off" @submit.prevent="onMatch">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="battingTeam"
              placeholder="Batting Team Name"
              v-model.trim="battingTeam"
              required
            />
            <label for="battingTeam">Batting Team Name</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="bowlingTeam"
              placeholder="Bowling Team Name"
              v-model.trim="bowlingTeam"
              required
            />
            <label for="bowlingTeam">Bowling Team Name</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="number"
              class="form-control"
              id="overs"
              placeholder="Overs"
              v-model.number="overs"
              required
              min="1"
            />
            <label for="overs">Overs</label>
          </div>
          <button type="submit" class="btn btn-success d-block ms-auto">
            Start Match
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Match",
  data() {
    return {
      battingTeam: "",
      bowlingTeam: "",
      overs: null,
    };
  },
  methods: {
    onMatch() {
      let innings = {
        id: Date.now(),
        overs: null,
        firstIngs: {
          team: "",
          isEnd: 0,
          isWon: false,
        },
        secondIngs: {
          team: "",
          isEnd: 0,
          isWon: false,
        },
      };
      innings.overs = this.overs;
      innings.firstIngs.team = this.battingTeam;
      innings.secondIngs.team = this.bowlingTeam;
      this.$store.dispatch("addMatch", innings);
    },
  },
};
</script>

<style>
</style>