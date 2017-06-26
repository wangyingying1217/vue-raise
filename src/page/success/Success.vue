<template>
  <div class="success" :style="{'height': height}">
    <div class="img"></div>
    <p class="text">订单已经提交成功</p>
    <div v-if="type == 'exchange'">
      <p class="info">申请时间：<span class="clRed">2017-05-14</span></p>
      <p class="info">申请类型：<span class="clRed">换货</span></p>
    </div>
    <div class="btn-wrapper">
      <router-link class="btn" to="/myorder/raise/all">回到订单列表</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: [],
      show: false,
      height: ''
    }
  },
  methods: {
    getCustomers: function () {
      document.title = ''
      this.height = document.documentElement.clientHeight + 'px'
      this.$indicator.close()
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  },
  watch: {
   // 如果路由有变化，会再次执行该方法
    $route () {
      this.getCustomers()
    },
    id: function () {
      this.getCustomers()
    }
  },
  computed: {
    type: function () {
      return this.$route.params.type
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.success{
  min-height: 100%;
  background: #fff;
  overflow: hidden;
  .img{
    width: 6rem;
    height: 5rem;
    margin: 3rem auto 0;
    background: url("../../../static/image/success.png") no-repeat center center;
    background-size: contain;
  }
  .text{
    font-size: 0.8rem;
    line-height: 2.6rem;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  .info{
    line-height:1.4rem;
    width: 8rem;
    margin: 0 auto;
  }
  .btn-wrapper{
    text-align: center;
    margin-top: 1.4rem;
    .btn{
      display: inline-block;
      width: 7rem;
      color: #333;
      font-size: 0.7rem;
      line-height: 1.8rem;
      border: 2px solid #ccc;
      border-radius: 0.1rem;
    }
  }
}
</style>
