<template>
  <div class="exchange" v-if="show">
    <form :action="apiURL+'member/order/exchange.jhtml'" method="post" ref="exchange" v-if="info.state">
      <div v-show="state === ''">
        <div class="product-list">
          <div class="product-tit">
            <span class="tit-info">商品信息</span>
            <span class="tit-num">数量</span>
            <span class="tit-exnum">换货数量</span>
          </div>
          <div class="product-item" v-for="(item, index) in info.product" :key="index">
            <span class="check" :class="{'act':item.check}" @click="item.check=!item.check"></span>
            <div class="con-img">
              <img :src="item.pic" alt="pic"/>
            </div>
            <div class="con-info">
              <div class="con-tit" v-html="item.title"></div>
              <div class="con-author">作者：{{item.authors}}</div>
            </div>
            <div class="con-num">{{item.num}}</div>
            <div class="con-exnum">
              <span class="exnum-wrapper">
                <span class="subtract" @click.stop="subtract(item)">-</span>
                <input class="exnum-input" type="number" v-model="item.exNum" @click.stop @blur="checkNum(item)">
                <span class="add" @click.stop="add(item)">+</span>
              </span>
            </div>
          </div>
          <input type="hidden" name="exchangeInfo" :value="JSON.stringify(exchangeInfo)">
        </div>
        <div class="edit">
          <p class="edit-tit">问题描述</p>
          <div class="text-wraper">
            <textarea class="text" maxlength="200" name="context" placeholder="请输入你的问题描述" v-model="textarea"></textarea>
            <p class="count">{{textarea.length}}/200</p>
          </div>
          <div class="img-box">
            <div class="img" v-for="(item, index) in imgArr" :key="index" @click="imgArr.splice(index,1)" :style="{'background': 'url('+item+') no-repeat 0 0/cover'}">
              <input type="hidden" :name="'pic'+index" :value="imgArr[index]">
            </div>
            <Upload :apiURL="apiURL" :id="id" @pic="(url) => {imgArr.push(url)}" v-show="imgArr.length < 5" class="img-add"></Upload>
            <div class="img-text" v-show="imgArr.length == 0">
              为了帮助我们更好的解决问题，请上传照片。最多5张，每张不超过5M。
            </div>
          </div>
        </div>
        <div class="list-list">
          <div class="list-item">
            <span class="list-span">收货人：</span>
            <input class="list-text" type="text" name="consignee" :value="info.consignee">
          </div>
          <div class="list-item">
            <span class="list-span">手机号码：</span>
            <input class="list-text" type="tel" name="phone" :value="info.phone">
          </div>
          <div class="list-item region" @click="state='province'">
            <span class="list-span">所在地区：</span>{{info.areaName}}
            <input class="list-text" type="hidden" name="areaName" :value="info.areaName">
          </div>
          <div class="list-item">
            <span class="list-span">详细地址：</span>
            <input class="list-text" type="text" name="address" :value="info.address">
          </div>
        </div>
        <div class="submit-btn">
          <a :class="{'act': !exchangeInfo.exchangeInfo.length && !textarea}"@click="confirm">确定</a>
        </div>
      </div>
      <input type="hidden" :value="id" name="wxbdopenId">
      <input type="hidden" :value="orderCode" name="orderCode">
      <input type="hidden" :value="codeState" name="state">
      <input type="hidden" :value="redirectUrl" name="redirect">
    </form>
    <p class="nodata" v-else>{{info.msg}}</p>
    <Tip :info.sync="tip"></Tip>
    <AddressList :state.sync="state" :apiURL="apiURL" @address="(val) => {info.areaName = val.replace(/\//g,'')}"></AddressList>
  </div>
</template>

