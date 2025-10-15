import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemUserApi } from '#/api/system/user';

import { $t } from '#/locales';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      componentProps: { allowClear: true },
      label: $t('system.user.username'),
    },
  ];
}

export function useColumns<T = SystemUserApi.SystemUser>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    { title: '序号', type: 'seq', width: 50 },
    {
      cellRender: { name: 'CellImage' },
      field: 'avatar',
      title: $t('system.user.avatar'),
      width: 150,
    },
    {
      field: 'username',
      title: $t('system.user.username'),
      width: 200,
      sortable: true,
    },
    {
      field: 'nickName',
      title: $t('system.user.nickName'),
      width: 250,
      sortable: true,
    },
    {
      cellRender: {
        attrs: { beforeChange: onStatusChange },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
        props: { unCheckedValue: 2 },
      },
      field: 'enable',
      title: $t('common.status'),
      width: 200,
    },
    {
      field: 'phone',
      title: $t('system.user.phone'),
      width: 200,
    },
    {
      field: 'email',
      title: $t('system.user.email'),
      width: 200,
    },
    {
      field: 'createTime',
      formatter: 'formatDateTime',
      title: $t('common.createTime'),
      width: 200,
      sortable: true,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.user.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'auth',
            text: '设置权限',
          },
          {
            code: 'password',
            text: '重置密码',
          },
          'edit', // 默认的编辑按钮
          {
            code: 'delete', // 默认的删除按钮
            disabled: (row: SystemUserApi.SystemUser) => {
              return !!(row.children && row.children.length > 0);
            },
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('common.operation'),
      width: 305,
    },
  ];
}
