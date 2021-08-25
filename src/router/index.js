import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    }, {
      path: '/users',
      component: Users
    }, {
      path: '/rights',
      component: Rights
    }, {
      path: '/roles',
      component: Roles
    }, {
      path: '/categories',
      component: Cate
    }, {
      path: '/params',
      component: Params
    }]
  }]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从那个路径跳转而来
  // next是一个函数，不带参数表示放行，带参数表示跳转
  if (to.path === '/login') {
    // 访问的是登录页，登录页直接放行
    return next();
  } else {
    // 如果访问的不是登录页，从sessionStorage中获取token
    const tokenStr = window.sessionStorage.getItem("token")
    if (!tokenStr) {
      // 如果不存在token说明未登录，跳转到登录页面
      return next('/login');
    } else {
      // token存在说明已登录，放行
      next();
    }
  }
})

export default router
