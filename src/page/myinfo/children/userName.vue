<template>
  <div class="wrapper">
    <div class="tel-wrapper"><input type="text" placeholder="您的昵称" v-model="nickname"></div>
    <div class="submit-btn">
      <a :class="{'act':nickname}" @click="confirm">确认修改</a>
    </div>
    <Tip :info="tip"></Tip>
  </div>
</template>

<script>
import Tip from '@/components/Tip'

export default {
  props: ['apiURL', 'id', 'username'],
  data () {
    return {
      nickname: '',
      tip: {
        text: ''
      }
    }
  },
  methods: {
    confirm: function () {
      if (this.nickname.trim()) {
        if (/^[\u4E00-\u9FA5A-Za-z0-9_]{1,12}$/.test(this.nickname)) {
          this.$http.post(this.apiURL + 'member/modify/nickname.jhtml', {'wxbdopenId': this.id, 'nickname': this.nickname}).then((response) => {
            if (response.data.state) {
              window.history.go(-1)
            } else {
              this.tip.text = response.data.msg
            }
          }, () => {
            alert('请求失败')
          })
        } else {
          this.tip.text = '支持中文、英文、数字、下划线的组合，<br/>1-12个字符'
        }
      } else {
        this.tip.text = '用户名不能为空'
      }
    }
  },
  components: {
    Tip
  },
  watch: {
    username: function () {
      this.nickname = this.username
    }
  },
  created () {
    this.$indicator.close()
    this.nickname = this.username
    document.title = '修改昵称'
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
