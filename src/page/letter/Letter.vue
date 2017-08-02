<template>
  <div v-if="show">
    <ul class="notice">
      <router-link :to="{ path: '/chat/'+item.userId}" tag="li" v-for="(item, index) in info" :key="index">
        <img :src="item.headPic" alt="pic">
        <div class="info">
          <p>
            <span class="tit">{{item.userName}}</span>
            <span class="fr">{{item.time}}</span>
          </p>
          <p class="info-con">
            <span class="text">{{decodeURI(item.content)}}</span>
            <span class="num" v-if="item.count">{{item.count}}</span>
          </p>
        </div>
      </router-link>
    </ul>
    <Nodata :showSwitch="info.length" type="letter"></Nodata>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'
export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: [],
      page: 1,
      show: false,
      SEND: '发布',
      SUPPORT: '支持'
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '私信'
      if (this.id) {
        this.$http.get(this.apiURL + 'member/message/letter/list.jhtml?wxbdopenId=' + this.id).then((response) => {
          this.info = response.data
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    }
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
    Nodata
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.notice{
  li{
    position: relative;
    padding:0.5rem 1rem;
    border-bottom:1px solid #cccccc;
    background:#ffffff;
    &:first-of-type{
      border-top:1px solid #cccccc;
      margin-top:0.5rem;
    }
    &.act{
      &:before{
        position:absolute;
        left:3.3rem;
        top:0.4rem;
        content:"";
        width:0.3rem;
        height:0.3rem;
        border-radius:50%;
        background:#cc0000;
      }
    }
  }
  img{
    width:2.5rem;
    height:2.5rem;
    border-radius: 50%;
  }
  .info{
    float:right;
    width:12rem;
    height:2.5rem;
    padding-right:1rem;
    font-size:0.6rem;
    color:#666666;
    background:url("../../image/orderRight.png") no-repeat right center;
    background-size: 0.5rem;
    p{
      height: 1.3rem;
      line-height:1.3rem;
      overflow:hidden;
      white-space:nowrap;
      text-overflow:ellipsis;
    }
    .info-con{
      display: flex;
      align-items: center;
      width: 12rem;
      .text{
        flex: 1 1 auto;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
      }
      .num{
        flex: 0 0 auto;
        font-size: 0.5rem;
        color: #fff;
        text-align: center;
        line-height: 0.8rem;
        padding: 0 0.3rem;
        height: 0.8rem;
        border-radius: 0.4rem;
        background: #cc0000;
      }
    }
  }
  .tit{
    display: inline-block;
    color:#333333;
    font-size:0.8rem;
    width: 5rem;
    overflow:hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
  }
}
</style>
