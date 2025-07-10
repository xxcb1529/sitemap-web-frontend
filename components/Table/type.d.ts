import type { TableColumnCtx } from "element-plus";
import type { VNode } from "vue";

export type DataRecord = Record<string, unknown>;

export interface ActionButton {
  label: string;
  handler: (row: DataRecord) => void;
  props?: Record<string, unknown>;
}

export interface TableColumn extends Partial<TableColumnCtx<DataRecord>> {
  prop?: string;
  formatter?: (
    row: DataRecord,
    column: TableColumnCtx<DataRecord>,
    cellValue: any,
    index: number
  ) => string | VNode;
  isAction?: boolean;
}
