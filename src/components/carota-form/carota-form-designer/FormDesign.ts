import {Category, FormCategory} from "@/components/carota-form/carota-form-designer/Category";
import {MainUtil} from "@/js/MainUtil";
import {reactive} from "vue";

/**
 * 设计器内数据结构对象
 */
export class FormDesign {
    id : String = MainUtil.randomId(8)
    /**
     * row数组
     */
    rowArr: FormDesignRow[] = reactive([])
}

/**
 * 设计器内row
 */
export class FormDesignRow {

    /**
     * id,方便删除对应row数据
     */
    id : string = MainUtil.randomId(8)

    /**
     * 排序,越大越靠后
     */
    sort : number = 0
    /**
     * col数组
     */
    colArr: FormDesignCol[] = reactive([])
}

/**
 * 设计器内col
 */
export class FormDesignCol {
    constructor(formCategory:FormCategory) {
        this.formCategory = formCategory
    }

    /**
     * id,方便删除对应row数据
     */
    id : string = MainUtil.randomId(8)

    /**
     * 排序,越大越靠后
     */
    sort : number = 0

    /**
     * col宽度 默认 12
     */
    span: number = 24

    /**
     * 组件数组
     */
    formCategory : FormCategory
}