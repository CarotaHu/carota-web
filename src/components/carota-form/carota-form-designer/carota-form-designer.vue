<template>
  <el-row class="design-contains">
    <!--  左侧组件按钮开始  -->
    <el-col class="border-col" style="padding-left: 5px;padding-right:5px" :span="4">
      <el-collapse id="button-collapse" v-model="buttonCollapseActivity">
        <el-collapse-item v-for="categoryLevel in CategoryLevel.ENUM" :key="categoryLevel.key"
                          :title="categoryLevel.name" :name="categoryLevel.key">
          <el-row :class="SortableClass.ENUM.SORTABLE1.clazz">
            <template v-for="categoryKey in Object.keys(Category.ENUM)" :key="categoryKey">
              <el-col v-if="Category.ENUM[categoryKey].level.key === categoryLevel.key" :category="categoryKey"
                      :span="12" :id="'button'+Category.ENUM[categoryKey].key">
                <el-button class="component-button" size="large" :icon="Category.ENUM[categoryKey].icon">
                  {{ Category.ENUM[categoryKey].name }}
                </el-button>
              </el-col>
            </template>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-col>
    <!--  左侧组件按钮结束  -->

    <!--  中间设计栏开始  -->
    <el-col class="border-col" :span="16">
      <el-row>头</el-row>
      <el-row class="row-block" style="height: 100%">
        <el-form @click.stop="formDesignInfo.onTableClick()"
                 :label-position="formDesign.tableVO.labelPosition"
                 :label-width = "formDesign.tableVO.labelWidth"
                 :class="[SortableClass.ENUM.SORTABLE3.clazz, SortableClass.ENUM.CANT_SORTABLE.clazz]">
          <el-row v-for="innerRow in formDesign.rowArr" :key="innerRow.id" :id="innerRow.id"
                  :class="[SortableClass.ENUM.SORTABLE2.clazz]">
            <el-col v-for="innerCol in innerRow.colArr" :key="innerCol.id" :span="innerCol.span" :id="innerCol.id"
                    @click.stop="formDesignInfo.onRowColClick(innerRow, innerCol)"
                    :class="['float-col',formDesignInfo.currentColId.value === innerCol.id?'float-col-click':'']">
              <el-form-item :label="innerCol.formCategory.name" :required="innerCol.formCategory.required">
                <!-- 输入框 -->
                <el-input v-if="innerCol.formCategory.key === Category.ENUM.INPUT.key"/>
                <!-- 输入框 -->

                <!-- 文本框 -->
                <el-input type="textarea" v-if="innerCol.formCategory.key === Category.ENUM.TEXT.key"/>
                <!-- 文本框 -->

                <!-- 多选框 -->
                <el-checkbox-group v-if="innerCol.formCategory.key === Category.ENUM.CHECKBOX.key">
                  <el-checkbox label="Option A"/>
                  <el-checkbox label="Option B"/>
                </el-checkbox-group>
                <!-- 多选框 -->

                <!-- 级联选择 -->
                <template v-if="innerCol.formCategory.key === Category.ENUM.CASCADER.key">
                  <el-cascader :options="(innerCol.formCategory as CascaderCategory).options">
                    <template #default="{ node, data }">
                      <span>{{ data[(innerCol.formCategory as CascaderCategory).labelKey] }}</span>
                      <span v-if="!node.isLeaf"> ({{
                          data[(innerCol.formCategory as CascaderCategory).otherKey]
                        }}) </span>
                    </template>
                  </el-cascader>
                </template>
                <!-- 级联选择 -->

              </el-form-item>


              <!-- 点击后浮动的框 -->
              <template v-if="formDesignInfo.currentColId.value === innerCol.id">
                <div class="float-content1 cant-sortable">
                  <span style="margin: 15px" class="white-txt"> {{ innerCol.formCategory.columnName }} </span>
                </div>
                <div class="float-content2 cant-sortable">
                  <el-row class="mb-4">
                    <el-button link class="white-txt"
                               @click="sortableJS.removeColFromRowAndSort(innerRow,innerCol.sort)">删除
                    </el-button>
                    <el-button link class="white-txt">修改</el-button>
                  </el-row>
                </div>
              </template>
              <!-- 点击后浮动的框 -->

            </el-col>
          </el-row>
        </el-form>
      </el-row>

    </el-col>
    <!--  中间设计栏结束  -->

    <!--  右侧详情页开始  -->
    <el-col class="border-col" :span="4" style="padding: 5px;padding-top:0">
      <!--  表单全局配置开始  -->
      <template v-if="formDesignInfo.tableClicked.value">
        <el-form :model="formDesign.tableVO" label-position="top" scroll-to-error>
          <el-collapse v-model="tableCollapseActivity">
            <el-collapse-item title="基本信息" name="base">
              <el-form-item label="中文名称">
                <el-input v-model="formDesign.tableVO.tableComment" placeholder="请输入表名称" clearable/>
              </el-form-item>
              <el-form-item label="表名称" required>
                <el-input v-model="formDesign.tableVO.tableName" placeholder="请输入表名称" clearable/>
              </el-form-item>
            </el-collapse-item>

            <el-collapse-item title="布局属性" name="layout">
              <el-form-item label="标签对齐">
                <el-radio-group v-model="formDesign.tableVO.labelPosition" >
                  <el-radio label="left" size="large">左</el-radio>
                  <el-radio label="right" size="large">右</el-radio>
                  <el-radio label="top" size="large">上</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-divider />

              <el-form-item label="标签宽度">
                <el-input v-model="formDesign.tableVO.labelWidth" placeholder="100px | auto"/>
              </el-form-item>
            </el-collapse-item>

          </el-collapse>
        </el-form>
      </template>
      <!--  表单全局配置结束  -->

      <!--  表单组件配置开始  -->
      <template v-else>
        <template v-if="formDesignInfo.currentCol.value">
          <template v-if="formDesignInfo.currentCol.value?.formCategory.key === 'input'">
            <el-form :model="formDesign.rowArr[formDesignInfo.currentRowId]" label-position="top" scroll-to-error>
              <el-collapse v-model="tableCollapseActivity">
                <el-collapse-item title="基本信息" name="base">
                  <el-form-item label="中文名称" required>
                    <el-input v-model="formDesign.tableVO.tableComment" placeholder="请输入表名称" clearable/>
                  </el-form-item>
                  <el-form-item label="数据库字段名" required>
                    <el-input v-model="formDesign.tableVO.tableName" placeholder="请输入表名称" clearable/>
                  </el-form-item>
                </el-collapse-item>

              </el-collapse>
            </el-form>
          </template>
        </template>
      </template>
      <!--  表单组件配置结束  -->

    </el-col>
    <!--  右侧详情页结束  -->
  </el-row>
