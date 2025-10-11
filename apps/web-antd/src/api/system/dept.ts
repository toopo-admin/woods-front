import { requestClient } from '#/api/request';
import { handleTreeMap } from '#/utils/common';

export namespace SystemDeptApi {
  export interface SystemDept {
    [key: string]: any;
    children?: SystemDept[];
    id: string;
    deptCode: string;
    deptName: string;
    remark?: string;
    status: 1 | 2; // 1-启用，2-禁用
  }
}

/**
 * 获取部门列表数据
 */
async function getDeptList() {
  const data = requestClient.get<Array<SystemDeptApi.SystemDept>>(
    '/system/dept/list',
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
 * 创建部门
 * @param data 部门数据
 */
async function createDept(
  data: Omit<SystemDeptApi.SystemDept, 'children' | 'id'>,
) {
  return requestClient.post('/system/dept/create', data);
}

/**
 * 更新部门
 * @param id 部门 ID
 * @param data 部门数据
 */
async function updateDept(
  id: string,
  data: Omit<SystemDeptApi.SystemDept, 'children' | 'id'>,
) {
  data.id = id;
  return requestClient.post('/system/dept/update', data);
}

/**
 * 删除部门
 * @param id 部门 ID
 */
async function deleteDept(id: string) {
  return requestClient.post('/system/dept/delete', { id });
}

/**
 * 校验部门代码是否存在
 * @param id 表id
 * @param deptCode 部门代码
 */
async function isDeptCodeExist(
  deptCode: string,
  id?: SystemDeptApi.SystemDept['id'],
) {
  return requestClient.get('/system/dept/code-exist', {
    params: { id, deptCode },
    responseReturn: 'data',
  });
}

export { createDept, deleteDept, getDeptList, isDeptCodeExist, updateDept };
