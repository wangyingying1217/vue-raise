<template>
  <ul class="raise-pre">
    <li v-for="(item, index) in info" :key="index">
      <router-link :to="type === 'myOrder' ? '/orderDetails/'+item.orderCode : '/raiseInfo/'+item.contentId" tag="div">
        <div class="con-wrapper" v-drag="type">
          <div class="con-img">
            <img :src="item.picsrc" alt="pic"/>
          </div>
          <div class="con-info">
            <h2 class="con-tit" v-html="item.title"></h2>
            <div class="con-text"  v-if="type !== 'myOrder'">
              <span>{{item.stime}}-{{item.etime}}</span>
              <span class="raise-state">{{item.state}}</span>
            </div>
            <div class="con-price" v-if="type === 'myOrder'">
              <span class="price">￥{{item.unitPrice}}</span>
              <span class="num">x{{item.num}}</span>
              <span class="raise-state">{{item.state}}</span>
            </div>
            <div class="percent-wrapper"  v-if="type !== 'myOrder'">
              <div class="percent">
                <p :style="'width:'+item.progress"></p>
              </div>
              <span class="percent-num act" v-if="item.state == RAISEING || item.state == CLEARING || item.state == SUCCEED || item.state == RETURNING || item.state == FINISHED || item.state == FAILED || item.state === SLECTING">{{item.progress | progress}}</span>
              <span class="percent-num" v-else>--%</span>
            </div>
            <div class="count-group">
              <span class="percent" v-if="type === 'myOrder'">{{item.progress | progress}}</span>
              <span class="money act" v-if="item.state == RAISEING || item.state == CLEARING || item.state == SUCCEED || item.state == RETURNING || item.state == FAILED || item.state == FINISHED || item.state === SLECTING">{{item.raiseAmount | num}}</span>
              <span class="money" v-else-if="type === 'myOrder'">{{item.raiseAmount | num}}</span>
              <span class="money" v-else>--</span>
              <span class="support act" v-if="item.state == RAISEING || item.state == CLEARING || item.state == SUCCEED || item.state == RETURNING || item.state == FAILED || item.state == FINISHED || item.state === SLECTING">{{item.support | num}}</span>
              <span class="support"  v-else-if="type === 'myOrder'">{{item.support | num}}</span>
              <span class="support"  v-else>--</span>
              <span class="date act" v-if="type !== 'myOrder' && item.state == RAISEING|| item.state == PASSED || item.state == PREHEATING || item.state === SLECTING">{{item.timeLeft}}</span>
              <span class="date" v-else-if="type !== 'myOrder'">--</span>
            </div>
          </div>
        </div>
        <span class="delete" @click.stop="remove(item.concernId)" v-if="type === 'delete'">删除</span>
      </router-link>
      <p class="total-money" v-if="type === 'myOrder'">共{{item.num}}件商品&nbsp;&nbsp;&nbsp;&nbsp;合计：￥{{item.money}}（含运费￥{{item.money}}）</p>
      <div class="interaction" v-if="type === 'myRaise'">
        <router-link :to="'/returnProgress/' + item.contentId" v-if=" item.state == RETURNING">回报进展</router-link>
        <router-link :to="'/supportRecord/' + item.contentId" v-if=" item.state == SUCCEED || item.state == RAISEING || item.state == CLEARING">支持记录</router-link>
        <router-link :to="'/Dynamic/' + item.contentId" v-if=" item.state == RAISEING || item.state == PASSED || item.state == PREHEATING || item.state == CLEARING || item.state == SUCCEED || item.state == RETURNING">发表动态</router-link>
        <router-link :to="'/modifyRaise/return/' + item.contentId" v-if=" item.state == RAISEING || item.state == PASSED || item.state == PREHEATING">添加回报</router-link>
        <a @click="$emit('endRaise', item.contentId)" v-if=" item.state == RAISEING">终止众筹</a>
        <a @click="$emit('abolishRaise', item.contentId)" v-if=" item.state == PASSED || item.state == PREHEATING">废止众筹</a>
        <a @click="$emit('supplement', {contentId: item.contentId, cshId: item.cshId, money: item.money})" v-if=" item.state == CLEARING && parseInt(item.progress) < 100 ">余款补齐</a>
        <router-link :to="'/reason/' + item.contentId" v-if=" item.state == NOPASSED">查看原因</router-link>
        <router-link :to="'/modifyRaise/raise/' + item.contentId" v-if=" item.state == NOPASSED">修改众筹</router-link>
        <a @click="$emit('deleteRaise', item.contentId)" v-if=" item.state == NOPASSED || item.state == FINISHED  || item.state == ABOLISHED || item.state == FAILED">删除众筹</a>
      </div>
      <div class="interaction" v-if="type === 'myOrder'&& item.state !== RAISEING">
        <router-link :to="'/logistics/' + item.orderCode" v-if=" item.state == RETURNING && item.type == NORECEIVE">查看物流</router-link>
        <a @click="$emit('confirmReceipt', item)" v-if=" item.state == RETURNING && item.type == NORECEIVE">确认收货</a>
        <router-link :to="'/refundDetails/' + item.orderCode" v-if=" item.state == RAISEFAILED">退款详情</router-link>
        <a @click="$emit('deleteOrder', item)" v-if=" item.state == RAISED || item.state == RAISEFAILED || item.state == LOSER || item.state == CLOSED">删除订单</a>
        <a @click="$emit('abolishOrder', item)" v-if=" item.state == NOPAY">取消订单</a>
        <a @click="$emit('payment', item)" v-if=" item.state == NOPAY">立即支付</a>
        <a @click="$emit('remind', item)" v-if=" item.state == RETURNING && item.type == NODISPATCH ">提醒发货</a>
      </div>
    </li>
  </ul>
