import Sortable from 'sortablejs'
import {
    FormDesign,
    FormDesignCol,
    FormDesignRow
} from "@/components/carota-form/carota-form-designer/FormDesign";


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

    static beforeRowId: string = ''
    categoryDesign: FormDesign

    constructor(categoryDesign: FormDesign) {
        this.categoryDesign = categoryDesign
    }

    /**
     * 组件栏
     * @param ele
     * @param categoryDesign
     */
    public createContainer1(ele: HTMLElement) {
        const that = this
        new Sortable(ele, {
            group: {
                name: 'drag-form',
                pull: 'clone',
                put: false // Do not allow items to be put into this list
            },
            animation: 150,
            emptyInsertThreshold: 0,
            fallbackOnBody: true,
            swapThreshold: 1,
            filter: '.' + SortableClass.ENUM.CANT_SORTABLE.clazz,
            sort: false, // To disable sorting: set sort to false,
            onEnd: function (event: Sortable.SortableEvent) {
                const toHtml = event.to
                const itemHtml = event.item

                const isToRow = that.isSortable2(toHtml)
                const isToDesigner = that.isSortable3(toHtml)

                that.replaceBeforeColWidth(toHtml.id)

                if (!isToRow && !isToDesigner) { // 如果按钮被拖回到原来的位置(撤销拖拽),则不作任何操作
                    return
                }
                const toColIndex = event.newIndex as number
                const toId = toHtml.id
                const formDesignCol = FormDesignCol.build(itemHtml.getAttribute('category'))
                if (isToRow) { // 如果放在了row里,则对row内元素进行排序
                    for (let i = 0; i < that.categoryDesign.rowArr.length; i++) {
                        const row = that.categoryDesign.rowArr[i]
                        if (toId === row.id) {    // 如果设计栏-行的id和当前to.id相等,说明是同一个元素

                            row.colArr.splice(toColIndex, 0, formDesignCol)  // 在指定位置插入当前组件
                            that.resetFormDesignCol(row.colArr)
                        }
                    }
                } else {
                    // 如果外层不在row内,包一层row
                    const toRowVO = that.createRowAndSortable(toHtml, toColIndex)
                    toRowVO.colArr.push(formDesignCol)
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
    public createContainer2(ele: HTMLElement) {
        const that = this
        new Sortable(ele, {
            group: {
                name: 'drag-form',
                put: true,
            },
            animation: 150,
            emptyInsertThreshold: 0,
            dragoverBubble: true,
            fallbackOnBody: true,
            swapThreshold: 1,
            filter: '.' + SortableClass.ENUM.CANT_SORTABLE.clazz,
            /**
             * @param event
             */
            onEnd: function (/**Event*/event) {
                console.log('sortable2 onEnd----------')
                const toHtml = event.to
                const itemHtml = event.item
                const fromHtml = event.from
                const fromColVOInx = event.oldIndex as number   // 原始容器排序
                let toColVOInx = event.newIndex as number     // 新容器排序
                const onContent = toHtml.id === fromHtml.id
                // ++++++++++++++++++++++++++++++++++++特殊情况判断开始++++++++++++++++++++++++++++++++++++
                if (onContent && toHtml.children.length == 1) {  // 拖拽前后是同容器,并且容器中只有一个子节点,则不操作
                    return;
                }
                // ++++++++++++++++++++++++++++++++++++特殊情况判断结束++++++++++++++++++++++++++++++++++++

                let fromRowVO
                let toRowVO
                const toIsRow = that.isSortable2(toHtml)
                // 对from中的col进行操作
                for (let k = that.categoryDesign.rowArr.length - 1; k >= 0; k--) {
                    const rowVO = that.categoryDesign.rowArr[k]
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
                if (!fromRowVO) {
                    return
                }

                const fromColVO = fromRowVO.colArr[fromColVOInx]
                that.removeColFromRow(fromRowVO, fromColVOInx) // 在from中移除当前col

                if (!onContent) { // 如果拖拽前后不是同一个容器内
                    toHtml.removeChild(itemHtml)    // from移除item
                }

                if (!toRowVO) {
                    // 新建row
                    toRowVO = that.createRowAndSortable(toHtml, toColVOInx)
                    toColVOInx = 0
                }

                toRowVO.colArr.splice(toColVOInx, 0, fromColVO)  // 在toTow中添加当前col

                that.resetFormDesignCol(toRowVO.colArr)   // 重新排序
            },

            onChange: function (event) {
                console.log('sortable2 onchange----')
                const itemHtml = event.item
                const fromHtml = event.from
                const toHtml = event.to

                that.replaceBeforeColWidth(toHtml.id)

                if (that.isSortable2(toHtml)) {
                    that.replaceColWidth(toHtml.children)    // 替换目标row中col宽度
                }
                if (!that.isSortable1(fromHtml)) {
                    that.replaceColWidth(fromHtml.children)  // 替换源row中col宽度
                }
            },

        });
    }

    /**
     * 设计栏,布局栏
     * @param ele
     */
    public createContainer3(ele: HTMLElement) {
        const that = this
        new Sortable(ele, {
            group: {
                name: 'drag-form',
                put: true,
            },
            fallbackOnBody: true,
            swapThreshold: 0.65,
            filter: '.' + SortableClass.ENUM.CANT_SORTABLE.clazz,
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
                that.replaceBeforeColWidth(toHtml.id)
            },


        });
    }


    /**
     * 移出某个字符串开头的类
     * @param classList
     * @param startWith
     * @private
     */
    private removeStartWithClass(classList: DOMTokenList, classStart: string) {
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
    private replaceBeforeColWidth(rowId: string) {
        if (SortableJS.beforeRowId) {
            const beforeRowElement = document.getElementById(SortableJS.beforeRowId)
            if (beforeRowElement) {
                this.replaceColWidth(beforeRowElement.children)  // 替换源row中col宽度
            }
        }
        SortableJS.beforeRowId = rowId
    }

    /**
     * 替换col的宽度
     * @param childrens 子节点
     */
    private replaceColWidth(childrens: HTMLCollection) {
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
            this.removeStartWithClass(colHtml.classList, classStart)
            colHtml.classList.add(classStart + colWidth.getWidth(i))// 添加指定宽度
        }
    }

    /**
     * 重置designCol部分数据
     * @param columns {@link FormDesignColumn}数组
     */
    private resetFormDesignCol(columns: FormDesignCol[]) {
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
    private resetFormDesignRow(columns: FormDesignRow[]) {
        for (let i = 0; i < columns.length; i++) {
            columns[i].sort = i  // 重新排序
        }
    }

    private isSortable3(ele: HTMLElement): boolean {
        return ele.classList.contains(SortableClass.ENUM.SORTABLE3.clazz)
    }

    private isSortable2(ele: HTMLElement): boolean {
        return ele.classList.contains(SortableClass.ENUM.SORTABLE2.clazz)
    }

    private isSortable1(ele: HTMLElement): boolean {
        return ele.classList.contains(SortableClass.ENUM.SORTABLE1.clazz)
    }

    private createRowAndSortable(toHtml: HTMLElement, toIndex: number): FormDesignRow {
        const toRowVO = new FormDesignRow()
        // 对row排序
        // toHtml.removeChild(toHtml.children[toIndex])
        this.categoryDesign.rowArr.splice(toIndex, 0, toRowVO)
        this.resetFormDesignRow(this.categoryDesign.rowArr)
        setTimeout(() => {  // 创建拖拽容器
            this.createContainer2(document.getElementById(toRowVO.id) as HTMLElement)
        }, 500);
        return toRowVO;
    }

    /**
     * 在row中移出col,如果col移除后row变空,则把row移出
     * @param fromRowVO {@link FormDesignRow}
     * @param colInx 需要移出的cow索引
     * @private
     */
    private removeColFromRow(fromRowVO: FormDesignRow, colInx: number) {
        fromRowVO.colArr.splice(colInx, 1) // 在from中移除当前col

        if (fromRowVO.colArr.length == 0) {
            this.categoryDesign.rowArr.splice(this.categoryDesign.rowArr.lastIndexOf(fromRowVO), 1)
        }else {
            this.resetFormDesignCol(fromRowVO.colArr)
        }

    }

    /**
     * 在row中移出col,如果col移除后row变空,则把row移出,如果row不为空,则对row排序
     * @param fromRowVO {@link FormDesignRow}
     * @param colInx 需要移出的cow索引
     * @private
     */
    public removeColFromRowAndSort(fromRowVO: FormDesignRow, colInx: number) {
        this.removeColFromRow(fromRowVO,colInx)
        if (fromRowVO.colArr.length != 0) {
            this.resetFormDesignCol(fromRowVO.colArr)
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
