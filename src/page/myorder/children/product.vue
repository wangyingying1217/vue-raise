<template>
  <div>
    <div class="state-wrapper" ref="wrapper" :class="{'right-icon': rightIcon}">
      <ul :style="{'width':mapProduct.length*4.5+'rem'}" @touchmove="scroll" ref="ul">
        <router-link :to="'/myorder/product/'+ mapState[index]" replace v-for="(item, index) in mapProduct" :key="item.key" tag="li">{{item}}</router-link>
      </ul>
    </div>
    <router-view :info="info" :type="'myOrder'"></router-view>
    <Confirm :info="confirmInfo" @confirm="confirm" v-show="confirmState"></Confirm>
    <Nodata :showSwitch="info.length" :type="'order'"></Nodata>
    <LoadMore :info="loadMore"></LoadMore>
  </div>
</template>

<script>
import Confirm from '@/components/Confirm'
import Nodata from '@/components/Nodata'
import LoadMore from '@/components/LoadMore'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      mapProduct: ['全部订单', '待付款', '待发货', '待收货', '已完成', '已退款', '已取消'],
      mapState: ['all', 'nopay', 'nodispatch', 'noreceive', 'finished', 'refunded', 'canceled'],
      info: [],
      page: 1,
      confirmInfo: {
        title: '提示',
        name: '您确定要删除此条回复？'
      },
      confirmState: false,
      loadMore: {
        state: ''
      },
      rightIcon: true,
      log: ''
    }
  },
  components: {
    Confirm,
    Nodata,
    LoadMore
  },
  methods: {
    getCustomers: function (contentId) {
      if (this.id) {
        this.$http.get(this.apiURL + 'member/order/list.jhtml?type=product&wxbdopenId=' + this.id + '&page=' + this.page + '&state=' + this.state).then((response) => {
          this.info = response.data.product
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    },
    scroll: function () {
      if (this.$refs.wrapper.scrollLeft + this.$refs.wrapper.offsetWidth < this.$refs.ul.offsetWidth - 40) {
        this.rightIcon = true
      } else {
        this.rightIcon = false
      }
    },
    confirm: function (val) {
      this.confirmState = false
      if (val && this.type === 'deleteRaise') {
        this.$http.get(this.apiURL + 'member/del_meRaise.jhtml?id=' + this.contentId + '&wxbdopenId=' + this.id).then((response) => {
          if (response.data.state) {
            this.info = this.info.filter((item) => {
              return item.contentId !== this.contentId
            })
          }
        }, () => {
          alert('请求失败')
        })
      } else if (val && this.type === 'endRaise') {
        this.$http.get(this.apiURL + 'member/stop_raise.jhtml?id=' + this.contentId + '&wxbdopenId=' + this.id).then((response) => {
          if (response.data.state) {
            this.info.forEach((item, index) => {
              if (item.contentId === this.contentId) {
                this.info[index].state = '终止中'
              }
            })
          }
        }, () => {
          alert('请求失败')
        })
      } else if (val && this.type === 'abolishRaise') {
        this.$http.get(this.apiURL + 'member/abolish.jhtml?id=' + this.contentId + '&wxbdopenId=' + this.id).then((response) => {
          if (response.data.state) {
            this.info.forEach((item, index) => {
              if (item.contentId === this.contentId) {
                this.info[index].state = '废止中'
              }
            })
          }
        }, () => {
          alert('请求失败')
        })
      } else if (val && this.commentType === 'supplement') {
        alert('supplement')
      }
    },
    deleteRaise: function (id) {
      this.confirmState = true
      this.type = 'deleteRaise'
      this.contentId = id
      this.confirmInfo.name = '您确定要删除此条众筹？'
    },
    endRaise: function (id) {
      this.confirmState = true
      this.type = 'endRaise'
      this.contentId = id
      this.confirmInfo.name = '终止后不可恢复，您确定要终止此条众筹？'
    },
    abolishRaise: function (id) {
      this.confirmState = true
      this.type = 'abolishRaise'
      this.contentId = id
      this.confirmInfo.name = '废止后不可恢复，您确定要废止此条众筹？'
    },
    supplement: function (json) {
      this.confirmState = true
      this.type = 'supplement'
      this.contentId = json.contentId
      this.money = json.money
      this.confirmInfo.name = '确认补齐余下的' + this.money + '元？'
    }
  },
  watch: {
    loadMore: {
      handler: function (val, oldVal) {
        if (val.state === 'loading') {
          this.page ++
          this.$http.get(this.apiURL + 'member/order/list.jhtml?type=product&wxbdopenId=' + this.id + '&page=' + this.page + '&state=' + this.state).then((response) => {
            if (response.data.product.length) {
              this.info.push(...response.data.product)
              this.loadMore.state = ''
            } else {
              this.loadMore.state = 'loaded'
            }
          }, () => {
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
      this.page = 1
      this.getCustomers()
    }
  },
  computed: {
    state: function () {
      return this.$route.params.state
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.state-wrapper{
  position: relative;
  height: 2rem;
  line-height: 2rem;
  font-size: 0.6rem;
  width: 100%;
  overflow: auto;
  border-bottom: 1px solid #ccc;
  margin-bottom: 0.5rem;
  ul{
    display: flex;
    li{
      flex: 1 1 4.5rem;
      text-align: center;
      &.act{
        color: #cc0000;
      }
    }
  }
  &.right-icon{
    background: url('../../../../static/image/arrowRight.png') no-repeat 17rem center;
    background-size: 0.6rem;
  }
}
</style>
