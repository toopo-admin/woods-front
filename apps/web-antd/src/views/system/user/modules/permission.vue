<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';
import type { SystemUserApi } from '#/api/system/user';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  getAuthRoleList,
  getUserAuthList,
  handleUserAuthorize,
} from '#/api/system/user';
import { $t } from '#/locales';
import { showToast } from '#/utils/common';

const modelTitle = ref($t('system.user.authorize'));

const formData = ref({ id: '', username: '' });
const authList = ref([]);

// 用户授权角色下拉选项
const getAuthOpts = async () => {
  const data = await getAuthRoleList();
  authList.value = data;
  return data?.map((item: { id: any; roleName: any }) => {
    return {
      label: item.roleName,
      value: item.id,
    };
  });
};

const formSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'username',
    label: $t('system.user.username'),
    disabled: true,
  },
  {
    component: 'ApiSelect',
    fieldName: 'permission',
    label: $t('common.authorize'),
    rules: 'required',
    componentProps: {
      api: getAuthOpts,
      allowClear: true,
      class: 'w-full',
      mode: 'multiple',
      filterOption(input: string, node: Recordable<any>) {
        if (!input || input.length === 0) {
          return true;
        }
        const roleName: string = node.label ?? '';
        if (!roleName) return false;
        return roleName.includes(input) || $t(roleName).includes(input);
      },
      showSearch: true,
      showArrow: true,
    },
  },
];

const [Form, formApi] = useVbenForm({
  schema: formSchema,
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues();
      const permission = data.permission.map((item: any) => item);
      const authRes = authList.value
        .map((item: any) => {
          const opt = permission.filter((id: any) => item.id === id);
          return opt.length > 0
            ? {
                roleId: item.id,
                roleCode: item.roleCode,
                roleName: item.roleName,
              }
            : false;
        })
        .filter(Boolean);
      try {
        const { success, msg } = await handleUserAuthorize({
          id: formData.value.id,
          username: formData.value.username,
          userAuth: authRes,
        });
        showToast({
          type: success ? 'success' : 'error',
          content: msg,
        });
        if (success) modalApi.close();
      } finally {
        modalApi.lock(false);
      }
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemUserApi.SystemUser>();
      if (data) {
        const authList = await getUserAuthList({ id: data.id });
        data.permission = authList.map((item: { roleId: any }) => item.roleId);
        formData.value = data;
        formApi.setValues(data);
      }
    }
  },
});
</script>
<template>
  <Modal :title="modelTitle">
    <Form />
  </Modal>
</template>
