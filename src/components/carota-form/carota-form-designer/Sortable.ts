import Sortable from 'sortablejs'
import {
    FormDesign,
    FormDesignCol,
    FormDesignRow
} from "@/components/carota-form/carota-form-designer/FormDesign";
import {FormCategory, InputCategory} from "@/components/carota-form/carota-form-designer/Category";
import carotaFormDesigner from "@/components/carota-form/carota-form-designer/carota-form-designer.vue";
import {throwError} from "element-plus/es/utils";


/**
 * 表单设计类型及说明
 */
export class SortableClass {
    clazz: string = ''
    note: string = ''

    public static build(clazz: string, note: string) {
        const sortableClass = new SortableClass()
        sortableClass.clazz = clazz
        sortableClass.note = note
        return sortableClass
    }

    static ENUM = {
        SORTABLE1: SortableClass.build('sortable-container-1', '组件栏:可拖拽,不可放入,复制'),
        SORTABLE2: SortableClass.build('sortable-container-2', '设计栏-行:可拖拽,不可放入,移动'),
        SORTABLE3: SortableClass.build('sortable-container-3', '设计栏,布局栏:可拖拽,可放入,移动'),
        CANT_SORTABLE: SortableClass.build('cant-sortable', '不能拖拽的组件'),
    }


}

export class SortableJS {

    static beforeRowId : string = '';

    /**
     * 组件栏
     * @param ele
     * @param categoryDesign
     */
    public static createContainer1(ele: HTMLElement, categoryDesign: FormDesign) {
        new Sortable(ele, {
            group: {
                name: 'drag-form',
                pull: 'clone',
                put: false // Do not allow items to be put into this list
            },
            animation: 150,
            emptyInsertThreshold: 0,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            filter: '.' + SortableClass.ENUM.CANT_SORTABLE.clazz,
            sort: false, // To disable sorting: set sort to false,
            onEnd: function (event: Sortable.SortableEvent) {

                const toHtml = event.to
                const itemHtml = event.item

                const isToRow = SortableJS.isSortable2(toHtml)
                const isToDesigner = SortableJS.isSortable3(toHtml)

                SortableJS.replaceBeforeColWidth(toHtml.id)

                if (!isToRow && !isToDesigner){ // 如果按钮被拖回到原来的位置(撤销拖拽),则不作任何操作
                    return
                }
                const toColIndex = event.newIndex as number
                const toId = toHtml.id
                if (isToRow) { // 如果放在了row里,则对row内元素进行排序
                    for (let i = 0; i < categoryDesign.rowArr.length; i++) {
                        const row = categoryDesign.rowArr[i]
                        if (toId === row.id) {    // 如果设计栏-行的id和当前to.id相等,说明是同一个元素
                            row.colArr.splice(toColIndex, 0, new FormDesignCol(new InputCategory()))  // 在指定位置插入当前组件
                            SortableJS.resetFormDesignCol(row.colArr)
                        }
                    }
                } else {
                    // 如果外层不在row内,包一层row
                    const toRowVO = SortableJS.createRowAndSortable(toHtml, toColIndex, categoryDesign)
                    toRowVO.colArr.push(new FormDesignCol(new InputCategory()))

                }
                toHtml.removeChild(itemHtml)    //移除sortable创建的组件按钮
            },
        });
    }

    /**
     * 设计栏-行
     * @param ele
     * @param categoryDesign
     */
    public static createContainer2(ele: HTMLElement, categoryDesign: FormDesign) {
        new Sortable(ele, {
            group: {
                name: 'drag-form',
                put: true,
            },
            animation: 150,
            emptyInsertThreshold: 0,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            filter: '.' + SortableClass.ENUM.CANT_SORTABLE.clazz,
            /**
             * @param event
             */
            onEnd: function (/**Event*/event) {
                console.log('sortable2 onEnd----------')
                const toHtml = event.to
                const itemHtml = event.item
                const fromHtml = event.from
                let fromRowVO
                let toRowVO
                const toIsRow = SortableJS.isSortable2(toHtml)
                // 对from中的col进行操作
                for (let k = categoryDesign.rowArr.length - 1; k >= 0; k--) {
                    const rowVO = categoryDesign.rowArr[k]
                    if (rowVO.id == fromHtml.id) {   // 获取源row
                        fromRowVO = rowVO
                        if (!toIsRow) {
                            break
                        }
                    }
                    if (toIsRow) {
                        if (rowVO.id == toHtml.id) {   // 获取目标row
                            toRowVO = rowVO
                        }

                        if (toRowVO && fromRowVO) {
                            break
                        }
                    }
                }
                console.log(fromRowVO)
                if (!fromRowVO) {
                    return
                }

                const fromColVOInx = event.oldIndex as number   // 原始容器排序
                let toColVOInx = event.newIndex as number     // 新容器排序
                const fromColVO = fromRowVO.colArr[fromColVOInx]
                SortableJS.removeColFromRow(fromRowVO,fromColVOInx, categoryDesign) // 在from中移除当前col

                SortableJS.resetFormDesignCol(fromRowVO.colArr)
                if (!toRowVO) {
                    console.log('创建row')
                    // 新建row
                    toRowVO = SortableJS.createRowAndSortable(toHtml,toColVOInx, categoryDesign)
                    toColVOInx = 0
                }

                toHtml.removeChild(itemHtml)    // 移出sortablejs添加的元素
                toRowVO.colArr.splice(toColVOInx, 0, fromColVO)  // 在toTow中添加当前col
                SortableJS.resetFormDesignCol(toRowVO.colArr)   // 重新排序
                console.log('结束')
            },

            onChange: function (event) {
                console.log('sortable2 onchange----')
                const itemHtml = event.item
                const fromHtml = event.from
                const toHtml = event.to

                SortableJS.replaceBeforeColWidth(toHtml.id)

                if (SortableJS.isSortable2(toHtml)) {
                    SortableJS.replaceColWidth(toHtml.children)    // 替换目标row中col宽度
                }
                if (!SortableJS.isSortable1(fromHtml)) {
                    SortableJS.replaceColWidth(fromHtml.children)  // 替换源row中col宽度
                }
            },

        });
    }

