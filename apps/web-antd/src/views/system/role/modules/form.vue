<script lang="ts" setup>
import type { DataNode } from 'ant-design-vue/es/tree';

import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';
import type { SystemRoleApi } from '#/api/system/role';

import { computed, ref } from 'vue';

import { useVbenDrawer, VbenTree, z } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Spin } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getMenuList } from '#/api/system/menu';
import { createRole, isRoleCodeExist, updateRole } from '#/api/system/role';
import { $t } from '#/locales';
import { showToast } from '#/utils/common';

const emits = defineEmits(['success']);

const formData = ref<SystemRoleApi.SystemRole>();

const formSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'roleCode',
    label: $t('system.role.roleCode'),
    rules: z
      .string()
      .min(2, $t('ui.formRules.minLength', [$t('system.role.roleCode'), 2]))
      .max(30, $t('ui.formRules.maxLength', [$t('system.role.roleCode'), 30]))
      .refine(
        async (value: string) => {
          const res = await isRoleCodeExist(value, formData.value?.id);
          return res.valid;
        },
        (value) => ({
          message: $t('ui.formRules.alreadyExists', [
            $t('system.role.roleCode'),
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

const [Form, formApi] = useVbenForm({
  schema: formSchema,
  showDefaultActions: false,
});

const permissions = ref<DataNode[]>([]);
const loadingPermissions = ref(false);

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    (id.value ? updateRole(id.value, values) : createRole(values))
      .then(({ success, msg }) => {
        showToast({
          type: success ? 'success' : 'error',
          content: msg,
        });
        if (success) {
          drawerApi.close();
          emits('success');
        }
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemRoleApi.SystemRole>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;
        formApi.setValues(data);
      } else {
        id.value = undefined;
      }

      if (permissions.value.length === 0) {
        loadPermissions();
      }
    }
  },
});

async function loadPermissions() {
  loadingPermissions.value = true;
  try {
    const res = await getMenuList();
    permissions.value = res as unknown as DataNode[];
  } finally {
    loadingPermissions.value = false;
  }
}

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('common.edit', $t('system.role.name'))
    : $t('common.create', $t('system.role.name'));
});

function getNodeClass(node: Recordable<any>) {
  const classes: string[] = [];
  if (node.value?.type === 'button') {
    classes.push('inline-flex');
    if (node.index % 3 >= 1) {
      classes.push('!pl-0');
    }
  }

  return classes.join(' ');
}
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form>
      <template #permissions="slotProps">
        <Spin :spinning="loadingPermissions" wrapper-class-name="w-full">
          <VbenTree
            :tree-data="permissions"
            multiple
            bordered
            :default-expanded-level="2"
            :get-node-class="getNodeClass"
            v-bind="slotProps"
            value-field="id"
            label-field="meta.title"
            icon-field="meta.icon"
          >
            <template #node="{ value }">
              <IconifyIcon v-if="value.meta.icon" :icon="value.meta.icon" />
              {{ $t(value.meta.title) }}
            </template>
          </VbenTree>
        </Spin>
      </template>
    </Form>
  </Drawer>
</template>
