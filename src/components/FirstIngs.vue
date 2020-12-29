<template>
  <div class="p-2">
    <Team :innings="firstIngs" />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

const Team = defineAsyncComponent(() => import("@/components/Team.vue"));

export default {
  name: "FirstIngs",
  components: {
    Team,
  },
  provide: {
    ings: "firstIngs",
  },
  computed: {
    firstIngs() {
      return this.$store.getters.innings.firstIngs;
    },
  },
};
</script>

<style>
</style>