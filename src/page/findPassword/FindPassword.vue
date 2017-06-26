<template>
  <div class="find-password">
    <div v-if="codeState">
      <div class="input-wrapper"><input type="password" v-model="password" placeholder="请输入新密码"></div>
      <div class="input-wrapper"><input type="password" v-model="confirmPassword" placeholder="请确认新密码"></div>
      <a class="submit" :class="{'act':password && password === confirmPassword}" @click="setPassword">下一步</a>
    </div>
    <div v-else>
      <div class="input-wrapper"><input type="tel" v-model="tel" placeholder="输入已绑定的手机号"></div>
      <div class="code-wrapper">
        <input class="w11" type="number" v-model="verifyCode" placeholder="验证码"><!--
         --><a class="send" :class="{'act':tel}" @click="sendVerify">{{verifyText | seconds}}</a>
      </div>
      <a class="submit" :class="{'act':tel && verifyCode}" @click="checkCode">确定</a>
    </div>
    <Tip :info="tip"></Tip>
  </div>
</template>

<script>
import Tip from '@/components/Tip'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      tel: '',
      telErr: true,
      verifyCode: '',
      verifyText: '获取验证码',
      codeState: false,
      password: '',
      confirmPassword: '',
      errMsg: [],
      tip: {
        text: ''
      }
    }
  },
  methods: {
    sendVerify: function () {
      if (this.tel === '') {
        this.tip.text = '请输入手机号码'
      } else if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.tel)) {
        this.tip.text = '手机号输入错误'
      } else if (this.verifyText === '获取验证码') {
        this.$http.get(this.apiURL + 'member/password/sendCode.jhtml?mobile=' + this.tel).then((response) => {
          if (response.data.error) {
            this.verifyText = 60
            var timer = setInterval(() => {
              this.verifyText--
              if (this.verifyText === -1) {
                clearInterval(timer)
                this.verifyText = '获取验证码'
              }
            }, 1000)
          } else {
            this.tip.text = response.data.msg
          }
        }, () => {
          alert('获取失败')
        })
      }
    },
    checkCode: function () {
      if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.tel)) {
        this.tip.text = '手机号输入错误'
      } else if (!/^[0-9]{6}$/.test(this.verifyCode)) {
        this.tip.text = '验证码格式错误'
      } else {
        this.$http.post(this.apiURL + 'member/password/verifysendCode.jhtml', {wxbdopenId: this.id, mobile: this.tel, code: this.verifyCode}).then((response) => {
          if (response.data.state) {
            this.codeState = true
          } else {
            this.tip.text = '验证码错误'
          }
        }, () => {
          alert('请求失败')
        })
      }
    },
    setPassword: function () {
      if (!this.password || !this.confirmPassword) {
        this.tip.text = '密码不能为空'
      } else if (this.password !== this.confirmPassword) {
        this.tip.text = '两次密码输入不一致'
      } else {
        this.$http.post(this.apiURL + 'member/password/update.jhtml', {wxbdopenId: this.id, newPassword: this.password}).then((response) => {
          if (response.data.state) {
            this.$router.push('/hot')
          } else {
            this.password = this.confirmPassword = ''
            this.tip.text = response.data.msg
          }
        })
      }
    }
  },
  filters: {
    seconds: function (val) {
      if (typeof val === 'number') {
        return val + 's'
      } else {
        return val
      }
    }
  },
  components: {
    Tip
  },
  created () {
    document.title = '找回密码'
    this.$indicator.close()
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.find-password{
  box-sizing: border-box;
  padding: 2rem 1rem;
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
  input{
    font-size:0.7rem;
    height:100%;
    padding:0 0.5rem;
    width:100%;
    box-sizing:border-box;
  }
  .input-wrapper{
    height:2rem;
    line-height:2rem;
    width:16rem;
    margin-bottom:0.8rem;
    margin-left:auto;
    margin-right:auto;
    border-radius:0.2rem;
    overflow:hidden;
    background:#fff;
    font-size:0.7rem;
  }
  .code-wrapper{
    .input-wrapper;
    input{
      width: 11rem;
    }
    .send{
      display:inline-block;
      width:5rem;
      text-align:center;
      color:#fff;
      background:#ccc;
      &.act{
        background:#cc0000;
      }
    }
  }
}
</style>
