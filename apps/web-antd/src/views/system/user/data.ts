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
    {
      component: 'Input',
      fieldName: 'nickName',
      componentProps: { allowClear: true },
      label: $t('system.user.nickName'),
    },
  ];
}

export function useColumns<T = SystemUserApi.SystemUser>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 50 },
    { title: $t('common.no'), type: 'seq', width: 65 },
    {
      cellRender: { name: 'CellImage' },
      field: 'avatar',
      title: $t('system.user.avatar'),
      width: 64,
    },
    {
      field: 'username',
      title: $t('system.user.username'),
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'nickName',
      title: $t('system.user.nickName'),
      minWidth: 250,
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
      minWidth: 200,
    },
    {
      field: 'phone',
      title: $t('system.user.phone'),
      minWidth: 200,
    },
    {
      field: 'email',
      title: $t('system.user.email'),
      minWidth: 200,
    },
    {
      field: 'createTime',
      formatter: 'formatDateTime',
      title: $t('common.createTime'),
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'createUser',
      title: $t('common.createUser'),
      minWidth: 150,
      visible: false,
    },
    {
      field: 'updateTime',
      formatter: 'formatDateTime',
      title: $t('common.updateTime'),
      minWidth: 200,
      sortable: true,
      visible: false,
    },
    {
      field: 'updateUser',
      title: $t('common.updateUser'),
      minWidth: 150,
      visible: false,
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
            text: $t('system.user.authorize'),
          },
          {
            code: 'password',
            text: $t('system.user.resetPassword'),
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
