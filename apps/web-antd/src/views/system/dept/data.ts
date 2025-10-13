import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemDeptApi } from '#/api/system/dept';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'deptCode',
      componentProps: { allowClear: true },
      label: $t('system.dept.deptCode'),
    },
    {
      component: 'Input',
      fieldName: 'deptName',
      componentProps: { allowClear: true },
      label: $t('system.dept.deptName'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<SystemDeptApi.SystemDept>,
): VxeTableGridOptions<SystemDeptApi.SystemDept>['columns'] {
  return [
    {
      align: 'left',
      field: 'deptName',
      fixed: 'left',
      slots: { default: 'deptName' },
      title: $t('system.dept.deptName'),
      treeNode: true,
      minWidth: 305,
    },
    {
      field: 'deptCode',
      align: 'center',
      title: $t('system.dept.deptCode'),
      minWidth: 200,
    },
    {
      align: 'center',
      field: 'remark',
      title: $t('system.dept.remark'),
      minWidth: 305,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'success', label: $t('common.enabled'), value: 1 },
          { color: 'error', label: $t('common.disabled'), value: 2 },
        ],
      },
      field: 'status',
      title: $t('system.dept.status'),
      minWidth: 200,
    },
    {
      align: 'right',
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'append',
            text: '新增下级',
          },
          'edit', // 默认的编辑按钮
          {
            code: 'delete', // 默认的删除按钮
            disabled: (row: SystemDeptApi.SystemDept) => {
              return !!(row.children && row.children.length > 0);
            },
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: $t('system.dept.operation'),
      width: 200,
    },
  ];
}
