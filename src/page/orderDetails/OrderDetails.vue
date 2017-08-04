<template>
  <div v-if="show">
    <div class="order-details">
      <div v-if="info.type !== GRATISRETURN" class="address">
        <div class="bg-local"></div>
        <p>收货人：{{info.receiveName}}
          <span class="fr">{{info.receiveTel}}</span>
        </p>
        <p>收货地址：{{info.areaName + info.address}}</p>
        <div class="bg-right"></div>
      </div>
      <ul class="con-list">
        <li class="item">
          <span class="item-tit">订单编号：</span>
          <span class="item-con">{{orderCode}}</span>
        </li>
        <li class="item">
          <span class="item-tit">下单时间：</span>
          <span class="item-con">{{info.orderTime}}</span>
        </li>
        <li class="item">
          <span class="item-tit">支持金额：</span>
          <span class="item-con">￥{{parseInt(info.supportMoney).toFixed(2)}}</span>
        </li>
        <li v-if="info.type !== GRATISRETURN" class="item">
          <span class="item-tit">支持份数：</span>
          <span class="item-con">{{info.supportNum}}</span>
        </li>
        <li class="item">
          <span class="item-tit">回报内容：</span>
          <span class="item-con">{{info.returnCon}}</span>
        </li>
        <li v-if="info.type !== GRATISRETURN" class="item">
          <span class="item-tit">回报时间：</span>
          <span class="item-con">众筹成功后的{{info.returnTime}}天内</span>
        </li>
        <li class="item" v-if="info.isInvoice">
          <span class="item-tit">发票类型：</span>
          <span class="item-con">{{info.invoiceType}}</span>
        </li>
        <li class="item" v-if="info.isInvoice">
          <span class="item-tit">发票抬头：</span>
          <span class="item-con">{{info.invoiceHead}}</span>
        </li>
      </ul>
      <div class="money">
        <div class="show">
          <p>
            <span class="item-tit">商品总额</span>
            <span class="item-con">￥{{parseInt(info.totalMoney).toFixed(2)}}</span>
          </p>
          <p v-if="info.type !== GRATISRETURN">
            <span class="item-tit">+运费</span>
            <span class="item-con">￥{{parseInt(info.freight).toFixed(2)}}</span>
          </p>
        </div>
        <div class="total">
          <span class="total-tit">实付款：</span>
          <span class="clRed">￥{{parseInt(info.payMoney).toFixed(2)}}</span>
        </div>
      </div>
      <div class="author">
        <div class="info">
          <div class="img-wrap">
            <img :src="info.sponsorHeadPic" alt="pic">
          </div>
          项目发起者：{{info.sponsorName}}
        </div>
        <div class="btn-box">
          <router-link :to="'/question/'+ info.contentId" class="msg">给我留言</router-link>
          <a class="tel" :href="'tel:'+info.sponsorTel">电话联系</a>
        </div>
      </div>
      <div class="operation clearfix">
        <span class="delete" @click="deleteOrder" v-if=" info.state == RAISED || info.state == RAISEFAILED || info.state == LOSER">删除订单</span>
        <span class="btn" @click="remind" v-if=" info.state == NODISPATCH">提醒发货</span>
        <span class="btn" @click="payment" v-if=" info.state == NOPAY">立即支付</span>
        <span class="btn" @click="abolishOrder" v-if=" info.state == NOPAY">取消订单</span>
        <router-link class="btn" :to="'/refundDetails/' + orderCode" v-if=" info.state == RAISEFAILED">退款详情</router-link>
        <span class="btn" @click="confirmReceipt" v-if=" info.state == NORECEIVE || info.state == EXCHANGEING">确认收货</span>
        <router-link class="btn" :to="'/exchange/' + orderCode" v-if=" info.state == NORECEIVE">申请换货</router-link>
        <span class="btn" @click="abolishExchange" v-if=" info.state == EXCHANGEING">取消换货</span>
        <router-link class="btn" :to="'/exchangeDetails/' + orderCode" v-if=" info.state == EXCHANGEING">换货进度</router-link>
        <router-link class="btn" :to="'/logistics/' + orderCode" v-if=" info.state == NORECEIVE || info.state == EXCHANGEING">查看物流</router-link>
      </div>
    </div>
    <Confirm :info="confirmInfo" @confirm="confirm" v-show="confirmState"></Confirm>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
