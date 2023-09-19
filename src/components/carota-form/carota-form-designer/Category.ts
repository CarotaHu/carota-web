import {MainUtil} from "@/js/MainUtil";

export class CategoryLevel {
    /**
     * 分组标志
     */
    key: string;
    /**
     * 分组名字
     */
    name: string;
    /**
     * 设计页是否默认展开
     */
    open: boolean;

    public constructor(key: string, name: string,open:boolean) {
        this.key = key
        this.name = name
        this.open = open
    }

    static ENUM = {
        BASE: new CategoryLevel('base', '基础组件',true),
        LAYOUT: new CategoryLevel('layout', '布局组件',false)

    }

}


/**
 * 组件类别,并定义组件的基本数据
 */
export class Category {

    key: String = ''
    name: String = ''
    icon: String = ''
    level: CategoryLevel = CategoryLevel.ENUM.BASE

    static buildCategory(key: string, name: string, icon: string, level: CategoryLevel) {
        const category = new Category();
        category.key = key
        category.name = name
        category.icon = icon
        category.level = level
        return category;
    }

    public setParam(category: Category) {
        this.key = category.key
        this.name = category.name
        this.icon = category.icon
        this.level = category.level
        return this;
    }

    /**
     * 组件分类枚举
     * 注意枚举每增加一个需要增加一个{@Link FormCategory}实现类,名称使用'ENUM的键明(首字母大写,其余字母小写的)+Category',如'InputCategory'
     */
    static ENUM = {
        INPUT: Category.buildCategory('input', '单行输入', 'EditPen', CategoryLevel.ENUM.BASE),
        TEXT: Category.buildCategory('text', '多行输入', 'Edit', CategoryLevel.ENUM.BASE),
        CHECKBOX: Category.buildCategory('checkbox', '单选框', 'CircleCheck', CategoryLevel.ENUM.BASE),
        CASCADER: Category.buildCategory('Cascader ', '级联选择', 'CircleCheck', CategoryLevel.ENUM.BASE),
    }

}

/**
 * 通用字段
 */
export class FormCategory extends Category {
    // label宽度
    labelWidth: string | number = 'auto'
    // required
    required: boolean = false
    // 组件id
    id : string = MainUtil.randomId(6)
    // 字段名
    columnName : string = this.id


    constructor(category: Category) {
        super();
        super.setParam(category)
    }

    public static buildChild(category: string) : FormCategory {
        for (let i = 0; i < formCategoryArr.length; i++) {
            const each = formCategoryArr[i]
            if (each.toString().toLowerCase().includes(category.toLowerCase())){
                return new each()
            }
        }
        throw new Error('未找到组件: '+category)
    }

}

const formCategoryArr: any[] = []

function formCategoryDecorator(clazz: Function) {
    formCategoryArr.push(clazz)
}

/**
 * 输入框
 */
@formCategoryDecorator
export class InputCategory extends FormCategory {
    constructor() {
        super(Category.ENUM.INPUT);
    }


}

/**
 * 文本输入框
 */
@formCategoryDecorator
export class TextCategory extends FormCategory {
    constructor() {
        super(Category.ENUM.TEXT);
    }
}

/**
 * 选择框
 */
@formCategoryDecorator
export class CheckboxCategory extends FormCategory {
    constructor() {
        super(Category.ENUM.CHECKBOX);
    }

    options: Object = {}
    labelKey: string = 'label'
    valueKey: string = 'value'
    childrenKey: string = 'children'
}


/**
 * 级联选择器
 */
@formCategoryDecorator
export class CascaderCategory extends FormCategory {
    constructor() {
        super(Category.ENUM.CASCADER);
    }

    options: Object[] = []  // 选项
    labelKey: string = 'label'  // 显示的内容键
    otherKey: string | null = null  // 显示的其他内容键
    valueKey: string = 'value'
    childrenKey: string = 'children'    // 子数据键
}
