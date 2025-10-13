import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemUserApi } from '#/api/system/user';

import { ref } from 'vue';

import { z } from '#/adapter/form';
import { isUserNameExist } from '#/api/system/user';
import { $t } from '#/locales';

const formData = ref<SystemUserApi.SystemUser>();

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: $t('system.user.username'),
      rules: z
        .string()
        .min(2, $t('ui.formRules.minLength', [$t('system.user.username'), 2]))
        .max(30, $t('ui.formRules.maxLength', [$t('system.user.username'), 30]))
        .refine(
          async (value: string) => {
            const res = await isUserNameExist(value, formData.value?.id);
            return res.valid;
          },
          (value) => ({
            message: $t('ui.formRules.alreadyExists', [
              $t('system.user.username'),
              value,
            ]),
          }),
        ),
    },
    {
      component: 'Input',
      fieldName: 'roleName',
      label: $t('system.role.roleName'),
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 2 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'enable',
      label: $t('system.role.status'),
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.role.remark'),
    },
    {
      component: 'Input',
      fieldName: 'permissions',
      formItemClass: 'items-start',
      label: $t('system.role.setPermissions'),
      modelPropName: 'modelValue',
    },
  ];
}

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

export function useColumns<T = SystemUserApi.SystemUser>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'roleCode',
      title: $t('system.role.roleCode'),
      width: 305,
    },
    {
      field: 'roleName',
      title: $t('system.role.roleName'),
      width: 305,
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
      title: $t('system.role.createTime'),
      width: 250,
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