</template>

<!-- ###################################################################### -->

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import {
  CascaderCategory,
  Category,
  CategoryLevel
} from "@/components/carota-form/carota-form-designer/Category";
import {SortableJS, SortableClass} from "@/components/carota-form/carota-form-designer/Sortable";
import {FormDesign} from "@/components/carota-form/carota-form-designer/FormDesign";
import {FormDesignInfo} from "@/components/carota-form/carota-form-designer/FormDesignInfo";
import {MainUtil} from "@/js/MainUtil";

const buttonCollapseActivity = ref(Object.values(CategoryLevel.ENUM).filter(category => category.open).map(category => category.key))
const tableCollapseActivity = ref(Object.values(CategoryLevel.ENUM).map(category => category.key))

const formDesign: FormDesign = reactive(new FormDesign(MainUtil.randomId(8), '新建表单'));
const sortableJS = new SortableJS(formDesign)
const formDesignInfo = new FormDesignInfo(formDesign);
/**
 * 页面加载事件
 */
onMounted(() => {
  // 创建sortable容器
  createSortableJs()
})


function createSortableJs() {
  // 创建sortable容器
  const ele1 = document.querySelectorAll('.' + SortableClass.ENUM.SORTABLE1.clazz)
  const ele2 = document.querySelectorAll('.' + SortableClass.ENUM.SORTABLE2.clazz)
  const ele3 = document.querySelectorAll('.' + SortableClass.ENUM.SORTABLE3.clazz)

  for (const ele of ele1) {
    sortableJS.createContainer1(ele as HTMLElement)
  }
  for (const ele of ele2) {
    sortableJS.createContainer2(ele as HTMLElement)
  }
  for (const ele of ele3) {
    sortableJS.createContainer3(ele as HTMLElement)
  }
}


/**
 * 折叠框
 */
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

.row-block {
  display: block;
}

.sortable-container-3 {
  height: 100%;
}

.sortable-container-2 {
  margin: 5px;
}

.float-col {
  position: relative;
}

.float-col-click {
  border: 2px solid #79bbff !important;
  border-radius: 5px;
}

.white-txt {
  color: white !important;
}

.float-content1 {
  background-color: #79bbff;
  position: absolute;
  left: 0;
  bottom: 0;
  width: auto;
}

.float-content2 {
  background-color: #79bbff;
  position: absolute;
  right: 0;
  bottom: 0;
  width: auto;
}
</style>
