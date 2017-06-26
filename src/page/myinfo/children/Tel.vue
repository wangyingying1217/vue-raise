<template>
  <div class="wrapper">
    <div class="tel-wrapper"><input type="tel" v-model="telpre" placeholder="输入新绑定的手机号"></div>
    <div class="code-wrapper"><input class="w11" type="tel" v-model="verifyCode" placeholder="验证码"><a
      class="send" :class="{'act':telpre}" @click="sendVerify">{{verifyText | seconds}}</a></div>
    <div class="submit-btn">
      <a :class="{'act':telpre && verifyCode}" @click="confirm">确认修改</a>
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
      telpre: '',
      telErr: true,
      verifyCode: '',
      verifyText: '获取验证码',
      errMsg: [
        '新手机号和原手机号相同',
        '验证码错误',
        '成功修改'
      ],
      tip: {
        text: ''
      }
    }
  },
  methods: {
    sendVerify: function () {
      if (this.telpre === '') {
        this.tip.text = '请输入手机号码'
      } else if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.telpre)) {
        this.tip.text = '手机号输入错误'
      } else if (this.verifyText === '获取验证码') {
        this.$http.get(this.apiURL + 'member/sendCode.jhtml?mobile=' + this.telpre).then((response) => {
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
          this.$indicator.close()
          alert('请求失败')
        })
      }
    },
    confirm: function () {
      if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.telpre)) {
        this.tip.text = '手机号输入错误'
      } else if (!/^[0-9]{6}$/.test(this.verifyCode)) {
        this.tip.text = '验证码格式错误'
      } else {
        this.$http.post(this.apiURL + 'member/verifysendCode.jhtml', {'wxbdopenId': this.id, 'mobile': this.telpre, 'code': this.verifyCode}).then((response) => {
          if (response.data.state) {
            this.tip.text = '修改成功'
            setTimeout(function () {
              window.history.go(-1)
            }, 1000)
          } else {
            this.tip.text = response.data.msg
          }
        }, () => {
          this.$indicator.close()
          alert('请求失败')
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
    document.title = '绑定手机'
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
input{
  font-size:0.7rem;
  height:100%;
  padding:0 0.5rem;
  width:100%;
  box-sizing:border-box;
}
.code-wrapper,.tel-wrapper{
  height:2rem;
  line-height:2rem;
  width:16rem;
  margin-bottom:0.5rem;
  margin-left:auto;
  margin-right:auto;
  border-radius:0.2rem;
  overflow:hidden;
  background:#fff;
  font-size:0.7rem;
}
.code-wrapper{
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
.tel-wrapper{
  margin-top: 1rem;
}
</style>
