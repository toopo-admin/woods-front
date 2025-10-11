import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';
import { handleTreeMap } from '#/utils/common';

export namespace SystemMenuApi {
  /** 徽标颜色集合 */
  export const BadgeVariants = [
    'default',
    'destructive',
    'primary',
    'success',
    'warning',
  ] as const;
  /** 徽标类型集合 */
  export const BadgeTypes = ['dot', 'normal'] as const;
  /** 菜单类型集合 */
  export const MenuTypes = [
    'catalog',
    'menu',
    'embedded',
    'link',
    'button',
  ] as const;
  /** 系统菜单 */
  export interface SystemMenu {
    [key: string]: any;
    /** 后端权限标识 */
    authCode: string;
    /** 子级 */
    children?: SystemMenu[];
    /** 组件 */
    component?: string;
    /** 菜单ID */
    id: string;
    /** 菜单元数据 */
    meta?: {
      /** 激活时显示的图标 */
      activeIcon?: string;
      /** 作为路由时，需要激活的菜单的Path */
      activePath?: string;
      /** 固定在标签栏 */
      affixTab?: boolean;
      /** 在标签栏固定的顺序 */
      affixTabOrder?: number;
      /** 徽标内容(当徽标类型为normal时有效) */
      badge?: string;
      /** 徽标类型 */
      badgeType?: (typeof BadgeTypes)[number];
      /** 徽标颜色 */
      badgeVariants?: (typeof BadgeVariants)[number];
      /** 在菜单中隐藏下级 */
      hideChildrenInMenu?: boolean;
      /** 在面包屑中隐藏 */
      hideInBreadcrumb?: boolean;
      /** 在菜单中隐藏 */
      hideInMenu?: boolean;
      /** 在标签栏中隐藏 */
      hideInTab?: boolean;
      /** 菜单图标 */
      icon?: string;
      /** 内嵌Iframe的URL */
      iframeSrc?: string;
      /** 是否缓存页面 */
      keepAlive?: boolean;
      /** 外链页面的URL */
      link?: string;
      /** 同一个路由最大打开的标签数 */
      maxNumOfOpenTab?: number;
      /** 无需基础布局 */
      noBasicLayout?: boolean;
      /** 是否在新窗口打开 */
      openInNewWindow?: boolean;
      /** 菜单排序 */
      order?: number;
      /** 额外的路由参数 */
      query?: Recordable<any>;
      /** 菜单标题 */
      title?: string;
    };
    /** 菜单名称 */
    name: string;
    /** 路由路径 */
    path: string;
    /** 父级ID */
    pid: string;
    /** 重定向 */
    redirect?: string;
    /** 菜单类型 */
    type: (typeof MenuTypes)[number];
  }
}

/**
 * 获取菜单数据列表
 */
async function getMenuList() {
  const data = requestClient.get<Array<SystemMenuApi.SystemMenu>>(
    '/system/menu/list',
    { responseReturn: 'data' },
  );
  return handleTreeMap(await data, {
    idField: 'id',
    parentField: 'pid',
    parentValue: '0',
    childrenField: 'children',
  });
}

/**
 * 校验菜单编号是否存在
 * @param id 表id
 * @param menu_code 菜单编号
 */
async function isMenuCodeExist(
  code: string,
  id?: SystemMenuApi.SystemMenu['id'],
) {
  return requestClient.get('/system/menu/code-exist', {
    params: { id, menu_code: code },
    responseReturn: 'data',
  });
}

/**
 * 校验路由path是否存在
 * @param id 表id
 * @param route_path 路由path
 */
async function isMenuPathExist(
  path: string,
  id?: SystemMenuApi.SystemMenu['id'],
) {
  return requestClient.get('/system/menu/path-exist', {
    params: { id, route_path: path },
    responseReturn: 'data',
  });
}

/**
 * 创建菜单
 * @param data 菜单数据
 */
async function createMenu(
  data: Omit<SystemMenuApi.SystemMenu, 'children' | 'id'>,
) {
  return requestClient.post('/system/menu/create', data);
}

/**
 * 更新菜单
 *
 * @param id 菜单 ID
 * @param data 菜单数据
 */
async function updateMenu(
  id: string,
  data: Omit<SystemMenuApi.SystemMenu, 'children' | 'id'>,
) {
  data.id = id;
  return requestClient.post('/system/menu/update', data);
}

/**
 * 删除菜单
 * @param id 菜单 ID
 */
async function deleteMenu(id: string) {
  return requestClient.post('/system/menu/delete', { id });
}

export {
  createMenu,
  deleteMenu,
  getMenuList,
  isMenuCodeExist,
  isMenuPathExist,
  updateMenu,
};
