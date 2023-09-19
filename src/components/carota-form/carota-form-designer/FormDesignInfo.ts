import {Ref, ref} from "vue";
import {FormDesign, FormDesignCol, FormDesignRow} from "@/components/carota-form/carota-form-designer/FormDesign";

export class FormDesignInfo {

    constructor(formDesign: FormDesign) {
        this.formDesign = formDesign
    }

    formDesign: FormDesign

    /**
     * 定义被点击的是哪个sortable
     */
    currentColId: Ref<string> = ref('')
    currentRowId: Ref<string> = ref('')
    tableClicked: Ref<boolean> = ref(true)
    currentCol : Ref<FormDesignCol> | Ref<null> = ref(null)
    /**
     * 当col被点击时
     * @param col
     */
    public onRowColClick(row: FormDesignRow, col: FormDesignCol) {
        this.tableClicked.value = false
        this.currentRowId.value = row.id
        this.currentColId.value = col.id
        this.currentCol.value = col
    }

    public onTableClick() {
        this.tableClicked.value = true
        this.currentRowId.value = ''
        this.currentColId.value = ''
    }

}