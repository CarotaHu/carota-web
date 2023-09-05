<template>
  <el-button text @click="dialogTableVisible = true">
    表单设计
  </el-button>

  <el-dialog v-model="dialogTableVisible" title="Shipping address">
    弹框
  </el-dialog>

</template>

<script setup lang="ts">

import { ref } from 'vue';

const dialogTableVisible = ref(false)

</script>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'CarotaFormDesigner', // 组件名称
  props: {
    // 这里可以定义组件的props（如果有的话）
  },
  setup() {
    // 这里可以定义组件的数据和方法
    return {};
  },
});
</script>

<style scoped>

</style>