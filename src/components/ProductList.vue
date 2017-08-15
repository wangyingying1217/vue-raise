<template>
  <ul class="raise-pre">
    <li v-for="(item, index) in info" :key="index">
      <!-- 商品链接 -->
      <div @click="turnTo">
        <div class="con-wrapper" v-drag="type">
          <!-- 商品图片 -->
          <div class="con-img">
            <img :src="item.picsrc" alt="pic"/>
          </div>
          <!-- 商品信息 -->
          <div class="con-info">
            <!-- 标题 -->
            <div class="con-tit">
              <span class="info-tit" v-html="item.title"></span>
              <span class="raise-state">{{item.state}}</span>
            </div>
            <!-- 作者 -->
            <div class="con-author">
              <p class="author">作者：{{item.authors}}</p>
            </div>
            <!-- 价格 -->
            <div class="con-price">
              <div class="price-wrapper">
                <span class="price" v-if="type !== 'inline'">￥{{item.unitPrice}}</span>
                <span class="num" v-if="type === 'inline' || type === 'myOrder'">x{{item.num}}</span>
              </div>
              <!-- 在线商品操作 -->
              <span class="tag-wrapper" v-if="type === 'inline'">
                <span class="tag">赠送</span>
                <span class="tag" v-if="item.type == 'book'">阅读</span>
                <span class="tag" v-if="item.type == 'database'">使用</span>
                <span class="tag" v-if="item.type == 'video'">播放</span>
              </span>
            </div>
          </div>
        </div>
        <!-- 取消关注 -->
        <span class="delete" @click.stop="remove(item.concernId)" v-if="type === 'delete'">删除</span>
      </div>
      <!-- 订单合计 -->
      <p class="total-money" v-if="type === 'myOrder'">共{{item.num}}件商品&nbsp;&nbsp;&nbsp;&nbsp;合计：￥{{item.money}}（含运费￥{{item.money}}）</p>
      <!-- 订单操作 -->
      <div class="interaction" v-if="type === 'myOrder'">
        <span v-if=" item.state == NODISPATCH">提醒发货</span>
        <span v-if=" item.state == NORECEIVE || item.state == REFUNDING">查看物流</span>
        <span v-if=" item.state == NORECEIVE || item.state == REFUNDING">确认收货</span>
        <span v-if=" item.state == CLOSED">钱款去向</span>
        <span v-if=" item.state == SUCCEED || item.state == CLOSED">删除订单</span>
        <span v-if=" item.state == NOPAY">取消订单</span>
        <span v-if=" item.state == NOPAY">立即付款</span>
      </div>
    </li>
  </ul>
</template>

<script>
const width = 2.7 // 删除按钮的宽度
const posLeft = '-' + width + 'rem'

export default {
  props: ['info', 'type'],
  data () {
    return {
      SUCCEED: '交易成功',
      CLOSED: '交易关闭',
      REFUNDING: '退款中',
      NOPAY: '待付款',
      NODISPATCH: '待发货',
      NORECEIVE: '待收货'
    }
  },
  methods: {
    // 取消关注
    remove: function (id) {
      this.$emit('removeProduct', id)
    },
    // 链接跳转（跳转到商品相关链接-没有完成）
    turnTo: function (item) {
      if (this.type === 'myOrder') {
        // localtion.href = ''
        alert('myOrder')
      } else if (this.type === 'inline') {
        alert('inline')
      }
    }
  },
  directives: {
    // 滑动操作
    'drag': function (el, state) {
      // 如果状态是可以删除才可以操作滑动操作
      if (state.value === 'delete') {
        // 触摸操作
        el.ontouchstart = (ev) => {
          // 每个节点都回复到最左侧
          var DOM = document.getElementsByClassName('con-wrapper')
          for (var i = 0; i < DOM.length; i++) {
            DOM[i].style.left = 0
          }
          // 手指距离节点左边距的位置
          var disX = ev.targetTouches[0].clientX - el.offsetLeft
          // 节点移动的left值
          var left = 0
          el.ontouchmove = function (ev) {
            // 节点移动的left值计算成rem单位
            left = (ev.targetTouches[0].clientX - disX) * 18 / document.documentElement.clientWidth
            // 手指只能向右滑动
            if (left < 0) {
              el.style.left = left + 'rem'
            }
          }
          // 松手操作
          el.ontouchend = function () {
            // 如果拖动节点移动距离大于0.6rem长度  显示删除按钮
            if (left < -0.6) {
              el.style.transition = 'left .5s'
              el.style.left = posLeft
              setTimeout(function () {
                el.style.transition = ''
              }, 500)
              // 如果拖动节点移动距离小于0.6rem长度，节点回到原位
            } else if (left > -0.6) {
              el.style.transition = 'left .5s'
              el.style.left = 0
              setTimeout(function () {
                el.style.transition = ''
              }, 500)
            }
            // 取消事件绑定
            el.ontouchmove = null
            el.ontouchend = null
          }
        }
      }
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
    overflow: hidden;
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
        display: flex;
        line-height:0.9rem;
        height:1.5rem;
        .info-tit{
          flex: 1 1 auto;
          font-size:0.8rem;
          .text-overflow;
        }
        .raise-state{
          flex: 0 0 auto;
          font-size: 0.6rem;
          height: 0.9rem;
          padding: 0 0.6rem;
          background: #cc0000;
          color: #fff;
          &:empty{
            display: none;
          }
        }
      }
      .author{
        font-size:0.7rem;
        .text-overflow;
        color:#999999;
        padding-right:0.4rem;
        margin-right:0.4rem;
      }
      .con-price{
        margin: 0.5rem 0 0;
        display: flex;
        font-size: 0.6rem;
        line-height: 1.2rem;
        .price-wrapper{
          flex: 1 1 auto;
        }
        .tag-wrapper{
          flex: 0 0 auto;
          overflow: hidden;
          white-space: nowrap;
        }
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
        .tag{
          display: inline-block;
          width: 3rem;
          box-sizing: border-box;
          margin-left: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 0.1rem;
          text-align: center;
        }
      }
    }
    .delete{
    	position:absolute;
    	right:0;
    	top:0;
    	width:2.7rem;
    	height:5.4rem;
    	line-height:5.4rem;
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
      span{
        display: inline-block;
        width: 3.5rem;
        font-size: 0.6rem;
        line-height: 1.2rem;
        text-align: center;
        margin-left: 0.5rem;
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
