<script lang="ts" setup>
import type { DataNode } from 'ant-design-vue/es/tree';

import type { Recordable } from '@vben/types';

import type { SystemUserApi } from '#/api/system/user';

import { computed, ref } from 'vue';

import { useVbenDrawer, VbenTree, z } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Spin } from 'ant-design-vue';

import { useVbenForm, type VbenFormSchema } from '#/adapter/form';
import { getMenuList } from '#/api/system/menu';
import { createUser, isUserNameExist, updateUser } from '#/api/system/user';
import { $t } from '#/locales';
import { showToast } from '#/utils/common';

const emits = defineEmits(['success']);

const formData = ref<SystemUserApi.SystemUser>();

const formSchema: VbenFormSchema[] = [
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
    if (!id.value && !values.password) values.password = '123456'; // 新增用户，设置密码初始值
    (id.value ? updateUser(id.value, values) : createUser(values))
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
      const data = drawerApi.getData<SystemUserApi.SystemUser>();
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
    ? $t('common.edit', $t('system.user.name'))
    : $t('common.create', $t('system.user.name'));
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
<style lang="css" scoped>
:deep(.ant-tree-title) {
  .tree-actions {
    display: none;
    margin-left: 20px;
  }
}

:deep(.ant-tree-title:hover) {
  .tree-actions {
    display: flex;
    flex: auto;
    justify-content: flex-end;
    margin-left: 20px;
  }
}
</style>
