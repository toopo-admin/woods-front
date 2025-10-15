import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemUserApi {
  export interface SystemUser {
    [key: string]: any;
    id: string;
    username: string;
    password: string;
    nickName: string;
    avatar: string;
    phone: string;
    email: string;
    permissions: string[]; // 用户权限
    enable: 1 | 2; // 1-启用，2-禁用
  }
}

/**
 * 获取用户列表数据
 */
async function getUserList(params: Recordable<any>) {
  return requestClient.get<Array<SystemUserApi.SystemUser>>(
    '/system/user/list',
    { params, responseReturn: 'data' },
  );
}

/**
 * 创建用户
 * @param data 用户数据
 */
async function createUser(data: Omit<SystemUserApi.SystemUser, 'id'>) {
  return requestClient.post('/system/user/create', data);
}

/**
 * 更新用户
 *
 * @param id 用户 ID
 * @param data 用户数据
 */
async function updateUser(
  id: string,
  data: Omit<SystemUserApi.SystemUser, 'id'>,
) {
  data.id = id;
  return requestClient.post('/system/user/update', data);
}

/**
 * 删除用户
 * @param id 用户 ID
 */
async function deleteUser(id: string) {
  return requestClient.post('/system/user/delete', { id });
}

/**
 * 校验用户登录名是否存在
 * @param id 表id
 * @param username 用户登录名
 */
async function isUserNameExist(
  username: string,
  id?: SystemUserApi.SystemUser['id'],
) {
  return requestClient.get('/system/user/name-exist', {
    params: { id, username },
    responseReturn: 'data',
  });
}

/**
 * 重置用户密码
 * @param data 用户密码
 */
async function handleResetPassword(data: any) {
  return requestClient.post('/system/user/reset-password', data);
}

export {
  createUser,
  deleteUser,
  getUserList,
  handleResetPassword,
  isUserNameExist,
  updateUser,
};
