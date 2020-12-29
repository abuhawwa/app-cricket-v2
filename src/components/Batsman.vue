<template>
  <table class="table">
    <thead>
      <tr>
        <th class="w-50">Batting</th>
        <th class="text-center">R</th>
        <th class="text-center">B</th>
        <th class="text-center">4s</th>
        <th class="text-center">6s</th>
        <th class="text-center">S/R</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(batsman, index) in batsmans" :key="index">
        <td>
          <input
            name="batsman"
            type="radio"
            :id="batsman.id"
            :value="batsman"
            v-model="currentBatsman"
          />
          <label :for="batsman.id">{{ batsman.name }}</label>
        </td>
        <td class="text-center">{{ batsman.runs || 0 }}</td>
        <td class="text-center">{{ batsman.balls || 0 }}</td>
        <td class="text-center">{{ batsman.fours || 0 }}</td>
        <td class="text-center">{{ batsman.sixes || 0 }}</td>
        <td class="text-center">{{ $filters.strikeRate(batsman) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "Batsman",
  props: {
    ingsBatsmans: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    batsmans() {
      let batters = this.ingsBatsmans.filter((item) => {
        return !item.isOut;
      });
      this.$store.commit("BATTERS", batters);
      return batters;
    },
    currentBatsman: {
      get() {
        return this.$store.getters.getStriker;
      },
      set(newVal) {
        this.$store.commit("ACTIVE_BATSMAN", newVal);
      },
    },
  },
  created() {
    this.$store.commit("ACTIVE_BATSMAN", this.batsmans[0]);
  },
};
</script>

<style>
</style>