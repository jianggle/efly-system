import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

/*
  redirect: 'no',           // 设置为no时，该路由在面包屑导航中不可被点击
  meta: {
    title: '页面标题',       // 设置在侧边栏、面包屑、标签栏中展示的名字
    isMenu: true,           // 设置为true才会出现在侧边栏、加入顶部搜索结果，编辑、详情类场景建议设为false
    isCached: true,         // 设置为true才会被keep-alive缓存，编辑、详情类场景建议设为false
    icon: 'svg-name',       // 设置显示在菜单中的图标，对应路径src/icons/svg
    affix: true,            // 设置为true时将始终固定在tab标签栏
  }
*/

/**基础路由 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    component: Layout,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/Redirect.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '',
    name: 'root',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '首页',
          affix: true,
        },
      },
      {
        path: '/profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          title: '个人中心',
          isCached: true,
        },
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/NotFound.vue'),
        meta: {
          title: '迷路了ing',
        },
      },
    ],
  },
]

export default routes
