import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

// // const userStore = useUserStore();
// const authStore = useAuthStore();
// const accessStore = useAccessStore();

// console.log('这是动态路由');

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          title: $t('demos.antd'),
        },
        name: 'AntDesignDemos',
        path: '/demos/ant-design',
        component: () => import('#/views/demos/antd/index.vue'),
      },
    ],
  },
];

export default routes;
