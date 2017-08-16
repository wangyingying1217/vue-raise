<template>
  <div>
    <router-view :apiURL="apiURL" :id="wxbdopenId" :qrCode="qrCode" :username="username" :headimgurl="headimgurl" v-if="show"></router-view>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
export default {
  data () {
    return {
      // apiURL: 'http://124.205.131.133:8088/raise/',
      apiURL: 'http://192.168.8.144/raise/',
      // apiURL: 'http://192.168.8.183:8080/raise/',
      // apiURL: 'http://web.huizhi.com.cn:8088/raise/',
      tip: '',
      qrCode: '',
      show: false,
      username: '',
      headimgurl: ''
    }
  },
  created () {
    localStorage.setItem('openId', 'oxMYaszMJBAD6SDNjR--bELoeAeU')
    localStorage.setItem('state', 1)
    let data = {openId: this.openId, state: this.state}
    let url = encodeURIComponent(document.URL.split('#')[0])
    // let data = {}
    // let url = encodeURIComponent(document.URL.split('#')[0])
    // let parameter = location.search.split('?')[1]
    // let code = parameter.split('&')[0].split('=')[1]
    // 微信的code值只能用一次   刷新时取到本地存贮的state和openId
    // if (code !== this.code) {
    //   let state = parameter.split('&')[1].split('=')[1]
    //   localStorage.setItem('code', code)
    //   localStorage.setItem('state', state.indexOf('%') ? state.split('%')[0] : state)
    //   data = {code: code, state: this.state}
    // } else {
    //   data = {openId: this.openId, state: this.state}
    // }
    this.$http.post(this.apiURL + 'gainWx.jhtml', data).then((response) => {
      localStorage.setItem('wxbdopenId', response.data.unionId)
      localStorage.setItem('openId', response.data.openId)
      // 没有关注公众号跳转到关注页面
      if (response.data.qrCode) {
        this.qrCode = response.data.qrCode
        this.$router.push('/qrCode')
        // 未登录跳转到登录页面
      } else if (response.data.msg === 'false') {
        this.$router.push('/login')
        this.username = response.data.username
        this.headimgurl = response.data.headimgurl
      }
      this.show = true
      // 获取用户信息
      this.$http.get(this.apiURL + 'imageSign.jhtml?url=' + url + '&wxbdopenId=' + response.data.unionId).then((response) => {
        wx.config({
          // debug: true,
          appId: response.data.appId,
          timestamp: response.data.timestamp,
          nonceStr: response.data.nonceStr,
          signature: response.data.signature,
          jsApiList: [
            'hideMenuItems'
          ]
        })
        wx.ready(function () {
          wx.hideMenuItems({
            menuList: [
              'menuItem:share:qq',
              'menuItem:share:QZone'
            ]
          })
        })
      })
    }, () => {
      this.$indicator.close()
      this.tip = '请求失败'
    })
  },
  computed: {
    wxbdopenId: function () {
      return localStorage.getItem('wxbdopenId')
    },
    openId: function () {
      return localStorage.getItem('openId')
    },
    code: function () {
      return localStorage.getItem('code')
    },
    state: function () {
      return localStorage.getItem('state')
    }
  }
}
</script>

<style lang='less'>
</style>
