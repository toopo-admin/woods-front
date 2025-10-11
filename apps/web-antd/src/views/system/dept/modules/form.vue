<script lang="ts" setup>
import type { ChangeEvent } from 'ant-design-vue/es/_util/EventInterface';

import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';
import type { SystemDeptApi } from '#/api/system/dept';

import { computed, h, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $te } from '@vben/locales';
import { getPopupContainer } from '@vben/utils';

import { useVbenForm, z } from '#/adapter/form';
import {
  createDept,
  getDeptList,
  isDeptCodeExist,
  isDeptNameExist,
  updateDept,
} from '#/api/system/dept';
import { $t } from '#/locales';
import { showToast } from '#/utils/common';

const emit = defineEmits<{
  success: [];
}>();
const formData = ref<SystemDeptApi.SystemDept>();
const titleSuffix = ref<string>();
const schema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'deptCode',
    label: $t('system.dept.deptCode'),
    rules: z
      .string()
      .min(2, $t('ui.formRules.minLength', [$t('system.dept.deptCode'), 2]))
      .max(30, $t('ui.formRules.maxLength', [$t('system.dept.deptCode'), 30]))
      .refine(
        async (value: string) => {
          const res = await isDeptCodeExist(value, formData.value?.id);
          return res.valid;
        },
        (value) => ({
          message: $t('ui.formRules.alreadyExists', [
            $t('system.dept.deptCode'),
            value,
          ]),
        }),
      ),
  },
  {
    component: 'Input',
    componentProps() {
      // 不需要处理多语言时就无需这么做
      return {
        addonAfter: titleSuffix.value,
        onChange({ target: { value } }: ChangeEvent) {
          titleSuffix.value = value && $te(value) ? $t(value) : undefined;
        },
      };
    },
    fieldName: 'deptName',
    label: $t('system.dept.deptName'),
    rules: z
      .string()
      .min(2, $t('ui.formRules.minLength', [$t('system.dept.deptName'), 2]))
      .max(30, $t('ui.formRules.maxLength', [$t('system.dept.deptName'), 30]))
      .refine(
        async (value: string) => {
          const res = await isDeptNameExist(value, formData.value?.id);
          return res.valid;
        },
        (value) => ({
          message: $t('ui.formRules.alreadyExists', [
            $t('system.dept.deptName'),
            value,
          ]),
        }),
      ),
  },
  {
    component: 'ApiTreeSelect',
    componentProps: {
      api: getDeptList,
      class: 'w-full',
      filterTreeNode(input: string, node: Recordable<any>) {
        if (!input || input.length === 0) {
          return true;
        }
        const deptName: string = node.deptName ?? '';
        if (!deptName) return false;
        return deptName.includes(input) || $t(deptName).includes(input);
      },
      getPopupContainer,
      labelField: 'deptName',
      showSearch: true,
      treeDefaultExpandAll: true,
      valueField: 'id',
      childrenField: 'children',
    },
    fieldName: 'pid',
    label: $t('system.dept.parentDept'),
    renderComponentContent() {
      return {
        title({ label, icon }: { icon: string; label: string }) {
          const coms = [];
          if (!label) return '';
          if (icon) {
            coms.push(h(IconifyIcon, { class: 'size-4', icon }));
          }
          coms.push(h('span', { class: '' }, $t(label || '')));
          return h('div', { class: 'flex items-center gap-1' }, coms);
        },
      };
    },
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
    fieldName: 'status',
    label: $t('system.menu.status'),
  },
  {
    component: 'Textarea',
    componentProps: {
      maxLength: 50,
      rows: 3,
      showCount: true,
      class: 'w-full',
    },
    fieldName: 'remark',
    label: $t('system.dept.remark'),
    rules: z
      .string()
      .max(50, $t('ui.formRules.maxLength', [$t('system.dept.remark'), 50]))
      .optional(),
  },
];

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema,
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues();
      try {
        const { success, msg } = await (formData.value?.id
          ? updateDept(formData.value.id, data)
          : createDept(data));
        showToast({
          type: success ? 'success' : 'error',
          content: msg,
        });
        if (success) {
          modalApi.close();
          emit('success');
        }
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemDeptApi.SystemDept>();
      if (data) {
        if (data.pid === 0) {
          data.pid = undefined;
        }
        formData.value = data;
        formApi.setValues(formData.value);
      }
    }
  },
});

const getModelTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.dept.name')])
    : $t('ui.actionTitle.create', [$t('system.dept.name')]),
);
</script>
<template>
  <Modal :title="getModelTitle">
    <Form class="mx-4" />
  </Modal>
</template>
