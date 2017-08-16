<template>
  <div>
    <!-- 积分兑换券 -->
    <div v-if="type == 'integral'">
      <!-- 兑换页面的路径 -->
      <router-link :to="{ path: '/ticket/'+item.id}" class="ticket act" v-for="(item, index) in info" :key="index" tag="div">
        <!-- 优惠券面值 -->
        <div class="money">￥<span class="num">{{item.money}}</span></div>
        <div class="info">
          <!-- 优惠券面值 -->
          <p>{{item.money}}元代金券</p>
          <!-- 兑换所需积分 -->
          <p class="text">{{item.point}}积分兑换</p>
        </div>
      </router-link>
    </div>
    <!-- 优惠券 -->
    <div v-if="type != 'integral'">
      <!-- 优惠券状态 (可使用,已使用,已过期) -->
      <div class="ticket" v-for="(item, index) in info" :key="index" :class="mapClass[item.state - 1]">
        <!-- 优惠券面值 -->
        <div class="money">￥<span class="num">{{item.money}}</span></div>
        <div class="info">
          <!-- 优惠券使用条件 -->
          <p>实际支付满{{item.fullPrice}}可用</p>
          <!-- 优惠券有效的起止日期 -->
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
      mapClass: ['act', 'used', 'exceed'] // 积分券状态的class(可使用,已使用,已过期)
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
    background:url("../image/couponsAct.png") no-repeat 0 0;
    background-size: contain;
  }
  .text{
    color: #cc0000;
  }
}
.used{
  .money{
    background:url("../image/couponsDis.png") no-repeat 0 0;
    background-size: contain;
  }
  .info{
    background:url("../image/used.png") no-repeat bottom right;
    background-size: 2.87rem;
  }
}
.exceed{
  .money{
    background:url("../image/couponsDis.png") no-repeat 0 0;
    background-size: contain;
  }
  .info{
    background:url("../image/exceed.png") no-repeat bottom right;
    background-size: 2.87rem;
  }
}
</style>
