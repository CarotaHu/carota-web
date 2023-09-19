import {Category, FormCategory, InputCategory} from "@/components/carota-form/carota-form-designer/Category";
import {MainUtil, StrUtil} from "@/js/MainUtil";
import {reactive} from "vue";

/**
 * 设计器内数据结构对象
 */
export class FormDesign {

    constructor(id: string , tableComment: string) {
        this.tableVO = new TableVO(id ? id : MainUtil.randomId(8), tableComment ? tableComment : '')
    }

    /**
     * 表单数据
     */
    tableVO: TableVO

    /**
     * row数组
     */
    rowArr: FormDesignRow[] = reactive([])
}

class TableVO {
    constructor(mark: string, tableComment: string) {
        this.mark = mark
        this.tableComment = tableComment
    }

    /**
     *
     */
    mark: string
    tableName: string = ''
    tableComment: string
    labelPosition: 'left'|'right'|'top' = 'left'
    labelWidth: string|number = '100px'
    size : '' | 'large' | 'default' | 'small' = ''
}

/**
 * 设计器内row
 */
export class FormDesignRow {

    /**
     * id,方便删除对应row数据
     */
    id: string = MainUtil.randomId(8)

    /**
     * 排序,越大越靠后
     */
    sort: number = 0
    /**
     * col数组
     */
    colArr: FormDesignCol[] = reactive([])
}

/**
 * 设计器内col
 */
export class FormDesignCol {
    /**
     * 私有构造函数,双肩对象使用{@link build}方法
     * @param formCategory {@link FormCategory}
     * @private
     */
    private constructor(formCategory: FormCategory) {
        this.formCategory = formCategory
    }

    /**
     * id,方便删除对应row数据
     */
    id: string = MainUtil.randomId(8)

    /**
     * 排序,越大越靠后
     */
    sort: number = 0

    /**
     * col宽度 默认 12
     */
    span: number = 24

    /**
     * 组件数组
     */
    formCategory: FormCategory

    public static build(category: string | null): FormDesignCol {
        if (!category) {
            throw new Error('category is null')
        }
        const formCategory: FormCategory = FormCategory.buildChild(category)
        return new FormDesignCol(formCategory)
    }
}