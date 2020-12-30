<template>
  <ul class="nav nav-tabs nav-justified">
    <li class="nav-item">
      <a
        href="#"
        :class="['nav-link', { active: currentTab === 'FirstIngs' }]"
        @click="currentTab = 'FirstIngs'"
        >1st Ings</a
      >
    </li>
    <li class="nav-item">
      <a
        href="#"
        :class="['nav-link', { active: currentTab === 'SecondIngs' }]"
        @click="currentTab = 'SecondIngs'"
        >2nd Ings</a
      >
    </li>
    <li class="nav-item">
      <a
        href="#"
        :class="['nav-link', { active: currentTab === 'Summary' }]"
        @click="currentTab = 'Summary'"
        >Summary</a
      >
    </li>
  </ul>
  <div class="tab-content">
    <div class="tab-pane fade show active">
      <component :is="currentTabComponent"></component>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

const FirstIngs = defineAsyncComponent(() =>
  import("@/components/FirstIngs.vue")
);
const SecondIngs = defineAsyncComponent(() =>
  import("@/components/SecondIngs.vue")
);
const Summary = defineAsyncComponent(() => import("@/components/Summary.vue"));
export default {
  name: "Score",
  components: {
    FirstIngs,
    SecondIngs,
    Summary,
  },
  data() {
    return {
      currentTab: "FirstIngs",
    };
  },
  computed: {
    currentTabComponent() {
      return this.currentTab;
    },
  },
};
</script>

<style>
</style>