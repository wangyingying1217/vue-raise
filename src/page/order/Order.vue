<template>
  <div v-if="show">
    <div v-if="info.type === GRATIS" class="gratis">
      <p class="title">感谢您的无私支持</p>
      <div class="support-money">
        <ul class="money-list clearfix">
          <li v-for="(item, index) in priceList" :key="index" :class="{'act':tabIndex == index}" @click="chooseMoney(index)">{{item}}元</li>
        </ul>
        <input type="number" placeholder="支持其他金额（不低于1元）" v-model="money" @input="otherMoney">
      </div>
      <div class="support-tel">
        <input type="tel" placeholder="输入手机号，项目成功或失败时退款通知（选填）" v-model="Tel">
      </div>
      <div class="support-total">
        支持总额
        <span>￥{{totalMoney}}</span>
      </div>
    </div>
    <div v-else class="order">
      <p class="title" v-html="info.title"></p>
      <router-link class="address" to="/orderAddress" tag="div">
        <div class="bg-local"></div>
        <div v-show="info.receiver">
          <p>收货人：{{info.consignee}}
            <span class="fr">{{info.phone}}</span>
          </p>
          <p>收货地址：{{info.areaName+info.address}}</p>
        </div>
        <div v-show="!info.receiver" class="no-address">请先添加收货地址</div>
        <div class="bg-right"></div>
      </router-link>
      <ul class="con-list">
        <li>
          <span class="list-tit">支持金额</span>
          <div class="money">￥{{parseFloat(info.money).toFixed(2)}}</div>
        </li>
        <li>
          <span class="list-tit">份数</span>
          <div class="amount fr">
            <span v-show="num > 1" @click="subtract()">-</span>
            <input type="number" v-model="num" @blur="checkNum(item)">
            <span v-show="!info.isLimit || (info.isLimit && num < info.lotNum)" @click="add()">+</span>
          </div>
        </li>
        <li>
          <span class="list-tit">支持总额</span>
          <div class="money clRed">￥{{totalMoney.toFixed(2)}}（运费￥{{freight.toFixed(2)}}）</div>
        </li>
        <li>
          <span class="list-tit">备注</span><!--
          --><input class="remark" type="text" v-model="remark">
        </li>
        <li v-if="info.type === NORMAL">
          <span class="list-tit">运输方式</span><!--
          --><div class="radio-wrapper">
            <label>
              <input type="radio" name="transport" value="normal" v-model="transport">
              <span class="outCircle"><span class="innerCircle"></span></span>
              <span class="text">普通快递</span>
            </label>
            <label>
              <input type="radio" name="transport" value="fast" v-model="transport">
              <span class="outCircle"><span class="innerCircle"></span></span>
              <span class="text">顺丰快递（到付）</span>
            </label>
          </div>
        </li>
        <li v-if="info.type === NORMAL && info.invoice != '不开发票'">
          <div>
            <span class="list-tit">发票</span><!--
            --><div class="radio-wrapper">
              <label>
                <input type="radio" name="invoice" value="no" v-model="invoice">
                <span class="outCircle"><span class="innerCircle"></span></span>
                <span class="text">无</span>
              </label>
              <label>
                <input type="radio" name="invoice" value="normal" v-model="invoice">
                <span class="outCircle"><span class="innerCircle"></span></span>
                <span class="text">普通发票</span>
              </label>
              <label v-if="info.invoice == '增值税发票'">
                <input type="radio" name="invoice" value="VTA" v-model="invoice">
                <span class="outCircle"><span class="innerCircle"></span></span>
                <span class="text">增值税发票</span>
              </label>
            </div>
          </div>
          <div v-show="invoice != 'no'">
            <span class="list-tit-small">发票抬头</span><!--
            --><input type="text" name="invoiceTitle" v-model="invoiceTitle">
          </div>
          <div v-show="invoice == 'VTA'">
            <span class="list-tit-small">纳税人识别码</span><!--
            --><input type="text" name="TaxpayerNum" v-model="TaxpayerNum">
          </div>
          <div v-show="invoice == 'VTA'">
            <span class="list-tit-small">注册地址</span><!--
            --><input type="text" name="registeredAddress" v-model="registeredAddress">
          </div>
          <div v-show="invoice == 'VTA'">
            <span class="list-tit-small">注册电话</span><!--
            --><input type="text" name="registeredTel" v-model="registeredTel">
          </div>
          <div v-show="invoice == 'VTA'">
            <span class="list-tit-small">开户银行</span><!--
            --><input type="text" name="OpeningBank" v-model="OpeningBank">
          </div>
          <div v-show="invoice == 'VTA'">
            <span class="list-tit-small">银行账户</span><!--
            --><input type="text" name="bankAccount" v-model="bankAccount">
          </div>
        </li>
      </ul>
    </div>
    <div class="submit-btn" @click="confirm"><a class="act">立即支持</a></div>
    <Tip :info="tip"></Tip>
    <transition name="slide-fade">
      <router-view :apiURL="apiURL" :id="id" :type="'order'" @info="getAddress"></router-view>
    </transition>
  </div>
