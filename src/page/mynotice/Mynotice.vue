<template>
  <div v-if="show">
    <ul class="notice">
      <!-- 活动公告列表 -->
      <router-link :to="'/notice/'+item.id" tag="li" v-for="item in info" :key="item.title">
        <img src="../../image/announcement.png" alt="pic">
        <div class="info">
          <!-- 标题、时间 -->
          <p>
            <span class="tit">{{item.title}}</span>
            <span class="fr">{{item.time}}</span>
          </p>
          <!-- 内容 -->
          <p>{{item.content}}</p>
        </div>
      </router-link>
    </ul>
    <LoadMore :load.sync="loadState" :Boff= "loadBoff"></LoadMore>
    <Nodata :showSwitch="info.length" type="activity"></Nodata>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'
export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      show: false,
      info: [],
      page: 1,
      loadState: false,
      loadBoff: true
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '活动公告'
      this.$http.get(this.apiURL + 'article/list.jhtml?pageNumber=' + this.page).then((response) => {
        this.info = response.data.article
        this.show = true
        this.$indicator.close()
      }, () => {
        this.$indicator.close()
        alert('请求失败')
      })
    }
  },
  watch: {
    loadState: function (val, oldVal) {
      if (val) {
        this.page ++
        this.$http.get(this.apiURL + 'article/list.jhtml?pageNumber=' + this.page).then((response) => {
          if (response.data.length) {
            this.info = this.info.concat(response.data.article)
            this.loadState = false
          } else {
            this.loadBoff = false
          }
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    },
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
    padding:0.5rem 1rem;
    border-top:1px solid #cccccc;
    border-bottom:1px solid #cccccc;
    background:#ffffff;
    margin-bottom:0.5rem;
    &:first-of-type{
      margin-top:0.5rem;
    }
  }
  img{
    width:2.5rem;
    height:2.5rem;
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
