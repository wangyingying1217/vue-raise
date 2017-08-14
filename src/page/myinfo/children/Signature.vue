<template>
  <div class="wrapper">
    <textarea maxlength="50" class="textarea" v-model="textarea" name="idiograph"></textarea>
    <p class="length">{{textarea.length}}/50</p>
    <div class="submit-btn">
      <a v-if="signature" class="act" @click="confirm">确认修改</a>
      <a v-else class="act" @click="confirm">确定</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['apiURL', 'id', 'signature'],
  data () {
    return {
      textarea: ''
    }
  },
  methods: {
    confirm: function (event) {
      this.$http.post(this.apiURL + 'member/modifySignature.jhtml', {'wxbdopenId': this.id, 'idiograph': this.textarea}).then((response) => {
        window.history.go(-1)
      }, () => {
        alert('签名修改失败')
      })
    }
  },
  watch: {
    signature: function () {
      this.textarea = this.signature
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.$indicator.close()
    this.textarea = this.signature
    document.title = '修改签名'
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.textarea{
  display:block;
  width:100%;
  height:7rem;
  font-size:0.7rem;
  color:#333333;
  background:#ffffff;
  padding:0.4rem;
  box-sizing:border-box;
}
.length{
  background:#ffffff;
  text-align:right;
  line-height:1.5rem;
  font-size:0.7rem;
  color:#999999;
  padding:0 0.4rem;
}
</style>
