<template>
  <div class="">
    <ul class="support-list" v-if="show">
      <li class="support-item" v-for="(item, index) in info" :key="index">
        <div v-if="item.type !== '无偿支持'" class="describe">
          <p class="price">￥{{item.money}}
            <span class="lottery" v-if="item.type === '抽奖回报'">奖</span>
            <span class="limit" v-if="item.copies != 0 ">限制{{item.copies}}份</span>
          </p>
          <p class="info">{{item.title}}</p>
          <div class="detials">
            <p>{{item.content}}</p>
          </div>
          <div class="img-box">
            <router-link class="img-wrapper" :to="'/imagePreview/'+contentId+'/crowdShare/'+key+'/'+item.id" v-for="(ele,key) in item.pic" :key="key" v-bind:style="'background: url('+ele+') no-repeat;background-size: cover;'">
          </router-link>
          </div>
          <div class="tip">
            <p>回报时间：项目成功结束后{{item.reTime}}天内</p>
            <p v-if="item.type !== '抽奖回报'">运费：{{item.freight | tofix}}元</p>
          </div>
        </div>
        <div v-else class="describe">
          <p class="price">无私支持</p>
          <p class="info">感谢您的无私奉献，这份支持将祝我们的梦想飞得更高更远。</p>
        </div>
        <div class="support">
          已支持数：<span class="clRed">{{item.num}}</span>
          <router-link class="btn" :to="'/order/'+item.id">立即付款</router-link>
        </div>
      </li>
    </ul>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      tip: '',
      info: {},
      show: false,
      mapHref: {
        '无偿支持': 'gratis',
        '抽奖回报': 'lottery',
        '商品回报': 'normal'
      }
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '立即支持'
      if (this.contentId) {
        this.$http.get(this.apiURL + 'reportNape.jhtml?contentId=' + this.contentId).then((response) => {
          this.info = response.data
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          this.tip = '请求失败'
        })
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
    Nodata
  },
  computed: {
    contentId: function () {
      return this.$route.params.contentId
    }
  },
  filters: {
    tofix: function (val) {
      return parseFloat(val).toFixed(2)
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.support-list{
  color: #666;
  .support-item{
    margin: 0.5rem 0;
    background: #fff;
    .describe{
      padding: 0 1rem 0.5rem;
    }
    .price{
      color: #cc0000;
      font-size: 1rem;
      line-height: 2.5rem;
      padding-top: 0.1rem;
      .limit{
        display: inline-block;
        height: 0.8rem;
        line-height: 0.8rem;
        vertical-align: middle;
        padding: 0 0.2rem;
        margin-left: 0.3rem;
        color: #fff;
        background: #ff6633;
        font-size: 0.5rem;
        border-radius: 0.1rem;
      }
      .lottery{
        display: inline-block;
        height: 0.9rem;
        line-height: 0.9rem;
        vertical-align: middle;
        padding: 0 0.2rem;
        margin-left: 0.3rem;
        color: #fff;
        background: #ff6633;
        font-size: 0.6rem;
        font-weight: bold;
        border-radius: 0.1rem;
      }
    }
    .info{
      line-height: 1rem;
    }
    .detials{
      padding: 0.5rem 0;
      p{
        line-height: 1rem;
        padding: 0.1rem 0;
      }
    }
    .img-box{
      padding:0 0.5rem;
      font-size: 0;
      >div:nth-of-type(4n){
        margin-right: 0;
      }
    }
    .img-wrapper{
      display: inline-block;
      width: 3rem;
      height: 3rem;
      margin:0.3rem 1rem 0.3rem 0;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .tip{
      p{
        line-height: 1rem;
        font-size: 0.6rem;
      }
    }
    .support{
      border-top: 1px solid #ccc;
      padding: 0.4rem 1rem;
      line-height: 1.7rem;
      font-size: 0.8rem;
      .btn{
        float: right;
        height: 1.7rem;
        width: 5.5rem;
        border-radius: 0.1rem;
        text-align: center;
        background: #cc0000;
        color: #fff;
      }
    }
  }
}
</style>