</template>

<script>
import Tip from '@/components/Tip'
import Pay from '@/components/Pay'

export default {
  props: ['apiURL', 'id'],
  mixins: [Pay],
  data () {
    return {
      show: false,
      info: {},
      tip: {
        text: ''
      },
      priceList: [10, 20, 30],
      tabIndex: 0,
      money: '',
      Tel: '',
      num: 1,
      remark: '',
      invoice: 'no',
      transport: 'normal',
      invoiceTitle: '',
      TaxpayerNum: '',
      registeredAddress: '',
      registeredTel: '',
      OpeningBank: '',
      bankAccount: '',
      GRATIS: '无偿支持',
      LOTTERY: '抽奖回报',
      NORMAL: '商品回报'
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '订单'
      if (this.supportId && this.id) {
        this.$http.get(this.apiURL + 'supportRefer.jhtml?id=' + this.supportId + '&wxbdopenId=' + this.id).then((response) => {
          this.info = response.data
          if (this.info.isLimit && this.info.lotNum === 0) {
            this.num = 0
          }
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      } else {
        this.$indicator.close()
      }
    },
    add: function () {
      if (!this.info.isLimit || (this.info.isLimit && this.num < this.info.lotNum)) {
        this.num++
      }
    },
    subtract: function () {
      if (this.num > 1) {
        this.num--
      }
    },
    checkNum: function () {
      if (!this.info.isLimit || (this.info.isLimit && this.num < this.info.lotNum)) {
        this.num = this.info.lotNum
        alert('超过了限定的数量')
      }
    },
    getAddress: function (item) {
      this.userName = item.consignee
      this.Tel = item.phone
      this.address = item.areaName + item.address
      this.info.receiver = true
    },
    chooseMoney: function (index) {
      this.money = ''
      this.tabIndex = index
    },
    otherMoney: function () {
      if (Number(this.money) && Number(this.money) > 0) {
        this.tabIndex = 99
      } else {
        this.money = ''
        this.tabIndex = 0
      }
    },
    confirm: function () {
      if (this.info.type === this.GRATIS) {
        if (this.registeredTel && !/^1[3|4|5|7|8][0-9]{9}$/.test(this.Tel)) {
          this.tip.text = '电话号码错误'
        } else {
          this.pay(this.submitData)
        }
      } else {
        if (!this.info.receiver) {
          this.tip.text = '请先添加收货地址'
        } else if (this.invoice === 'VTA') {
          if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.invoiceTitle)) {
            this.tip.text = '发票抬头不能为空'
          } else if (!/^[0-9]{15}$/.test(this.TaxpayerNum)) {
            this.tip.text = '纳税人识别码错误'
          } else if (!/[u4e00-u9fa5]/.test(this.registeredAddress)) {
            this.tip.text = '注册地址必须包含汉字'
          } else if (!/^1[3|4|5|7|8][0-9]{9}$/.test(this.registeredTel)) {
            this.tip.text = '注册电话错误'
          } else if (!/[u4e00-u9fa5]/.test(this.OpeningBank)) {
            this.tip.text = '开户银行必须包含汉字'
          } else if (!/^(\d{16}|\d{19})$/.test(this.bankAccount)) {
            this.tip.text = '银行账户错误'
          } else {
            this.pay(this.submitData)
          }
        } else if (this.invoice === 'normal') {
          if (!/\s{0,}[\S]{1,}[\s\S]{0,}/.test(this.invoiceTitle)) {
            this.tip.text = '发票抬头不能为空'
          } else {
            this.pay(this.submitData)
          }
        } else {
          this.pay(this.submitData)
        }
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
      this.$indicator.close()
    },
    id: function () {
      this.getCustomers()
    }
  },
  components: {
    Tip
  },
  computed: {
    supportId: function () {
      return this.$route.params.supportId
    },
    freight: function () {
      let freight = 0
      if (this.info.type === this.NORMAL && this.transport === 'normal') {
        freight = parseFloat(this.info.freight)
      }
      return freight
    },
    totalMoney: function () {
      let money = ''
      if (this.info.type === this.GRATIS) {
        money = parseFloat(this.money) || this.priceList[this.tabIndex]
      } else {
        money = this.info.money * this.num + this.freight
      }
      return money
    },
    submitData: function () {
      let data = {}
      data.id = this.supportId
      data.wxbdopenId = this.id
      data.money = this.totalMoney
      data.contentId = this.info.contentId
      data.cshId = this.info.cshId
      data.type = this.info.type
      data.state = localStorage.getItem('state')
      if (this.info.type === this.GRATIS) {
        data.tel = this.Tel
      } else {
        data.userName = this.info.consignee
        data.tel = this.info.phone
        data.address = this.info.address
        data.areaName = this.info.areaName
        data.remark = this.remark
        data.unitPrice = this.info.money
        data.num = this.num
        data.freight = this.freight
        if (this.invoice === 'VTA') {
          data.invoiceType = '增值税发票'
          data.invoiceTitle = this.invoiceTitle
          data.TaxpayerNum = this.TaxpayerNum
          data.registeredAddress = this.registeredAddress
          data.registeredTel = this.registeredTel
          data.OpeningBank = this.OpeningBank
          data.bankAccount = this.bankAccount
        } else if (this.invoice === 'normal') {
          data.invoiceType = '普通发票'
          data.invoiceTitle = this.invoiceTitle
        } else if (this.invoice === 'no') {
          data.invoiceType = '不开发票'
        }
      }
      return data
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.title{
  height:2.2rem;
  line-height:2.2rem;
  padding:0 0.9rem;
  font-size:0.7rem;
}
.order{
  padding-bottom:3rem;
  .address{
    padding:0.6rem 2.4rem 0.8rem;
    background:#ffffff;
    position:relative;
    margin:0 0 0.8rem;
    .no-address{
      font-size: 0.7rem;
      padding: 0.4rem 0 0.2rem;
    }
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
    padding-bottom: 0.5rem;
    > li{
      border-bottom:1px solid #cccccc;
      padding:0 0.85rem;
      line-height:2rem;
      &:last-of-type{
        border:none;
      }
    }
    input, textarea{
      width:12rem;
      height:1.5rem;
      text-indent:0.5rem;
      box-sizing:border-box;
      border:1px solid #cccccc;
      vertical-align:middle;
      font-size:0.6rem;
      background:0;
    }
    .remark{
      border:none;
    }
    .radio-wrapper{
      width: 12rem;
      line-height: 0.8rem;
      display: inline-block;
      vertical-align: middle;
    }
    .list-tit{
      display: inline-block;
      font-size:0.7rem;
      color:#666666;
      width:4.2rem;
    }
    .list-tit-small{
      display: inline-block;
      font-size:0.6rem;
      color:#666666;
      width:4.2rem;
    }
    .amount{
      padding-top: 0.2rem;
      font-size: 0;
      box-sizing: border-box;
      height: 2rem;
      span{
        display: inline-block;
        width:1.2rem;
        height:1.2rem;
        font-size: 0.6rem;
        line-height:1.2rem;
        text-align:center;
        background:#f5f5f5;
      }
      input{
        width:1.4rem;
        height:1.1rem;
        font-size: 0.6rem;
        vertical-align: baseline;
        box-sizing:border-box;
        border:0.05rem solid #cccccc;
        border-radius:0.15rem;
        margin:0 0.42rem;
        text-align: center;
        text-indent: 0;
      }
    }
    .money{
      float: right;
      font-size: 0.6rem;
    }
  }
}
/*order  E*/

/*gratis  S*/
.gratis{
  font-size:0.6rem;
  .title{
    padding:0 0.6rem;
    height:2.2rem;
    line-height:2.2rem;
    font-size:0.7rem;
    color:#666666;
  }
  .support-money{
    padding:0.8rem 0.6rem;
    border-top:1px solid #cccccc;
    border-bottom:1px solid #cccccc;
    background:#ffffff;
    margin-bottom:0.5rem;
    input[type="text"]{
      padding-left:1.17rem;
      background:url("../../image/money.png") no-repeat 0.45rem center;
      background-size: 0.75rem;
    }
  }
  input{
    width:100%;
    height:1.6rem;
    box-sizing:border-box;
    border:0.05rem solid #cccccc;
    border-radius:0.15rem;
    font-size:0.6rem;
    text-indent:0.45rem;
    background:0;
  }
  .money-list{
    margin-bottom:0.8rem;
    li{
      float:left;
      position:relative;
      width:5.2rem;
      height:1.5rem;
      line-height:1.42rem;
      text-align:center;
      font-size:0.6rem;
      box-sizing:border-box;
      border:0.05rem solid #cccccc;
      border-radius:0.15rem;
      margin-right:0.6rem;
      &:last-of-type{
        margin-right:0;
      }
      &.act{
        border-color:#cc0000;
        &:after{
          content:"";
          position:absolute;
          right:-1px;
          top:-1px;
          width:0.9rem;
          height:0.9rem;
          background:url("../../image/right_top.png") no-repeat 0 0;
          background-size: contain;
        }
      }
    }
  }
  .support-tel{
    padding:0.8rem 0.6rem;
    background:#ffffff;
    border-top:1px solid #cccccc;
    border-bottom:1px solid #cccccc;
  }
  .support-total{
    height:2.2rem;
    line-height:2.2rem;
    font-size:0.7rem;
    padding:0 0.6rem;
    background:#ffffff;
    border-bottom:1px solid #cccccc;
    span{
      float:right;
      color:#cc0000;
    }
  }
}
/*gratis  E*/
</style>
