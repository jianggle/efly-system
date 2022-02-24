import Layout from '@/layout/index.vue'

/*
  hidden: true,   // 设置为true时，该路由不会出现在侧边栏
  redirect: 'no', // 设置为no时，该路由在面包屑导航中不可被点击
  meta: {
    title: '页面标题',     // 设置在侧边栏、面包屑、标签栏中展示的名字
    isMenu: true,         // 设置为true才会出现在侧边栏、加入顶部搜索结果，编辑、详情类场景建议设为false
    isCached: true,       // 设置为true才会被keep-alive缓存，编辑、详情类场景建议设为false
    icon: 'el-icon-link', // 设置显示在菜单中的图标
  }
*/

// 基础路由
export default [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/Redirect.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/NotFound.vue'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    hidden: true,
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/profile',
        component: () => import('@/views/system/UserProfile.vue'),
        meta: {
          title: '个人中心',
          isCached: true
        }
      },
    ],
  }
]
