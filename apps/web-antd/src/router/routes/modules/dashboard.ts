import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Analytics',
    path: '/analytics',
    component: () => import('#/views/dashboard/analytics/index.vue'),
    meta: {
      affixTab: true,
      icon: 'lucide:area-chart',
      title: $t('page.dashboard.title'),
    },
  },
];

export default routes;
