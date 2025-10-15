import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemRoleApi } from '#/api/system/role';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'roleCode',
      componentProps: { allowClear: true },
      label: $t('system.role.roleCode'),
    },
    {
      component: 'Input',
      fieldName: 'roleName',
      componentProps: { allowClear: true },
      label: $t('system.role.roleName'),
    },
  ];
}

export function useColumns<T = SystemRoleApi.SystemRole>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'roleCode',
      title: $t('system.role.roleCode'),
      width: 305,
      sortable: true,
    },
    {
      field: 'roleName',
      title: $t('system.role.roleName'),
      width: 305,
      sortable: true,
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
        props: { unCheckedValue: 2 },
      },
      field: 'enable',
      title: $t('system.role.status'),
      width: 200,
    },
    {
      field: 'remark',
      minWidth: 200,
      title: $t('system.role.remark'),
    },
    {
      field: 'createTime',
      formatter: 'formatDateTime',
      title: $t('system.role.createTime'),
      width: 250,
      sortable: true,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.role.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.role.operation'),
      width: 200,
    },
  ];
}
