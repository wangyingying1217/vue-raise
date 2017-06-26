<template>
  <div class="wrapper" v-if="show">
    <div class="public">
      {{info.money}}元
    </div>
    <dl class="info">
      <dt>
        <p class="money">{{info.money}}元代金券</p>
        <p class="num">{{info.point}}积分兑换</p>
      </dt>
      <dd>1.&nbsp;优惠券仅可用于购买虚拟商品使用，且实际支付满{{info.fullPrice}}可用</dd>
      <dd>2.&nbsp;优惠券有时效性，请在兑换后的{{info.days}}日内使用</dd>
      <dd>3.&nbsp;如果项目失败，优惠券不退；订单退款结算按照实际支付金额退款</dd>
      <dd>4.&nbsp;一个订单只能使用一张优惠券；同一用户在同一项目上仅限使用一次优惠券</dd>
    </dl>
    <div class="submit-btn"><a class="act" @click="confirmState = true">兑换</a></div>
    <Confirm :info="confirmInfo" @confirm="confirm" v-show="confirmState"></Confirm>
    <Tip :info="tipInfo"></Tip>
  </div>
</template>

<script>
import Confirm from '@/components/Confirm'
import Tip from '@/components/Tip'
export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: [],
      confirmInfo: {
        title: '提示',
        name: '您确定要兑换此优惠券？'
      },
      confirmState: false,
      tipInfo: {
        text: ''
      },
      show: false
    }
  },
  components: {
    Confirm,
    Tip
  },
  methods: {
    getCustomers: function () {
      document.title = ''
      if (this.id) {
        this.$http.get(this.apiURL + 'member/couInfo.jhtml?wxbdopenId=' + this.id + '&id=' + this.$route.params.id).then((response) => {
          this.info = response.data
          this.$indicator.close()
          this.show = true
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    },
    confirm: function (val) {
      this.confirmState = false
      if (val) {
        this.$http.get(this.apiURL + 'member/conCoupon.jhtml?wxbdopenId=' + this.id + '&id=' + this.$route.params.id).then((response) => {
          this.tipInfo.text = '兑换成功'
          setTimeout(() => {
            this.$router.push('/mycoupons/discount')
          }, 1000)
        }, () => {
          this.tipInfo.text = '兑换失败'
        })
      }
    }
  },
  watch: {
    id: function () {
      this.getCustomers()
    },
    $route: function () {
      this.getCustomers()
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.wrapper{
  background: #fff;
  padding-bottom: 2rem;
}
.public{
  height: 13.5rem;
  background: #e86563;
  background: url('../../../static/image/ticket.jpg') no-repeat;
  background-size: cover;
  font-size: 1.6rem;
  color: #cc0000;
  line-height: 13rem;
  text-align: center;
}
.info{
  padding: 1rem 0.5rem;
  line-height: 1.2rem;
  font-size: 0.7rem;
  .money{
    font-size: 0.8rem;
    color: #cc0000;
  }
  .num{
    font-size: 0.6rem;
  }
  dt{
    line-height: 1.2rem;
    padding-bottom: 0.5rem;
  }
}
</style>
