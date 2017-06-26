<template>
  <div v-if="show">
    <div class="info">
      <div class="img-wrap">
        <img :src="info.pic" alt="pic">
      </div>
      <div class="text">
        <h3>物流状态&nbsp;&nbsp;<span class="clRed">{{info.state}}</span></h3>
        <p>承运来源：{{info.source}}</p>
        <p>运单编号：{{info.trackingNo}}</p>
        <p>官方电话：暂无</p>
      </div>
    </div>
    <TimeEvolve :info="info.logistics"></TimeEvolve>
  </div>
</template>

<script>
import TimeEvolve from '@/components/TimeEvolve'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: [],
      show: false
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '物流详情'
      if (this.orderCode && this.id) {
        this.$http.get(this.apiURL + 'member/order/delivery_query.jhtml?orderCode=' + this.orderCode + '&wxbdopenId=' + this.id).then((response) => {
          this.info = response.data
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
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
  components: {
    TimeEvolve
  },
  computed: {
    orderCode: function () {
      return this.$route.params.orderCode
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.info{
  padding: 1rem 0.5rem;
  background: #fff;
  margin-bottom: 0.5rem;
  font-size: 0;
  .img-wrap{
    display: inline-block;
    width: 4rem;
    height: 4rem;
    vertical-align: top;
    border: 1px solid #ccc;
    margin-right: 0.5rem;
  }
  .text{
    display: inline-block;
    vertical-align: top;
    h3{
      font-size: 0.8rem;
      font-weight: normal;
      margin-bottom: 0.3rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    p{
      font-size: 0.6rem;
      line-height: 1rem;
      color: #999;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
