<template>
  <el-row class="design-contains">
    <!--  左侧组件按钮开始  -->
    <el-col class="border-col" style="padding-left: 5px;padding-right:5px" :span="4">
      <el-collapse id="collapse" v-model="activeName">
        <el-collapse-item v-for="categoryLevel in CategoryLevel.ENUM" :key="categoryLevel.key"
                          :title="categoryLevel.name" :name="categoryLevel.key">
          <el-row :class="SortableClass.ENUM.SORTABLE1.clazz">
            <el-col v-for="categoryKey in Object.keys(Category.ENUM)" :key="categoryKey" :span="12" :id="'button'+Category.ENUM[categoryKey].key">
              <el-button v-if="Category.ENUM[categoryKey].level.key === categoryLevel.key" class="component-button" size="large"
                         :icon="Category.ENUM[categoryKey].icon">
                {{ Category.ENUM[categoryKey].name }}
              </el-button>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-col>
    <!--  左侧组件按钮结束  -->

    <!--  中间设计栏开始  -->
    <el-col class="border-col" :span="16">
      <el-row>头</el-row>
      <el-row class="row-block" style="height: 100%">
        <el-form label-width="120px" :class="[SortableClass.ENUM.SORTABLE3.clazz, SortableClass.ENUM.CANT_SORTABLE.clazz]">
          <el-row v-for="innerRow in formDesign.rowArr" :key="innerRow.id"  :id="innerRow.id" :class="[SortableClass.ENUM.SORTABLE2.clazz]">
            <el-col v-for="innerCol in innerRow.colArr" :key="innerCol.id" :span="innerCol.span" :id="innerCol.id">
              <el-form-item :label="innerCol.formCategory.name" :required="innerCol.formCategory.required">
                <el-input v-if="innerCol.formCategory.key === 'input'"  />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>

    </el-col>
    <!--  中间设计栏结束  -->

    <el-col class="border-col" :span="4">右</el-col>
  </el-row>
</template>

<!-- ###################################################################### -->

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {Category, CategoryLevel, InputCategory} from "@/components/carota-form/carota-form-designer/Category";
import {SortableJS,SortableClass} from "@/components/carota-form/carota-form-designer/Sortable";
import {FormDesign, FormDesignCol, FormDesignRow} from "@/components/carota-form/carota-form-designer/FormDesign";

const formDesign:FormDesign = new FormDesign();
formDesign.rowArr[0] = new FormDesignRow()
formDesign.rowArr[0].colArr[0] = new FormDesignCol(new InputCategory())

new InputCategory()
/**
 * 页面加载事件
 */
onMounted(()=>{
  // 创建sortable容器
  createSortableJs()
})

watch(formDesign,(newValue,OldValue)=>{
  console.log("change")
  createSortableJs()
},{deep:true})
/**
 *
 */

function createSortableJs(){
  // 创建sortable容器
  const ele1 = document.querySelectorAll('.'+SortableClass.ENUM.SORTABLE1.clazz)
  const ele2 = document.querySelectorAll('.'+SortableClass.ENUM.SORTABLE2.clazz)
  const ele3 = document.querySelectorAll('.'+SortableClass.ENUM.SORTABLE3.clazz)
  for (const ele of ele1) {
    SortableJS.createContainer1(ele as HTMLElement,formDesign)
  }
  for (const ele of ele2) {
    SortableJS.createContainer2(ele as HTMLElement,formDesign)
  }
  for (const ele of ele3) {
    SortableJS.createContainer3(ele as HTMLElement,formDesign)
  }
}


/**
 * 折叠框
 */
const activeName = ref('1')
</script>

<!-- ###################################################################### -->

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'CarotaFormDesigner', // 组件名称
  props: {
    formName: {
      type: String,
      default: "表单设计"
    }
  },

  setup() {
    // 这里可以定义组件的数据和方法
    return {};
  },
});

</script>
<!-- ###################################################################### -->
<style scoped>

.design-contains {
  height: 100%;
}

.border-col {
  border: 1px dashed #79bbff;
}

.component-button {
  width: 85%;
  text-align: left;
  margin-top: 5px;
  margin-bottom: 5px;
}

.row-block{
  display: block;
}

.sortable-container-3{
  height: 100%;
}
</style>
