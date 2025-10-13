import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  export interface SystemRole {
    [key: string]: any;
    id: string;
    roleCode: string;
    roleName: string;
    permissions: string[]; // 角色权限
    remark?: string;
    createTime?: string;
    enable: 1 | 2; // 1-启用，2-禁用
  }
}

/**
 * 获取角色列表数据
 */
async function getRoleList(params: Recordable<any>) {
  return requestClient.get<Array<SystemRoleApi.SystemRole>>(
    '/system/role/list',
    { params, responseReturn: 'data' },
  );
}

/**
 * 创建角色
 * @param data 角色数据
 */
async function createRole(data: Omit<SystemRoleApi.SystemRole, 'id'>) {
  return requestClient.post('/system/role/create', data);
}

/**
 * 更新角色
 *
 * @param id 角色 ID
 * @param data 角色数据
 */
async function updateRole(
  id: string,
  data: Omit<SystemRoleApi.SystemRole, 'id'>,
) {
  data.id = id;
  return requestClient.post('/system/role/update', data);
}

/**
 * 删除角色
 * @param id 角色 ID
 */
async function deleteRole(id: string) {
  return requestClient.post('/system/role/delete', { id });
}

/**
 * 校验角色代码是否存在
 * @param id 表id
 * @param roleCode 角色代码
 */
async function isRoleCodeExist(
  roleCode: string,
  id?: SystemRoleApi.SystemRole['id'],
) {
  return requestClient.get('/system/role/code-exist', {
    params: { id, roleCode },
    responseReturn: 'data',
  });
}

export { createRole, deleteRole, getRoleList, isRoleCodeExist, updateRole };
