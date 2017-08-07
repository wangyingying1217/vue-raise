<template>
  <dl class="notice" v-if="show">
    <dt>
      <div class="logo">
        <img :src="info.logo" alt="pic">
      </div>
      <p>当前版本：{{info.version}}</p>
    </dt>
    <router-link :to="item.path" v-for="item in routerDate" :key="item.name" tag="dd"><a>{{item.name}}</a></router-link>
    <Tip :info.sync="tip"></Tip>
  </dl>
</template>

<script>
export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      show: false,
      tip: '',
      info: [],
      routerDate: [{
        path: '/introduce',
        name: '公司简介'
      }, {
        path: '/contact',
        name: '联系我们'
      }, {
        path: '/service',
        name: '服务条款'
      }]
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '关于我们'
      this.$http.get(this.apiURL + 'aboutUs/index.jhtml').then((response) => {
        this.info = response.data
        this.show = true
        this.$indicator.close()
      }, () => {
        this.$indicator.close()
        this.tip = '请求失败'
      })
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  },
  $route: function () {
    this.getCustomers()
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.notice{
  dt{
    text-align: center;
    margin:2rem auto 2.6rem;
    .logo{
      display: inline-block;
      width:5rem;
      height:5rem;
      background:#ffffff;
      border-radius:0.9rem;
      margin-bottom:0.5rem;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
    }
    p{
      font-size:0.6rem;
      color:#666666;
      text-align:center;
      line-height:0.6rem;
    }
  }
  dd{
    height:2rem;
    line-height:2rem;
    padding:0 1rem;
    background:#ffffff;
    border-top:1px solid #cccccc;
    &:last-of-type{
      border-bottom:1px solid #cccccc;
    }
    a{
      display:block;
      font-size:0.6rem;
      color:#666666;
      background:url("../../image/orderRight.png") no-repeat right center/0.5rem;
    }
  }
}
</style>