import Pay from '@/components/Pay'
import Confirm from '@/components/Confirm'

export default {
  props: ['apiURL', 'id'],
  mixins: [Pay],
  data () {
    return {
      tip: '',
      show: false,
      info: {},
      type: '',
      confirmInfo: {
        title: '提示',
        name: '您确定要删除此条回复？'
      },
      confirmState: false,
      RAISED: '众筹结束',
      RAISEFAILED: '众筹失败',
      LOSER: '未中奖',
      NOPAY: '待付款',
      REFUNDING: '退款中',
      NODISPATCH: '待发货',
      NORECEIVE: '待收货',
      // PRODUCTRETURN: '商品回报',
      GRATISRETURN: '无偿支持',
      GRATISETURN: '待收货',
      EXCHANGEING: '换货中'
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '订单'
      if (this.orderCode && this.id) {
        this.$http.get(this.apiURL + 'member/order/view.jhtml?orderCode=' + this.orderCode + '&wxbdopenId=' + this.id).then((response) => {
          this.$indicator.close()
          this.info = response.data
          this.show = true
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      } else {
        this.$indicator.close()
      }
    },
    confirm: function (val) {
      this.confirmState = false
      if (val && this.type === 'confirmReceipt') {
        this.$http.get(this.apiURL + 'member/order/confirm_receipt.jhtml?orderCode=' + this.orderCode + '&wxbdopenId=' + this.id).then((response) => {
          this.info.state = 'RAISED'
        }, () => {
          alert('请求失败')
        })
      } else if (val && this.type === 'deleteOrder') {
        this.$http.get(this.apiURL + 'member/order/delete.jhtml?orderCode=' + this.orderCode + '&wxbdopenId=' + this.id).then((response) => {
          if (response.data.state) {
            this.$router.go(-1)
          }
        }, () => {
          this.$indicator.close()
          alert('删除失败')
        })
      } else if (val && this.type === 'abolishOrder') {
        this.$http.get(this.apiURL + 'member/order/cancel.jhtml?orderCode=' + this.orderCode + '&wxbdopenId=' + this.id).then((response) => {
          this.$router.go(-1)
        }, () => {
          this.$indicator.close()
          alert('取消失败')
        })
      } else if (val && this.type === 'abolishExchange') {
        this.$http.get(this.apiURL + 'member/order/stopExchange.jhtml?orderCode=' + this.orderCode + '&wxbdopenId=' + this.id).then((response) => {
          this.info.state = '待收货'
        }, () => {
          this.$indicator.close()
          alert('取消换货失败')
        })
      }
    },
    confirmReceipt: function (item) {
      this.confirmState = true
      this.type = 'confirmReceipt'
      this.confirmInfo.name = '您确定已经收到货品？'
    },
    deleteOrder: function (item) {
      this.confirmState = true
      this.type = 'deleteOrder'
      this.confirmInfo.name = '您确定删除此订单？'
    },
    abolishOrder: function () {
      this.confirmState = true
      this.type = 'abolishOrder'
      this.confirmInfo.name = '您确定取消此订单？'
    },
    abolishExchange: function () {
      this.confirmState = true
      this.type = 'abolishExchange'
      this.confirmInfo.name = '您确定取消此换货申请？'
    },
    remind: function (item) {
      this.$http.get(this.apiURL + 'member/order/shipWarn.jhtml?orderCode=' + this.item.orderCode + '&wxbdopenId=' + this.id).then((response) => {
        alert('提醒成功')
      }, () => {
        this.$indicator.close()
        alert('提醒失败')
      })
    },
    payment: function (item) {
      this.pay(item.data)
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  },
  watch: {
   // 如果路由有变化，会再次执行该方法
    $route () {
      this.$indicator.close()
    },
    id: function () {
      this.getCustomers()
    }
  },
  components: {
    Confirm
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
.order-details{
  margin-bottom:3rem;
  color: #666;
  font-size: 0.6rem;
  .item-tit{
    display: inline-block;
    width: 3.6rem;
    vertical-align: top;
  }
  .item-con{
    margin-left: -0.5rem;
    display: inline-block;
    width: 13.6rem;
  }
  .address{
    padding:0.6rem 2.4rem 0.8rem;
    background:#ffffff;
    position:relative;
    margin-top: 0.8rem;
    p{
      line-height:1rem;
      padding:0.2rem 0 0;
      font-size:0.6rem;
    }
    &:before, &:after{
      content:"";
      position:absolute;
      left:0;
      width:100%;
      height:0.2rem;
      background:url("../../image/orderLine.png") repeat-x 0 0;
      background-size: auto 0.2rem;
    }
    &:before{
      top:0;
    }
    &:after{
      bottom:0;
    }
    .bg-local{
      position:absolute;
      left:0.9rem;
      top: 50%;
      width:0.7rem;
      height:0.98rem;
      margin-top: -0.49rem;
      background:url("../../image/orderLocal.png") no-repeat 0 0;
      background-size: contain;
    }
    .bg-right{
      position:absolute;
      right:0.9rem;
      top:50%;
      width:0.34rem;
      height:0.58rem;
      margin-top: -0.29rem;
      background:url("../../image/orderRight.png") no-repeat 0 0;
      background-size: contain;
    }
  }
  .con-list{
    background:#ffffff;
    margin-top: 0.8rem;
    margin-bottom: 0.5rem;
    .item{
      border-bottom:1px solid #cccccc;
      line-height:1rem;
      padding: 0.5rem 0.5rem;
      &:last-of-type{
        border:none;
      }
    }
  }
  .money{
    padding: 0 0.5rem;
    margin-bottom: 0.5rem;
    background:#ffffff;
    .show{
      padding: 0.2rem 0;
      line-height: 1.5rem;
      .item-con{
        text-align: right;
      }
    }
    .total{
      border-top: 1px solid #ccc;
      line-height: 2rem;
      text-align: right;
      .total-tit{
        color: #333;
        font-size: 0.68rem;
      }
    }
  }
  .operation{
    line-height: 1.4rem;
    padding: 0.5rem;
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    .delete{
      padding: 0 0.5rem;
      float: left;
    }
    .btn{
      padding: 0 0.5rem;
      float: right;
      border: 1px solid #ccc;
      margin-left: 0.5rem;
      border-radius: 0.1rem;
      color: #333;
      &.act{
        color: #cc0000;
        border: 1px solid #cc0000;
      }
    }
  }
  .author{
    padding: 0.8rem;
    background: #fff;
    margin-bottom: 0.5rem;
    .info{
      font-size: 0.7rem;
      color: #333;
      .img-wrap{
        display: inline-block;
        width: 2.5rem;
        height: 2.5rem;
        background: #ccc;
        vertical-align: middle;
        margin-right: 0.5rem;
        border-radius: 50%;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .btn-box{
      font-size: 0;
      text-align: center;
      padding-top: 0.6rem;
      .btn{
        font-size: 0.7rem;
        display: inline-block;
        width: 5rem;
        padding-left: 1rem;
        line-height: 1.5rem;
        text-align: center;
        border: 1px solid #999;
        border-radius: 0.1rem;
        color: #333;
      }
      .msg{
        .btn;
        background: url("../../image/msg.png") no-repeat 0.8rem center;
        background-size: 1.2rem;
        margin-right: 1.4rem;
      }
      .tel{
        .btn;
        background: url("../../image/tel.png") no-repeat 1rem center;
        background-size: 1rem;
      }
    }
  }
}
</style>
