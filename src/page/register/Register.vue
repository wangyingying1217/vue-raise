<template>
  <div class="register">
    <div class="tel-wrapper"><input type="tel" v-model="tel" placeholder="输入手机号" @blur="checkTel"></div>
    <div class="code-wrapper">
      <input class="w11" type="number" v-model="verifyCode" placeholder="验证码"><!--
       --><a class="send" :class="{'act':tel}" @click="sendVerify">{{verifyText | seconds}}</a>
     </div>
    <a class="submit" :class="{'act':tel && verifyCode}" @click="register">注册</a>
    <Confirm :info="confirmInfo" @confirm="confirm" v-show="confirmState"></Confirm>
    <Tip :info="tip"></Tip>
  </div>
</template>

<script>
import Tip from '@/components/Tip'
import Confirm from '@/components/Confirm'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      tel: '',
      telErr: true,
      verifyCode: '',
      verifyText: '获取验证码',
      errMsg: [],
      tip: {
        text: ''
      },
      confirmInfo: {
        title: '提示',
        name: '此号码已经被注册，您确定要重新注册此号码？'
      },
      confirmState: false
    }
  },
  methods: {
    checkTel: function () {
      this.telErr = true
      if (this.tel === '') {
        this.tip.text = '请输入手机号码'
      } else if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.tel)) {
        this.tip.text = '手机号输入错误'
      } else {
        this.telErr = false
      }
    },
    sendVerify: function () {
      if (this.telErr) {
        if (this.tel === '') {
          this.tip.text = '请输入手机号码'
        } else {
          this.tip.text = '手机号输入错误'
        }
      } else if (!this.telErr && this.verifyText === '获取验证码') {
        this.$http.get(this.apiURL + 'registerSendCode.jhtml?mobile=' + this.tel).then((response) => {
          if (response.data.state) {
            this.tip.text = response.data.msg
          } else {
            this.verifyText = 60
            var timer = setInterval(() => {
              this.verifyText--
              if (this.verifyText === -1) {
                clearInterval(timer)
                this.verifyText = '获取验证码'
              }
            }, 1000)
          }
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    },
    confirm: function (val) {
      this.confirmState = false
      this.register()
    },
    register: function () {
      if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.tel)) {
        this.tip.text = '手机号输入错误'
      } else if (!/^[0-9]{6}$/.test(this.verifyCode)) {
        this.tip.text = '验证码格式错误'
      } else {
        this.$http.post(this.apiURL + 'registerVerifysendCode.jhtml', {wxbdopenId: this.id, mobile: this.tel, code: this.verifyCode, openId: this.openId, state: this.state}).then((response) => {
          if (response.data.msg) {
            this.$router.push('/hot')
          }
        }, () => {
          alert('注册失败')
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
    Tip,
    Confirm
  },
  created () {
    document.title = '快速注册'
    this.$indicator.close()
  },
  computed: {
    openId: function () {
      return localStorage.getItem('openId')
    },
    state: function () {
      return localStorage.getItem('state')
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.register{
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
  .tel-wrapper{
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
    .tel-wrapper;
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
