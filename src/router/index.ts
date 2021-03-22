import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import Home from "../views/Home.vue"

Vue.use(VueRouter);
//cv以下代码解决路由地址重复的报错问题(一劳永逸)
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location:any) {
//   return originalPush.call(this, location).catch((err:any) => err)
// }


const routes:RouteConfig[] = [
  {
    path: '/',
    redirect: '/star',
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('@c/main/index.vue'),
  },
  {
    path: '/star',
    name: 'star',
    component: () => import('@c/star/index.vue'),
  },
  {
    path: '/knowledge',
    name: 'knowledge',
    component: () => import('@c/knowledge/index.vue'),
  },
  {
    path: '/demand/',
    name: 'demand',
    component: () => import('@c/demand/index.vue'),
    children: [
      {
        path: '',
        component: () => import('@c/demand/demand.vue')
      },
      {
        path: 'demandEdit/:type/:id',
        name: 'demandEdit',
        component: () => import('@c/demand/demandEdit.vue'),
      },
    ]
  },
  {
    path: '/active',
    name: 'active',
    component: () => import('@c/main/active.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
