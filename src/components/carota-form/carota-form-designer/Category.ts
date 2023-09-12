export class CategoryLevel {
    key: string;
    name: string;

    public constructor(key: string, name: string) {
        this.key = key
        this.name = name
    }

    static ENUM = {
        BASE: new CategoryLevel('base', '基础组件'),
        LAYOUT: new CategoryLevel('layout', '布局组件')

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

    static ENUM = {
        INPUT : Category.buildCategory('input', '单行输入', 'EditPen', CategoryLevel.ENUM.BASE),
        TEXT : Category.buildCategory('text', '多行输入', 'Edit', CategoryLevel.ENUM.BASE),
        CHOICE : Category.buildCategory('choice', '单选框', 'CircleCheck', CategoryLevel.ENUM.BASE),
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

    constructor(category: Category) {
        super();
        super.setParam(category)
    }

    public toInput(): InputCategory {
        return this as InputCategory
    }
}

/**
 * 输入框
 */
export class InputCategory extends FormCategory {
    constructor() {
        super(Category.ENUM.INPUT);
    }
}