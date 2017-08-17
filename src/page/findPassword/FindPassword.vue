<template>
  <div class="find-password">
    <!-- 后显示密码输入框 -->
    <div v-if="codeState">
      <div class="input-wrapper"><input type="password" v-model="password" placeholder="请输入新密码"></div>
      <div class="input-wrapper"><input type="password" v-model="confirmPassword" placeholder="请确认新密码"></div>
      <a class="submit" :class="{'act':password && password === confirmPassword}" @click="setPassword">下一步</a>
    </div>
    <!-- 先验证手机号 -->
    <div v-else>
      <div class="input-wrapper"><input type="tel" v-model="tel" placeholder="输入已绑定的手机号"></div>
      <div class="code-wrapper">
        <input class="w11" type="number" v-model="verifyCode" placeholder="验证码"><!--
         --><a class="send" :class="{'act':tel}" @click="sendVerify">{{verifyText | seconds}}</a>
      </div>
      <a class="submit" :class="{'act':tel && verifyCode}" @click="checkCode">确定</a>
    </div>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      tel: '', // 手机号
      verifyCode: '', // 验证码
      verifyText: '获取验证码', // 验证码按钮显示文字
      codeState: false, // 验证码校验结果
      password: '', // 密码
      confirmPassword: '', // 确认密码
      tip: ''
    }
  },
  methods: {
    // 发送验证码
    sendVerify: function () {
      if (this.tel === '') {
        this.tip = '请输入手机号码'
      } else if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.tel)) {
        this.tip = '手机号输入错误'
      } else if (this.verifyText === '获取验证码') {
        this.$http.get(this.apiURL + 'member/password/sendCode.jhtml?mobile=' + this.tel + '&wxbdopenId=' + this.id).then((response) => {
          if (response.data.state) {
            this.verifyText = 60
            var timer = setInterval(() => {
              this.verifyText--
              if (this.verifyText === -1) {
                clearInterval(timer)
                this.verifyText = '获取验证码'
              }
            }, 1000)
          } else {
            this.tip = response.data.msg
          }
        }, () => {
          this.tip = '获取失败'
        })
      }
    },
    // 校验验证码
    checkCode: function () {
      if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.tel)) {
        this.tip = '手机号输入错误'
      } else if (!/^[0-9]{6}$/.test(this.verifyCode)) {
        this.tip = '验证码格式错误'
      } else {
        this.$http.post(this.apiURL + 'member/password/verifysendCode.jhtml', {wxbdopenId: this.id, mobile: this.tel, code: this.verifyCode}).then((response) => {
          if (response.data.state) {
            this.codeState = true
          } else {
            this.tip = response.data.msg
          }
        }, () => {
          this.tip = '请求失败'
        })
      }
    },
    // 设置密码
    setPassword: function () {
      if (!this.password || !this.confirmPassword) {
        this.tip = '密码不能为空'
      } else if (this.password !== this.confirmPassword) {
        this.tip = '两次密码输入不一致'
      } else {
        this.$http.post(this.apiURL + 'member/password/update.jhtml', {wxbdopenId: this.id, newPassword: this.password}).then((response) => {
          if (response.data.state) {
            this.$router.push('/hot')
          } else {
            this.password = this.confirmPassword = ''
            this.tip = response.data.msg
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
