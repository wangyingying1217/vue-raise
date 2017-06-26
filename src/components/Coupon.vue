<template>
  <div>
    <div v-if="type == 'integral'">
      <router-link :to="{ path: '/ticket/'+item.id}" class="ticket act" v-for="(item, index) in info" :key="index" tag="div">
        <div class="money">￥<span class="num">{{item.money}}</span></div>
        <div class="info">
          <p>{{item.money}}元代金券</p>
          <p class="text">{{item.point}}积分兑换</p>
        </div>
      </router-link>
    </div>
    <div v-if="type != 'integral'">
      <div class="ticket" v-for="(item, index) in info" :key="index" :class="mapClass[item.state - 1]">
        <div class="money">￥<span class="num">{{item.money}}</span></div>
        <div class="info">
          <p>实际支付满{{item.fullPrice}}可用</p>
          <p class="text">{{item.startTime}}-{{item.endTime}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['info', 'type'],
  data () {
    return {
      mapClass: ['act', 'used', 'exceed']
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.ticket{
  height:4.3rem;
  width:16.1rem;
  background:#ffffff;
  margin:0 0 0.8rem 1.1rem;
}
.money{
  float:left;
  width:7rem;
  height:4.3rem;
  line-height:4.3rem;
  text-align:center;
  margin-left:-0.2rem;
  color:#ffffff;
  font-size:1.34rem;
  .num{
    font-family:Impact;
    font-size:2.5rem;
  }
}
.info{
  position:relative;
  float:left;
  width:9.16rem;
  font-size:0.7rem;
  line-height:1.34rem;
  text-align:center;
  color:#666666;
  padding:0.81rem 0;
}
.act{
  .money{
    background:url("../../static/image/couponsAct.png") no-repeat 0 0;
    background-size: contain;
  }
  .text{
    color: #cc0000;
  }
}
.used{
  .money{
    background:url("../../static/image/couponsDis.png") no-repeat 0 0;
    background-size: contain;
  }
  .info{
    background:url("../../static/image/used.png") no-repeat bottom right;
    background-size: 2.87rem;
  }
}
.exceed{
  .money{
    background:url("../../static/image/couponsDis.png") no-repeat 0 0;
    background-size: contain;
  }
  .info{
    background:url("../../static/image/exceed.png") no-repeat bottom right;
    background-size: 2.87rem;
  }
}
</style>
