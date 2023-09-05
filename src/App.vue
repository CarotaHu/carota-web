<template>
  <CarotaFormDesigner></CarotaFormDesigner>
</template>

<script lang="ts">

import CarotaFormDesigner from "@/components/carota-form/carota-form-designer/carota-form-designer.vue";
export default {
  name: 'App',
  components: {
    CarotaFormDesigner
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
