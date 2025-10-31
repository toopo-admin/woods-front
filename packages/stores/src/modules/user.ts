import type { UserInfo } from '.././../../types/src/user';

import { acceptHMRUpdate, defineStore } from 'pinia';

import { handleTreeMap } from '../../../../apps/web-antd/src/utils/common';

interface AccessState {
  /**
   * 菜单权限
   */
  roleMenus: any[];
  /**
   * 用户信息
   */
  userInfo: null | UserInfo;
  /**
   * 用户角色
   */
  userRoles: [];
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: null | UserInfo) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roles = userInfo?.user_role ?? [];
      const menus = userInfo?.role_menu ?? [];
      const roleAuth = menus
        .map((item) => {
          return ['catalog', 'menu'].includes(item.type) ? item : false;
        })
        .filter(Boolean);
      const roleMenu = handleTreeMap(roleAuth, {
        idField: 'id',
        parentField: 'pid',
        parentValue: '0',
        childrenField: 'children',
      });
      this.setUserRoles(roles);
      this.setRoleMenus(roleMenu);
    },
    setUserRoles(roles: []) {
      this.userRoles = roles;
    },
    setRoleMenus(menus: any[]) {
      this.roleMenus = menus;
    },
  },
  state: (): AccessState => ({
    userInfo: null,
    userRoles: [],
    roleMenus: [],
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
