<template>
  <div class="login" :style="{'min-height': height}">
    <div class="text-box">
      <span class="text-title">账号</span>
      <input class="text" type="text" placeholder="手机/邮箱/昵称" v-model="account">
    </div>
    <div class="text-box">
      <span class="text-title">密码</span>
      <input class="text" type="password" name="" placeholder="密码" v-model="password">
    </div>
    <a class="submit" :class="{'act':account && password}" @click="submit">登录</a>
    <p class="other-link">
      <a @click="register">微信登录</a>
      <!-- <router-link to="/register">手机快速注册</router-link> -->
      <router-link class="fr" to="/findPassword">忘记密码</router-link>
    </p>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
export default {
  props: ['apiURL', 'id', 'username', 'headimgurl'],
  data () {
    return {
      info: [],
      tip: '',
      account: '',
      password: '',
      login: false
    }
  },
  methods: {
    // 账号密码登录
    submit: function () {
      if (this.account && this.password) {
        this.$http.post(this.apiURL + 'submitwx.jhtml', {wxbdopenId: this.id, username: this.account, password: this.password, openId: this.openId, state: this.state}).then((response) => {
          if (response.data.msg === 'true') {
            this.login = true
            this.$router.push('/')
          } else {
            this.tip = response.data.msg
          }
        }, () => {
          this.$indicator.close()
          this.tip = '提交失败'
        })
      }
    },
    // 微信登录（新注册用户）
    register: function () {
      this.$http.post(this.apiURL + 'registerwx.jhtml', {wxbdopenId: this.id, username: this.username, headimgurl: this.headimgurl, openId: this.openId, state: this.state}).then((response) => {
        if (response.data.msg === 'true') {
          this.login = true
          this.$router.push('/')
        }
      }, () => {
        this.tip = '注册失败'
      })
    }
  },
  created () {
    // 组件创建完后获取数据，
    document.title = '登录'
    this.$indicator.close()
    let url = encodeURIComponent(document.URL.split('#')[0])
    this.$http.get(this.apiURL + 'imageSign.jhtml?url=' + url + '&wxbdopenId=' + this.id).then((response) => {
      wx.config({
        // debug: true,
        appId: response.data.appId,
        timestamp: response.data.timestamp,
        nonceStr: response.data.nonceStr,
        signature: response.data.signature,
        jsApiList: [
          'hideMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem'
        ]
      })
      wx.ready(function () {
        wx.hideAllNonBaseMenuItem()
      })
    })
  },
  computed: {
    height: function () {
      return document.documentElement.clientHeight + 'px'
    },
    openId: function () {
      return localStorage.getItem('openId')
    },
    state: function () {
      return localStorage.getItem('state')
    }
  },
  beforeRouteLeave (to, from, next) {
    wx.ready(function () {
      wx.showAllNonBaseMenuItem()
      wx.hideMenuItems({
        menuList: [
          'menuItem:share:qq',
          'menuItem:share:QZone'
        ]
      })
    })
    if (this.login || to.path === '/findPassword') {
      next()
    } else {
      this.$router.go(1)
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.login{
  background: #fdfdfd;
  box-sizing: border-box;
  padding: 2rem 1rem;
  .text-box{
    font-size: 0;
    border-bottom: 1px solid #ccc;
    .text-title{
      display: inline-block;
      width: 3rem;
      font-size: 0.7rem;
      line-height: 2.2rem;
    }
    .text{
      font-size: 0.7rem;
      width: 12rem;
    }
  }
  .submit{
    display: block;
    margin: 1.8rem auto 1.4rem;
    font-size: 0.8rem;
    line-height: 2rem;
    text-align: center;
    background: #ccc;
    color: #fff;
    border-radius: 0.1rem;
    &.act{
      background: #cc0000;
    }
  }
  .other-link{
    margin: 0 auto;
    overflow: hidden;
    a{
      color: #666;
    }
  }
}
</style>
