<template>
  <div class="wrapper">
    <ul class="password-list">
      <li><input type="password" placeholder="请输入旧密码" v-model="oldPassword" @blur="checkPassWord"></li>
      <li><input type="password" placeholder="请输入新密码" v-model="newPassword"></li>
      <li><input type="password" placeholder="请确认新密码" v-model="confirmPassword"></li>
    </ul>
    <div class="submit-btn">
      <a @click="confirm">确认修改</a>
    </div>
    <Tip :info="tip"></Tip>
  </div>
</template>

<script>
import Tip from '@/components/Tip'

const SUCCESS_NUM = 6

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      passwordErr: true,
      errMsg: [
        '密码不能为空',
        '数据验证失败',
        '密码长度不符合',
        '当前密码不正确',
        '新密码不可以与旧密码相同',
        '修改成功'
      ],
      tip: {
        text: ''
      }
    }
  },
  methods: {
    checkPassWord: function () {
      this.passwordErr = true
      if (!this.oldPassword) {
        this.tip.text = '旧密码不能为空'
      } else {
        this.$http.get(this.apiURL + 'member/checkPassword.jhtml?wxbdopenId=' + this.id + '&password=' + this.oldPassword).then((response) => {
          if (response.data.state) {
            this.telErr = false
          } else {
            this.tip.text = '旧密码输入错误'
          }
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    },
    confirm: function (event) {
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        this.tip.text = '密码不能为空'
      } else if (this.newPassword !== this.confirmPassword) {
        this.tip.text = '两次密码输入不一致'
      } else if (this.passwordErr) {
        this.tip.text = '旧密码输入错误'
      } else {
        this.$http.post(this.apiURL + 'member/password/update.jhtml', {wxbdopenId: this.id, currentPassword: this.oldPassword, newPassword: this.newPassword}).then((response) => {
          this.tip.text = this.errMsg[response.data.state]
          if (response.data.state === SUCCESS_NUM) {
            setTimeout(function () {
              window.history.go(-1)
            }, 1000)
          }
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    }
  },
  components: {
    Tip
  },
  created () {
    document.title = '修改地址'
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.password-list{
  margin-top:1rem;
  li{
    height:2rem;
    padding:0 1rem;
    border-top:1px solid #ccc;
    background:#fff;
    &:last-of-type{
      border-bottom:1px solid #ccc;
    }
    input{
      width:100%;
      font-size:0.7rem;
      height:100%;
    }
  }
}
</style>
