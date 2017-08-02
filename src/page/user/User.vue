<template>
  <div v-if="show">
    <!-- <div class="panel" :style="'background:url('+info.headPic+') no-repeat center center/cover'"> -->
    <div class="panel">
      <div class="person-info clearfix">
        <router-link to="/myinfo/nocheck">
          <img :src="user.headPic" alt="pic">
        </router-link>
        <div class="text">
          <p>{{user.nickName}}</p>
          <p>积分：{{user.integral}}</p>
        </div>
        <router-link :to="'/informList'" class="letter" :class="{'act':user.messages}" tag="li"></router-link>
      </div>
      <p class="welcome">{{user.companyName}}欢迎您！</p>
    </div>
    <ul class="my-list clearfix">
      <router-link :to="{ path: item.path}" tag="li" v-for="item in routerDate" :key="item.name">
        <p>{{item.name}}</p>
      </router-link>
    </ul>
    <FooterBar type='person'></FooterBar>
  </div>
</template>

<script>
import FooterBar from '@/components/FooterBar'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      user: {},
      show: false,
      routerDate: [{
        path: '/mycollect',
        name: '我的收藏'
      }, {
        path: '/myproduct',
        name: '在线商品'
      }, {
        path: '/myraise',
        name: '我的众筹'
      }, {
        path: '/mycoupons',
        name: '积分优惠券'
      }, {
        path: '/myorder',
        name: '订单记录'
      }, {
        path: '/mynotice',
        name: '活动公告'
      }, {
        path: '/myinfo/nocheck',
        name: '个人资料'
      }, {
        path: '/ours',
        name: '关于我们'
      }]
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '个人中心'
      if (this.id) {
        this.$http.post(this.apiURL + 'member/index.jhtml?wxbdopenId=' + this.id).then((response) => {
          this.user = response.data
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    }
  },
  created() {
    this.getCustomers()
  },
  watch: {
    id: function () {
      this.getCustomers()
    },
    $route: function () {
      this.getCustomers()
    }
  },
  components: {
    FooterBar
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.generate-columns(@n, @i: 1) when (@i =< @n) {
  &:nth-of-type(@{i}){
    &:before{
      background-position:unit(-(@i - 1)*2, rem) 0;
    }
  }
  .generate-columns(@n, (@i + 1));
}

.panel{
  padding-top:6rem;
  margin-bottom:0.75rem;
  background:url("../../image/headBg.jpg") no-repeat center center;
  background-size: cover;
  .person-info{
    padding:0.5rem;
    img{
      width:2.5rem;
      height:2.5rem;
      float:left;
      margin-right:0.5rem;
      border-radius:50%;
    }
    .text{
      float:left;
      line-height:1rem;
      color:#ffffff;
      font-size:0.6rem;
      padding:0.33rem 0 0;
      p{
        max-width: 8rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .letter{
      width:1.5rem;
      height:1.1rem;
      float:right;
      margin-top:1rem;
      position:relative;
      background:url("../../image/email.png") no-repeat center center;
      background-size: contain;
      &.act{
        &:before{
          position:absolute;
          left:-0.09rem;
          top:-0.09rem;
          content:"";
          width:0.3rem;
          height:0.3rem;
          border-radius:50%;
          background:#cc0000;
        }
      }
    }
  }
  .welcome{
    line-height:1.58rem;
    font-size:0.6rem;
    color:#ffffff;
    background:rgba(0, 0, 0, 0.6);
    text-align:center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.my-list{
  color:#333333;
  text-align:center;
  font-size:0.5rem;
  background:#ffffff;
  border-bottom:1px solid #cccccc;
  li{
    float:left;
    width:4.5rem;
    height:4.5rem;
    box-sizing:border-box;
    border-top:1px solid #cccccc;
    border-right:1px solid #cccccc;
    &:before{
      content: "";
      display: block;
      height:1.57rem;
      width:2rem;
      margin:1.1rem auto 0.37rem;
      background:url("../../image/personList.png") no-repeat 0 0;
      background-size: auto 1.57rem;
    }
    &:nth-of-type(4n){
      border-right:none;
    }
    .generate-columns(8);
  }
}
</style>
