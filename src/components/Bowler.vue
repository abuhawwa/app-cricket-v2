<template>
  <table class="table">
    <thead>
      <tr>
        <th class="w-50">Bowling</th>
        <th class="text-center">O</th>
        <th class="text-center">M</th>
        <th class="text-center">R</th>
        <th class="text-center">W</th>
        <th class="text-center">Econ</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(bowler, index) in bowlers" :key="index">
        <td>
          <input
            name="bowler"
            type="radio"
            :id="bowler.id"
            :value="bowler"
            v-model="currentBowler"
          />
          <label :for="bowler.id">{{ bowler.name }}</label>
        </td>
        <td class="text-center">{{ bowler.overs || 0 }}</td>
        <td class="text-center">0</td>
        <td class="text-center">{{ bowler.runs || 0 }}</td>
        <td class="text-center">
          {{ bowler.wickets ? bowler.wickets.length : 0 }}
        </td>
        <td class="text-center">{{ $filters.economy(bowler) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "Bowler",
  props: {
    ingsBowlers: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    bowlers() {
      let bowlers = this.ingsBowlers;
      this.$store.commit("BOWLERS", bowlers);
      return bowlers;
    },
    currentBowler: {
      get() {
        return this.$store.getters.getActiveBowler;
      },
      set(newVal) {
        debugger;
        this.$store.commit("ACTIVE_BOWLER", newVal);
      },
    },
  },
  created() {
    const bowlers = this.bowlers;
    let activeBowler = {};
    bowlers.filter((item) => {
      if (item.isCurrent) activeBowler = item;
    });
    this.$store.commit("ACTIVE_BOWLER", activeBowler);
  },
};
</script>

<style>
</style>