// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import Resource from 'vue-resource'
import router from './router'
import Mint from 'mint-ui'
// import VueWebsocket from 'vue-websocket'
import '../static/js1/viewport_rem.js'
import '../static/style/reset.css'
import '../static/style/base.less'
import 'mint-ui/lib/style.css'

Vue.use(Resource)
Vue.use(Mint)
// Vue.use(VueWebsocket, 'ws://192.168.8.183:8080/MyMessageInbound.do')

router.beforeEach((to, from, next) => {
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

Vue.config.productionTip = false
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
