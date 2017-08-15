<template>
  <div class="nodata" v-show="!showSwitch">{{text[type]}}</div>
</template>

<script>
// 没有数据的时候的提示
export default{
  data () {
    return {
      text: {
        support: '还没有人支持啊，您来帮帮忙吧~~', // 支持进展
        detials: '还没有详情啊，您稍后再来看看吧~~', // 项目详情
        update: '还没有项目更新啊，再等等吧~~', // 项目更新
        comment: '还没有评论啊，快来抢沙发吧~~', // 项目评论
        content: '没有您要找的内容啊~~', // 搜索
        raise: '您还没有关注的众筹项目啊~~', // 关注众筹
        product: '您还没有关注的商品啊~~',  // 关注商品
        address: '您还没有收货地址啊，添加一下吧~~', // 收货地址
        coupon: '您还没有优惠券啊~~', // 优惠券
        order: '您还没有相关的订单啊~~', // 订单
        message: '您还没有相关的消息啊~~', // 消息列表
        activity: '您还没有活动公告啊~~', // 活动公告
        online: '您还没有在线商品啊~~', // 在线商品
        returnProgress: '您还没有回报进展~~', // 回报进展
        letter: '您还没有私信啊~~', // 私信
        index: '还没有相关的众筹~~' // 众筹列表
      }
    }
  },
  props: ['type', 'showSwitch']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.nodata{
	position:absolute;
	left:0;
	right:0;
	top:40%;
	text-align:center;
	font-size:0.8rem;
	color:#999;
}
</style>
