<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { nextTick, onMounted, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import {
  IconifyIcon,
  SvgArrowOpenDownIcon,
  SvgArrowOpenRightIcon,
} from '@vben/icons';
import { $t } from '@vben/locales';

import { MenuBadge } from '@vben-core/menu-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteMenu, getMenuList, SystemMenuApi } from '#/api/system/menu';
import { handleTreeFilte, showToast } from '#/utils/common';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const showExpand = ref(true);

const tableList = ref();

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['createTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: true,
    showCollapseButton: false,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async (
          _params: any,
          formValues: { menuTitle: string; routePath: string },
        ) => {
          tableList.value = await getMenuList();
          const menuTitle = formValues.menuTitle?.trim();
          const routePath = formValues.routePath?.trim();
          if (menuTitle || routePath) {
            tableList.value = handleTreeFilte(tableList.value, [
              { prop: 'meta.title', value: menuTitle },
              { prop: 'path', value: routePath },
            ]);
            setTimeout(() => {
              onExpand();
            }, 100);
          } else {
            handleExpandPart(); // 展开第一层树结构
          }
          return tableList.value;
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
    treeConfig: {
      parentField: 'pid',
      rowField: 'id',
      transform: false,
    },
  } as VxeTableGridOptions,
});

function onActionClick({
  code,
  row,
}: OnActionClickParams<SystemMenuApi.SystemMenu>) {
  switch (code) {
    case 'append': {
      onAppend(row);
      break;
    }
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
    default: {
      break;
    }
  }
}

function onRefresh() {
  gridApi.query();
  handleExpandPart();
}
function onEdit(row: SystemMenuApi.SystemMenu) {
  formDrawerApi.setData(row).open();
}
function onCreate() {
  formDrawerApi.setData({}).open();
}
function onAppend(row: SystemMenuApi.SystemMenu) {
  formDrawerApi.setData({ pid: row.id }).open();
}
function onDelete(row: SystemMenuApi.SystemMenu) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteMenu(row.id)
    .then((res: { msg: any; success: any }) => {
      showToast({
        type: res.success ? 'success' : 'error',
        content: res.msg,
      });
      if (res.success) onRefresh();
      hideLoading();
    })
    .catch(() => {
      hideLoading();
    });
}

// 展开全部
function onExpand() {
  showExpand.value = false;
  gridApi.grid?.setAllTreeExpand(true);
}

// 折叠全部
function onCollapse() {
  showExpand.value = true;
  gridApi.grid?.setAllTreeExpand(false);
}

// 展开第一层
function handleExpandPart() {
  setTimeout(() => {
    showExpand.value = true;
    gridApi.grid?.setTreeExpand(tableList.value, true);
  }, 100);
}

// 初始化后，展开树形table第一层
onMounted(() => {
  nextTick(() => {
    handleExpandPart();
  });
});
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid>
      <template #toolbar-actions>
        <Button type="primary" @click="onCreate">
          {{ $t('ui.actionTitle.create', [$t('system.menu.name')]) }}
        </Button>
      </template>
      <template #toolbar-tools>
        <SvgArrowOpenRightIcon
          v-if="showExpand"
          @click="onExpand"
          class="size-5 cursor-pointer pt-1 transition-colors hover:text-blue-600"
        />
        <SvgArrowOpenDownIcon
          v-else
          @click="onCollapse"
          class="size-5 cursor-pointer pt-1 transition-colors hover:text-blue-600"
        />
      </template>
      <template #title="{ row }">
        <div class="flex w-full items-center gap-1">
          <div class="size-5 flex-shrink-0">
            <IconifyIcon
              v-if="row.type === 'button'"
              icon="carbon:security"
              class="size-full"
            />
            <IconifyIcon
              v-else-if="row.meta?.icon"
              :icon="row.meta?.icon || 'carbon:circle-dash'"
              class="size-full"
            />
          </div>
          <span class="flex-auto">{{ $t(row.meta?.title) }}</span>
          <div class="items-center justify-end"></div>
        </div>
        <MenuBadge
          v-if="row.meta?.badgeType"
          class="menu-badge"
          :badge="row.meta.badge"
          :badge-type="row.meta.badgeType"
          :badge-variants="row.meta.badgeVariants"
        />
      </template>
    </Grid>
  </Page>
</template>
<style lang="scss" scoped>
.menu-badge {
  top: 50%;
  right: 0;
  transform: translateY(-50%);

  & > :deep(div) {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
