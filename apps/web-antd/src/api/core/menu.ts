import type { RecordResponse } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  const res = await requestClient.post<RecordResponse>(
    '/system/menu/getBaseMenuList',
  );
  return res.data || [];
}
