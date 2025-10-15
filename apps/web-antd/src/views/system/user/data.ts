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
      component: 'InputPassword',
      fieldName: 'password',
      label: $t('system.user.password'),
      componentProps: {
        placeholder: $t('system.user.defaultPassword'),
      },
    },
    {
      component: 'Input',
      fieldName: 'nickName',
      label: $t('system.user.nickName'),
      rules: 'required',
    },
    {
      component: 'Upload',
      fieldName: 'avatar',
      label: $t('system.user.avatar'),
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
      label: $t('common.status'),
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('system.user.phone'),
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('system.user.email'),
    },
  ];
}

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
    {
      field: 'avatar',
      title: $t('system.user.avatar'),
      width: 200,
    },
    {
      field: 'username',
      title: $t('system.user.username'),
      width: 200,
    },
    {
      field: 'nickName',
      title: $t('system.user.nickName'),
      width: 250,
    },
    {
      field: 'phone',
      title: $t('system.user.phone'),
      width: 250,
    },
    {
      field: 'email',
      title: $t('system.user.email'),
      width: 200,
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
      field: 'createTime',
      title: $t('common.createTime'),
      width: 250,
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
      },
      field: 'operation',
      fixed: 'right',
      title: $t('common.operation'),
      width: 200,
    },
  ];
}
