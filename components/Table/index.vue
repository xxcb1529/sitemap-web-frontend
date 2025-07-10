<template>
  <el-table
    :data="tableData"
    stripe
    class="w-full custom-table"
    :empty-text="emptyText"
    v-bind="$attrs"
  >
    <!-- 数据列 -->
    <el-table-column v-for="col in dataColumns" :key="col.prop" v-bind="col">
      <template v-if="col.formatter" #default="{ row, column, $index }">
        <span>
          {{ getFormattedValue(col, row, column, $index) }}
        </span>
      </template>
      <template v-else #default="{ row }">
        {{ col.prop ? row[col.prop] : "" }}
      </template>
    </el-table-column>

    <!-- 操作列 -->
    <el-table-column
      v-if="actionColumn"
      :key="actionColumn.prop || 'action'"
      v-bind="actionColumn"
    >
      <template #default="{ row, $index }">
        <slot name="actions" :row="row" :index="$index">
          <el-button
            v-for="(btn, i) in actionButtons"
            :key="i"
            size="small"
            v-bind="btn.props"
            @click="btn.handler(row)"
          >
            {{ btn.label }}
          </el-button>
        </slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import type { TableColumn, DataRecord, ActionButton } from "./type";

const props = withDefaults(
  defineProps<{
    data: DataRecord[];
    columns: TableColumn[];
    emptyText?: string;
    actionButtons?: ActionButton[];
  }>(),
  {
    emptyText: "暂无数据",
  }
);
const slots = useSlots();

// 计算属性
const actionColumn = computed(
  () =>
    props.columns.find((col) => col.isAction) ||
    (slots.actions ? { prop: "actions", label: "操作", width: 150 } : null)
);

const dataColumns = computed(() =>
  props.columns.filter((col) => !col.isAction)
);

const tableData = computed(() =>
  props.data.map((item, index) => ({
    ...item,
    _index: index + 1, // 添加行号
  }))
);

const getFormattedValue = (
  col: TableColumn,
  row: DataRecord,
  column: any,
  index: number
) => {
  return col.formatter?.(
    row,
    column,
    col.prop ? row[col.prop] : undefined,
    index
  );
};
</script>

<style lang="scss">
.custom-table {
  --el-table-header-bg-color: #f8fafc;
  --el-table-border-color: #e2e8f0;

  th.el-table__cell {
    font-weight: 600;
    color: #1e293b;
  }

  .el-button + .el-button {
    margin-left: 8px;
  }

  .el-table__empty-block {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
