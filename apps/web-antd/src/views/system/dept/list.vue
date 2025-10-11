<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemDeptApi } from '#/api/system/dept';

import { nextTick, onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import {
  IconifyIcon,
  SvgArrowOpenDownIcon,
  SvgArrowOpenRightIcon,
} from '@vben/icons';
import { $t } from '@vben/locales';

import { MenuBadge } from '@vben-core/menu-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDept, getDeptList } from '#/api/system/dept';
import { handleTreeFilte, showToast } from '#/utils/common';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const showExpand = ref(true);

const tableList = ref();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
  fullscreenButton: false,
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
          formValues: { deptCode: string; deptName: string },
        ) => {
          tableList.value = await getDeptList();
          const deptCode = formValues.deptCode?.trim();
          const deptName = formValues.deptName?.trim();
          if (deptCode || deptName) {
            tableList.value = handleTreeFilte(tableList.value, [
              { prop: 'deptCode', value: deptCode },
              { prop: 'deptName', value: deptName },
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
}: OnActionClickParams<SystemDeptApi.SystemDept>) {
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
function onEdit(row: SystemDeptApi.SystemDept) {
  formModalApi.setData(row).open();
}
function onCreate() {
  formModalApi.setData({}).open();
}
function onAppend(row: SystemDeptApi.SystemDept) {
  formModalApi.setData({ pid: row.id }).open();
}
function onDelete(row: SystemDeptApi.SystemDept) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteDept(row.id)
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
    <FormModal @success="onRefresh" />
    <Grid>
      <template #toolbar-actions>
        <Button type="primary" @click="onCreate">
          {{ $t('ui.actionTitle.create', [$t('system.dept.name')]) }}
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
      <template #deptName="{ row }">
        <div class="flex w-full items-center gap-1">
          <span class="flex-auto">{{ $t(row.deptName) }}</span>
        </div>
      </template>
    </Grid>
  </Page>
</template>
<style lang="scss" scoped>
.dept-badge {
  top: 50%;
  right: 0;
  transform: translateY(-50%);

  & > :deep(div) {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