    /**
     * 设计栏,布局栏
     * @param ele
     */
    public static createContainer3(ele: HTMLElement, categoryDesign: FormDesign) {
        new Sortable(ele, {
            group: {
                name: 'drag-form',
                put: true,
            },
            fallbackOnBody: true,
            swapThreshold: 0.65,
            filter: '.' + SortableClass.ENUM.CANT_SORTABLE.clazz,
            invertSwap: true,
            animation: 150,
            emptyInsertThreshold: 0,
            onChoose: function (event) {

            },
            onSort: function (event) {
                const toHtml = event.to
                const itemHtml = event.item
            },
            onChange: function (event) {
                const toHtml = event.to

                SortableJS.replaceBeforeColWidth(toHtml.id)

            },


        });
    }


    /**
     * 移出某个字符串开头的类
     * @param classList
     * @param startWith
     * @private
     */
    private static removeStartWithClass(classList: DOMTokenList, classStart: string) {
        for (let i = classList.length - 1; i >= 0; i--) {
            if (classList[i].startsWith(classStart)) {
                classList.remove(classList[i])
            }
        }
        return classList;
    }

    /**
     * 上个row中col宽度修改
     * @param rowId 当前row id
     * @private
     */
    private static replaceBeforeColWidth(rowId:string){
        if (SortableJS.beforeRowId){
            const beforeRowElement = document.getElementById(SortableJS.beforeRowId)
            if (beforeRowElement){
                SortableJS.replaceColWidth(beforeRowElement.children)  // 替换源row中col宽度
            }
        }
        SortableJS.beforeRowId = rowId
    }

    /**
     * 替换col的宽度
     * @param childrens 子节点
     */
    private static replaceColWidth(childrens: HTMLCollection) {
        if (!childrens) {
            return
        }
        const classStart = 'el-col-'
        const length = childrens.length;  // 获取col数量
        // 计算每个 col 的宽度
        const colWidth = ColWidth.calculate(length)
        for (let i = 0; i < length; i++) {
            const colHtml = childrens[i]
            // 移除其他span宽度
            SortableJS.removeStartWithClass(colHtml.classList, classStart)
            colHtml.classList.add(classStart + colWidth.getWidth(i))// 添加指定宽度
        }
    }

    /**
     * 重置designCol部分数据
     * @param columns {@link FormDesignColumn}数组
     */
    private static resetFormDesignCol(columns: FormDesignCol[]) {
        const length = columns.length

        const toColWidth = ColWidth.calculate(length)

        for (let i = 0; i < length; i++) {
            const colVO = columns[i]
            colVO.sort = i  // 重新排序
            colVO.span = toColWidth.getWidth(i)
        }
    }

    /**
     * 重置designRow部分数据
     * @param columns {@link FormDesignColumn}数组
     */
    private static resetFormDesignRow(columns: FormDesignRow[]) {
        for (let i = 0; i < columns.length; i++) {
            columns[i].sort = i  // 重新排序
        }
    }

    private static isSortable3(ele: HTMLElement): boolean {
        return ele.classList.contains(SortableClass.ENUM.SORTABLE3.clazz)
    }
    private static isSortable2(ele: HTMLElement): boolean {
        return ele.classList.contains(SortableClass.ENUM.SORTABLE2.clazz)
    }

    private static isSortable1(ele: HTMLElement): boolean {
        return ele.classList.contains(SortableClass.ENUM.SORTABLE1.clazz)
    }

    private static createRowAndSortable(toHtml: HTMLElement, toIndex: number, categoryDesign: FormDesign): FormDesignRow {
        const toRowVO = new FormDesignRow()
        // 对row排序
        // toHtml.removeChild(toHtml.children[toIndex])
        categoryDesign.rowArr.splice(toIndex, 0, toRowVO)
        SortableJS.resetFormDesignRow(categoryDesign.rowArr)
        setTimeout(() => {  // 创建拖拽容器
            SortableJS.createContainer2(document.getElementById(toRowVO.id) as HTMLElement, categoryDesign)
        }, 1000);
        return toRowVO;
    }

    /**
     * 在row中移出col,如果col移除后row变空,则把row移出
     * @param fromRowVO {@link FormDesignRow}
     * @param fromIndex 需要移出的cow索引
     * @param categoryDesign {@link FormDesign}
     * @private
     */
    private static removeColFromRow(fromRowVO: FormDesignRow, fromIndex:number, categoryDesign:FormDesign){
        fromRowVO.colArr.splice(fromIndex, 1) // 在from中移除当前col
        if (fromRowVO.colArr.length == 0){
            categoryDesign.rowArr.splice(categoryDesign.rowArr.lastIndexOf(fromRowVO),1)
        }

    }
}

class ColWidth {
    average: number = 0
    lastWith: number = 0
    num: number = 0

    /**
     * 计算宽度
     * @param num col数量
     */
    public static calculate(num: number) {
        const colWidth = new ColWidth()
        const totalWidth: number = 24
        colWidth.average = Math.floor(totalWidth / num);
        colWidth.lastWith = totalWidth - colWidth.average * (num - 1);
        colWidth.num = num
        return colWidth;
    }

    public getWidth(current: number) {
        if (current + 1 === this.num) {
            return this.lastWith
        }
        return this.average
    }

}
