<template>
  <div v-if="show">
    <ul class="notice">
      <router-link :to="'/notice/'+item.id" tag="li" v-for="item in info" :key="item.title">
        <img src="../../image/announcement.png" alt="pic">
        <div class="info">
          <p>
            <span class="tit">{{item.title}}</span>
            <span class="fr">{{item.time}}</span>
          </p>
          <p>{{item.content}}</p>
        </div>
      </router-link>
    </ul>
    <LoadMore :info="loadMore" :type="'no'"></LoadMore>
    <Nodata :showSwitch="info.length" type="activity"></Nodata>
  </div>
</template>

<script>
import LoadMore from '@/components/LoadMore'
import Nodata from '@/components/Nodata'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      show: false,
      info: [],
      page: 1,
      loadMore: {
        state: ''
      }
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
    loadMore: {
      handler: function (val, oldVal) {
        if (val.state === 'loading') {
          this.page ++
          this.$http.get(this.apiURL + 'article/list.jhtml?pageNumber=' + this.page).then((response) => {
            if (response.data.length) {
              this.info = this.info.concat(response.data.article)
              this.loadMore.state = ''
            } else {
              this.loadMore.state = 'loaded'
            }
          }, () => {
            this.$indicator.close()
            alert('请求失败')
          })
        }
      },
      deep: true
    },
    id: function () {
      this.getCustomers()
    },
    $route: function () {
      this.getCustomers()
    }
  },
  components: {
    Nodata,
    LoadMore
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