</template>

<script>
const width = 2.7
const posLeft = '-' + width + 'rem'

export default {
  props: ['info', 'type'],
  data () {
    return {
      CHECKING: '审核中',
      PASSED: '已通过',
      NOPASSED: '未通过',
      PREHEATING: '预热中',
      RAISEING: '众筹中',
      CLEARING: '结算中',
      SUCCEED: '已成功',
      RETURNING: '回报中',
      FINISHED: '已完毕',
      ABOLISHED: '已废止',
      FAILED: '已失败',
      RAISED: '众筹结束',
      RAISEFAILED: '众筹失败',
      CLOSED: '交易关闭',
      LOSER: '未中奖',
      NOPAY: '待付款',
      NODISPATCH: '待发货',
      NORECEIVE: '待收货',
      SLECTING: ''
    }
  },
  methods: {
    remove: function (id) {
      this.$emit('removeRaise', id)
    }
  },
  directives: {
    'drag': function (el, state) {
      if (state.value === 'delete') {
        el.ontouchstart = (ev) => {
          var DOM = document.getElementsByClassName('con-wrapper')
          for (var i = 0; i < DOM.length; i++) {
            DOM[i].style.left = 0
          }
          var disX = ev.targetTouches[0].clientX - el.offsetLeft
          var leftStart = el.style.left
          var left = 0
          if (leftStart === posLeft) {
            el.style.transition = 'left .5s'
            el.style.left = 0
            setTimeout(function () {
              el.style.transition = ''
            }, 500)
          } else {
            el.ontouchmove = function (ev) {
              left = (ev.targetTouches[0].clientX - disX) * 18 / document.documentElement.clientWidth
              if ((leftStart === posLeft && left > -width) || (leftStart !== posLeft && left < 0)) {
                el.style.left = left + 'rem'
              }
            }
            el.ontouchend = function () {
              if (left < -0.6) {
                el.style.transition = 'left .5s'
                el.style.left = posLeft
                setTimeout(function () {
                  el.style.transition = ''
                }, 500)
              } else if (left > -0.6) {
                el.style.transition = 'left .5s'
                el.style.left = 0
                setTimeout(function () {
                  el.style.transition = ''
                }, 500)
              }
              el.ontouchmove = null
              el.ontouchend = null
            }
          }
        }
      }
    }
  },
  filters: {
    num: function (val) {
      let num = val
      if (val >= 1000) {
        num = val / 10000 + '万'
      } else if (val >= 1000000) {
        num = val / 100000000 + '千万'
      }
      return num
    },
    progress: function (val) {
      let num = parseFloat(val)
      if (num < 10) {
        num = num.toFixed(2)
      } else if (num < 99) {
        num = Math.round(num)
      } else if (num < 999) {
        num = parseInt(num)
      } else {
        num = '999+'
      }
      return num + '%'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less' scoped>
@import '../style/base.less';

.raise-pre{
  position: relative;
  z-index: 0;
  li{
    font-size:0;
    position: relative;
    background: #f5f5f5;
    padding-top: 5rem;
    margin-bottom: 0.5rem;
    z-index: 0;
    .con-wrapper{
      position: absolute;
      left: 0px;
      top: 0px;
      z-index: 2;
      width: 18rem;
      height: 5rem;
      padding:0.5rem 0.5rem;
      background: #fff;
      border: 1px solid #fff;
      box-sizing: border-box;
      .con-img{
        .img-wrap(5.6rem,4rem);
        .border(1px,#ccc);
      	margin-right: 0.5rem;
        vertical-align:top;
        box-sizing: border-box;
      }
      .con-info{
      	display:inline-block;
      	width:10.8rem;
      }
      .con-tit{
      	font-size:0.8rem;
      	font-weight:normal;
        .text-overflow;
      }
      .con-text,.con-price{
        font-size:0.6rem;
      	line-height:0.9rem;
      	padding:0.3rem 0;
      }
      .con-price{
        margin: 0.4rem 0 0.1rem;
        .price {
          display: inline-block;
          color: #cc0000;
          width: 2.5rem;
          margin-right: 0.5rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .num {
          display: inline-block;
          width: 2.5rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .raise-state{
        float: right;
        line-height:0.9rem;
        padding: 0 0.6rem;
        background: #cc0000;
        color: #fff;
      }
      .percent-wrapper{
      	font-size:0.6rem;
        height: 0.6rem;
        display: flex;
        align-items: center;
        text-align: right;
        .percent{
          width:8.4rem;
          height:0.2rem;
          border-radius:0.1rem;
          background:#e4e6e5;
          overflow:hidden;
          vertical-align: middle;
          p{
            height:100%;
            background:#cc0000;
          }
        }
        .percent-num{
          width:2rem;
          color: #999;
          &.act{
            color: #cc0000;
          }
        }
      }
      .count-group{
        span{
          display: inline-block;
          width: 3.5rem;
          font-size:0.6rem;
          color:#999999;
          margin-top: 0.26rem;
          padding:0.2rem 0 0.2rem 1.1rem;
          box-sizing: border-box;
          &.act{
            color: #cc0000;
          }
        }
        .percent{
          background: url("../image/percentGrey.png") no-repeat;
          background-size: 0.8rem;
        }
        .money{
          background: url("../image/moneyGrey.png") no-repeat;
          background-size: 0.8rem;
        }
        .support{
          background: url("../image/supportGrey.png") no-repeat;
          background-size: 0.8rem;
        }
        .date{
          background: url("../image/dateGrey.png") no-repeat;
          background-size: 0.8rem;
        }
      }
    }
    .delete{
    	position:absolute;
    	right:0;
    	top:0;
    	width:2.7rem;
    	height:5rem;
    	line-height:5rem;
    	font-size:0.8rem;
    	text-align:center;
    	color:#ffffff;
    	background:#cc0000;
    }
    .interaction{
      padding: 0.4rem 0.5rem;
      border-top: 1px solid #ccc;
      margin-top: 2px;
      background: #fff;
      text-align: right;
      a{
        display: inline-block;
        width: 3.5rem;
        font-size: 0.6rem;
        line-height: 1.2rem;
        text-align: center;
        margin-left: 0.5rem;
        color: #333;
        .border(1px,#ccc);
        border-radius: 0.1rem;
      }
    }
    .total-money{
      height: 2rem;
      line-height: 2rem;
      padding: 0 0.5rem;
      text-align: right;
      font-size: 0.6rem;
      overflow: hidden;
      background: #fff;
      border-top: 1px solid #ccc;
      box-sizing: border-box;
    }
  }
}
</style>
