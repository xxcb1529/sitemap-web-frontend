import type { TableColumn } from "./type";

/**
 * 辅助泛型推导 TableColumn 的 prop 字段是否合法
 * 使用方式：createTableColumns<MyDataType>()([...])
 */
export function createTableColumns<T extends object>() {
  return (columns: TableColumn[]) => columns;
}
