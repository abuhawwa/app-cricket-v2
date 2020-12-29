<template>
  <table class="table mb-0">
    <thead>
      <tr>
        <th class="w-50" colspan="7">This Over</th>
      </tr>
    </thead>
    <tbody>
      <tr class="text-center">
        <td v-for="(ball, index) in balls" :key="index">
          <template v-if="ball.extra">
            {{ ball.runs + ball.extra }}
          </template>
          <template v-else>
            {{ ball.runs }}
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "Over",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    balls() {
      return this.data;
    },
  },
};
</script>

<style>
</style>