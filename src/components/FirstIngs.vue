<template>
  <div class="p-2" v-if="Object.keys(innings).length">
    <Team :innings="innings.firstIngs" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
    ...mapGetters(["innings"]),
  },
  created() {
    let payload = {};
    payload.id = this.$route.params.matchId;
    const getIngs = this.$store.getters.innings;
    if (!getIngs.length) this.$store.dispatch("fetchMatch", payload);
  },
};
</script>

<style>
</style>