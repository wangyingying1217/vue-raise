<template>
  <div class="nodata" v-show="!showSwitch">{{text[type]}}</div>
</template>

<script>
export default{
  data () {
    return {
      text: {
        support: '还没有人支持啊，您来帮帮忙吧~~',
        detials: '还没有详情啊，您稍后再来看看吧~~',
        update: '还没有项目更新啊，再等等吧~~',
        comment: '还没有评论啊，快来抢沙发吧~~',
        content: '没有您要找的内容啊~~',
        raise: '您还没有关注的众筹项目啊~~',
        product: '您还没有关注的商品啊~~',
        address: '您还没有收货地址啊，添加一下吧~~',
        coupon: '您还没有优惠券啊~~',
        order: '您还没有相关的订单啊~~',
        message: '您还没有相关的消息啊~~',
        activity: '您还没有活动公告啊~~',
        online: '您还没有在线商品啊~~',
        returnProgress: '您还没有回报进展~~',
        letter: '您还没有私信啊~~',
        index: '还没有相关的众筹~~'
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
