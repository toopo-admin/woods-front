import { acceptHMRUpdate, defineStore } from 'pinia';

import type { UserInfo } from '.././../../types/src/user';
import type { roleMenu } from '.././../../@core/base/typings/src';

interface AccessState {
  /**
   * 用户信息
   */
  userInfo: UserInfo | null;
  /**
   * 用户角色
   */
  userRoles: [];
  /**
   * 菜单权限
   */
  roleMenus: roleMenu[];
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: UserInfo | null) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roles = userInfo?.user_role ?? [];
      const menus = userInfo?.role_menu ?? [];
      this.setUserRoles(roles);
      this.setRoleMenus(menus);
    },
    setUserRoles(roles: []) {
      this.userRoles = roles;
    },
    setRoleMenus(menus: roleMenu[]) {
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
