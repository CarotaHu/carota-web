<template>
  <div>
    <el-button type="primary" text @click="dialogTableVisible = true">
      表单设计
    </el-button>

    <span style="text-align: left">
    <el-dialog class="design-dialog" destroy-on-close draggable fullscreen v-model="dialogTableVisible"
               title=表单设计>
    <CarotaFormDesigner></CarotaFormDesigner>
  </el-dialog>
  </span>
  </div>

</template>

<script lang="ts" setup>
import {ref} from "vue";

const dialogTableVisible = ref(false)


</script>

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

.el-dialog.is-fullscreen{
  //overflow: hidden  !important;
}
.el-dialog__body{
  padding: 0 !important;
  height: calc(100% - 54px) !important;
}
</style>
