<template>
  <div class="wrapper">
    <div class="email-wrapper">
      <input type="url" v-model="email" placeholder="输入新绑定的邮箱">
    </div>
    <div class="submit-btn">
      <a :class="{'act':email}" @click="confirm">{{btnText}}</a>
    </div>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
export default {
  props: ['apiURL', 'id', 'emailPre', 'isEmail'],
  data () {
    return {
      email: '',
      tip: ''
    }
  },
  methods: {
    confirm: function () {
      if (this.email === '') {
        this.tip = '请输入邮箱'
      } else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email)) {
        this.tip = '邮箱输入错误'
      } else {
        this.$http.get(this.apiURL + 'member/access/email.jhtml?wxbdopenId=' + this.id + '&email=' + this.email).then((response) => {
          this.tip = response.data.msg
          if (response.data.isEmail) {
            setTimeout(function () {
              window.history.go(-1)
            }, 1000)
          }
        }, () => {
          this.$indicator.close()
          this.tip = '请求失败'
        })
      }
    }
  },
  created () {
    document.title = '绑定邮箱'
    if (this.emailPre && !this.isEmail) {
      this.email = this.emailPre
    }
  },
  computed: {
    btnText: function () {
      let text = '绑定邮箱'
      if (this.emailPre && this.email === this.emailPre) {
        text = '激活邮箱'
      }
      return text
    }
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
.code-wrapper,.email-wrapper{
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
    background:#cc0000;
  }
}
.email-wrapper{
  margin-top: 1rem;
}
</style>
