<template>
  <div class="qrcode-wrapper" :style="{'height': height}">
    <img class="qrcode" :src="'https://open.weixin.qq.com/qr/code/?username='+qrCode" alt="pic">
    <p class="text">系统检测到您尚未关注公众号,请长按上方图片,选择识别图中二维码关注公众号,获取更多信息~~</p>
    <router-link class="text" to="/hot">点击直接进入众筹主页</router-link>
  </div>
</template>

<script>
export default {
  props: ['apiURL', 'id', 'qrCode'],
  data () {
    return {
    }
  },
  methods: {
    getCustomers: function () {
      document.title = ''
      this.$indicator.close()
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  },
  computed: {
    height: function () {
      return document.documentElement.clientHeight + 'px'
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.qrcode-wrapper{
  background: #fff;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  .qrcode{
    width: 100%;
  }
  .text{
    padding: 0 1rem 0.4rem;
    font-size: 0.7rem;
    text-align: center;
    line-height: 1.2rem;
  }
}
</style>
