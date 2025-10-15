<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { SystemDeptApi } from '#/api/system/dept';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm, z } from '#/adapter/form';
import { handleResetPassword } from '#/api/system/user';
import { $t } from '#/locales';
import { showToast } from '#/utils/common';

const modelTitle = ref('修改密码');

const id = ref('');
const formSchema: VbenFormSchema[] = [
  {
    component: 'InputPassword',
    fieldName: 'newPassword',
    label: $t('system.user.newPassword'),
    rules: z
      .string()
      .min(6, $t('ui.formRules.minLength', [$t('system.user.newPassword'), 6]))
      .max(
        12,
        $t('ui.formRules.maxLength', [$t('system.user.newPassword'), 12]),
      ),
  },
  {
    component: 'InputPassword',
    fieldName: 'confirmPassword',
    label: $t('system.user.confirmPassword'),
    rules: z
      .string()
      .min(
        6,
        $t('ui.formRules.minLength', [$t('system.user.confirmPassword'), 6]),
      )
      .max(
        12,
        $t('ui.formRules.maxLength', [$t('system.user.confirmPassword'), 12]),
      )
      .refine(
        async (value: string) => {
          const formData = await formApi.getValues();
          return formData?.newPassword === value;
        },
        () => ({
          message: $t('system.user.differentPassword'),
        }),
      ),
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
      data.id = id.value;
      try {
        const { success, msg } = await handleResetPassword(data);
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
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemDeptApi.SystemDept>();
      if (data) id.value = data.id;
    }
  },
});
</script>
<template>
  <Modal :title="modelTitle">
    <Form />
  </Modal>
</template>
