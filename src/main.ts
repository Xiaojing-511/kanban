import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
Vue.config.productionTip = false;
import NProgress from "nprogress";
import "nprogress/nprogress.css";
// 按需导入element-ui
import "./api/element.js";
// 按需导入antd
import "./api/antd.js";
import Cookies from "js-cookie"
import axios from 'axios'
import moment from "moment";
import _ from 'lodash'
import queryString from "query-string";
import {login} from '@/api/communication'

Vue.prototype.$moment = moment;
Vue.prototype.$_ = _;


router.beforeEach(async (to, from, next) => {
  NProgress.start();
  if (Cookies.get('token')) {
    let userStr:any = ''
    if (localStorage.getItem('user')) {
      store.dispatch("setCurrentRouter", to.name)
      next();
    }
    else {
      const api = process.env.VUE_APP_api
      let url = api+'/api/user/currentUser'
      axios
          .get(url, {
            params: {}
          })
          .then((res:any) => {
            if (res.data.code === 200) {
              localStorage.setItem('user', JSON.stringify(res.data.data));
              store.dispatch("setCurrentRouter", to.name)
              next();
            }
            else if (res.data.code === 405) {
              localStorage.removeItem('user');
              Cookies.remove('token');
              window.location.href = 'https://sso.100tal.com/portal/login/1014326443'
            }
          })
          .catch(err => {
            console.log(err, '获取数据失败')
          })
    }
  }
  else {
    const pathname = window.location.search;
    const query = queryString.parse(pathname) || {};
    if (query.token) {
      login({
        'token': query.token
      }).then((res) => {
        if (process.env.API_ENV === 'prod') {
          window.location.href = 'http://t.speiyou.com/star'
        }
        else {
          // window.location.href = 'http://t-beta.speiyou.com/star'
          window.location.href = 'http://test.speiyou.com/star'
        }
      })
    }
    else {
      localStorage.removeItem('user');
      window.location.href = 'https://sso.100tal.com/portal/login/1014326443'
    }
  }
});
router.afterEach(() => {
  NProgress.done(); // 结束 Progress
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