<script>
import AddressList from '@/components/AddressList'
import Upload from '@/components/Upload'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: {product: []},
      tip: '',
      show: false,
      state: '',
      textarea: '',
      imgArr: [],
      region: ''
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '申请换货'
      if (this.id && this.orderCode) {
        this.$http.get(this.apiURL + 'member/order/apply/exchange.jhtml?wxbdopenId=' + this.id + '&orderCode=' + this.orderCode).then((response) => {
          if (response.data.state) {
            response.data.product.forEach(function (item) {
              item.exNum = 0
              item.check = false
            })
          }
          this.info = response.data
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          this.tip = '请求失败'
        })
      }
    },
    add: function (item) {
      if (item.exNum < item.num) {
        item.exNum++
      }
    },
    subtract: function (item) {
      if (item.exNum > 0) {
        item.exNum--
      }
    },
    checkNum: function (item) {
      if (item.exNum > item.num) {
        item.exNum = item.num
        this.tip = '超过了您购买的数量'
      }
    },
    confirm: function () {
      if (!this.exchangeInfo.exchangeInfo.length) {
        this.tip = '请选择将要换货的商品'
      } else if (!this.textarea) {
        this.tip = '换货说明不能为空呦~~'
      } else {
        this.$refs.exchange.submit()
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
    AddressList,
    Upload
  },
  computed: {
    orderCode: function () {
      return this.$route.params.orderCode
    },
    exchangeInfo: function () {
      let arr = []
      this.info.product.forEach(function (item) {
        if (item.check) {
          arr.push({
            orderItemId: item.orderItemId,
            exChangeQuantity: item.exNum
          })
        }
      })
      return {exchangeInfo: arr}
    },
    codeState: function () {
      return localStorage.getItem('state')
    },
    redirectUrl: function () {
      return location.href.split('#')[0] + '#/success/exchange'
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../../style/base.less';
.exchange{
  padding-bottom: 4rem;
  .product-list{
    margin: 0.5rem 0;
    background: #fff;
    .product-tit{
      display: flex;
      line-height: 2rem;
      font-size: 0.7rem;
      text-align: center;
      padding: 0 0.5rem;
      color: #999;
      .tit-info{
        width: 12rem;
      }
      .tit-num{
        width: 2rem;
      }
      .tit-exnum{
        width: 4rem;
      }
    }
    .product-item{
      display: flex;
      padding: 0 0.5rem 0.6rem;
      border: 1px solid #fff;
      box-sizing: border-box;
      align-items: center;
      font-size:0.6rem;
      .check{
        width: 0.8rem;
        height: 0.8rem;
        border: 1px solid #ccc;
        margin-right: 0.4rem;
        border-radius: 0.1rem;
        &.act{
          border: 1px solid #cc0000;
          background: url("../../image/correct-only.png") no-repeat center center;
          background-size: 0.6rem;
          background-color: #cc0000;
        }
      }
      .con-img{
        .img-wrap(4.2rem,3rem);
        .border(1px,#ccc);
      	margin-right: 0.3rem;
        box-sizing: border-box;
      }
      .con-info{
      	width:6rem;
        .con-tit{
          line-height:0.9rem;
          height:1.8rem;
          overflow: hidden;
          word-wrap: break-word;
        }
        .con-author{
          color:#999999;
          line-height:1rem;
          .text-overflow;
        }
      }
      .con-num{
        width: 2.6rem;
        text-align: center;
      }
      .con-exnum{
        .exnum-wrapper{
          display: flex;
          height: 1.2rem;
          line-height: 1.2rem;
          border: 1px solid #ccc;
          span{
            height: 100%;
            font-size: 0.6rem;
            text-align: center;
          }
        }
        .add,.subtract{
          width: 1rem;
        }
        .exnum-input{
          width: 1.2rem;
          padding: 0 0.1rem;
          font-size: 0.6rem;
          text-align: center;
          vertical-align: top;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          border-radius: 0;
        }
      }
    }
  }
  .edit{
    padding: 0 0.5rem 0.5rem;
    background: #fff;
    font-size: 0;
    margin-bottom: 0.5rem;
    .edit-tit{
      font-size: 0.7rem;
      line-height: 2rem;
    }
    .text-wraper{
      border-radius: 0.2rem;
      background: #f5f5f5;
      padding: 0.3rem 0.5rem 0;
      .text{
        font-size: 0.7rem;
        height:5rem;
        width: 100%;
        overflow: auto;
      }
      .count{
        line-height: 1.6rem;
        font-size: 0.6rem;
        text-align: right;
        margin-bottom: 0.5rem;
        color: #999;
      }
    }
    .img{
      display: inline-block;
      width: 3rem;
      height: 3rem;
      margin-right: 0.4rem;
      margin-bottom: 0.4rem;
      vertical-align: top;
      &:nth-of-type(5n){
        margin-right:0;
      }
    }
    .img-add{
      .img;
      font-size: 0.7rem;
      text-align: center;
      background: url("../../image/camera.png") no-repeat center 0.8rem;
      background-size: 1.6rem;
      margin-right: 0;
      color: #cdcdcd;
      background-color: #f5f5f5;
      line-height: 5.6rem;
    }
    .img-text{
      font-size: 0.6rem;
      display: inline-block;
      width: 12rem;
      color: #999;
      padding-top: 0.5rem;
      line-height: 1rem;
      margin-left: 0.5rem;
    }
  }
  .list-list{
    background: #fff;
    .list-item{
      position: relative;
      display: flex;
      line-height: 2rem;
      border-bottom: 1px solid #ccc;
      padding: 0 0.5rem;
      font-size: 0.7rem;
      &:last-of-type{
        border-bottom: none;
      }
      .list-span{
        width: 4rem;
        color: #999;
      }
      .list-text{
        font-size: 0.7rem;
      }
      &.region{
        background:url("../../image/orderRight.png") no-repeat 17rem center;
        background-size: 0.4rem;
      }
    }
  }
  .nodata{
  	position:absolute;
  	left:0;
  	right:0;
  	top:40%;
  	text-align:center;
  	font-size:0.8rem;
    padding: 0 1rem;
    line-height: 1.5rem;
  	color:#999;
  }
}
</style>
