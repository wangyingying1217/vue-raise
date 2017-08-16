// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import Resource from 'vue-resource'
import router from './router'
import Mint from 'mint-ui'
import './service/viewport_rem.js'
import './style/reset.css'
import './style/base.less'
import 'mint-ui/lib/style.css'
import Tip from './components/tip/index'
import LoadMore from './components/loadmore/index'

Vue.use(Resource)
Vue.use(Mint)
Vue.use(Tip)
Vue.use(LoadMore)

// 页面跳转中间出现加载标志
router.beforeEach((to, from, next) => {
  // 主页Tab切换是不出现加载标志
  if (from.fullPath !== '/hot' && from.fullPath !== '/his' && from.fullPath !== '/pre' && from.fullPath !== '/create/search') {
    Mint.Indicator.open()
    let snake = document.querySelectorAll('.mint-spinner-snake')[0]
    snake.style.width = '1.6rem'
    snake.style.height = '1.6rem'
    snake.style.borderWidth = '0.2rem'
    snake.style.margin = '0.2rem'
  }
  next()
})
// 阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false
// vue-resource 允许跨域携带cookie
Vue.http.options.withCredentials = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
