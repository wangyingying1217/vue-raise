<template>
  <div>
    <div class="state-wrapper" ref="wrapper" @scroll="scroll">
      <ul :style="{'width':mapProduct.length*4.5+'rem'}" ref="ul">
        <router-link :to="'/myorder/product/'+ mapState[index]" replace v-for="(item, index) in mapProduct" :key="item.key" tag="li">{{item}}</router-link>
      </ul>
      <span :style="{'top':iconTop+'rem'}" v-show="scrollState !== 'left'" class="left-icon" @click="scrollStart"></span>
      <span :style="{'top':iconTop+'rem'}" v-show="scrollState !== 'right'" class="right-icon" @click="scrollEnd"></span>
    </div>
    <router-view :info="info" :type="'myOrder'"></router-view>
    <Confirm :info="confirmInfo" @confirm="confirm" v-show="confirmState"></Confirm>
    <Nodata :showSwitch="info.length" :type="'order'"></Nodata>
    <LoadMore :load.sync="loadState" :Boff= "loadBoff"></LoadMore>
  </div>
</template>

<script>
import Confirm from '@/components/Confirm'
import Nodata from '@/components/Nodata'
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
      loadState: false,
      loadBoff: true,
      scrollState: 'left',
      iconTop: 2.5
    }
  },
  components: {
    Confirm,
    Nodata
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
      if (this.$refs.wrapper) {
        if (this.$refs.wrapper.scrollLeft + this.$refs.wrapper.offsetWidth > this.$refs.ul.offsetWidth - 40) {
          this.scrollState = 'right'
        } else if (this.$refs.wrapper.scrollLeft < 40) {
          this.scrollState = 'left'
        } else {
          this.scrollState = ''
        }
      }
    },
    scrollStart: function () {
      let timer = setInterval(() => {
        if (this.$refs.wrapper.scrollLeft > 0) {
          this.$refs.wrapper.scrollLeft = this.$refs.wrapper.scrollLeft - 20
        } else {
          clearInterval(timer)
        }
      }, 10)
    },
    scrollEnd: function () {
      let length = this.$refs.ul.offsetWidth - this.$refs.wrapper.offsetWidth
      let timer = setInterval(() => {
        if (this.$refs.wrapper.scrollLeft < length) {
          this.$refs.wrapper.scrollLeft = this.$refs.wrapper.scrollLeft + 20
        } else {
          clearInterval(timer)
        }
      }, 10)
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
    loadState: function (val, oldVal) {
      if (val) {
        this.page ++
        this.$http.get(this.apiURL + 'member/order/list.jhtml?type=product&wxbdopenId=' + this.id + '&page=' + this.page + '&state=' + this.state).then((response) => {
          if (response.data.product.length) {
            this.info.push(...response.data.product)
            this.loadState = false
          } else {
            this.loadBoff = false
          }
        }, () => {
          alert('请求失败')
        })
      }
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
    let iWidth = document.documentElement.clientWidth || document.body.clientWidth
    let baseSize = iWidth / 18
    const baseTop = 2.5
    if (window.addEventListener) {
      window.addEventListener('scroll', () => {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        this.iconTop = baseTop - scrollTop / baseSize
      }, false)
    } else {
      window.attachEvent('scroll', () => {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        this.iconTop = baseTop - scrollTop / baseSize
      }, false)
    }
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
  .right-icon{
    position: fixed ;
    right: 0;
    top: 2.5rem;
    width: 1rem;
    height: 1rem;
    background: url('../../../image/arrowRight.png') no-repeat center center;
    background-size: 0.6rem;
  }
  .left-icon{
    position: fixed ;
    left: 0;
    top: 2.5rem;
    width: 1rem;
    height: 1rem;
    background: url('../../../image/arrowLeft.png') no-repeat center center;
    background-size: 0.6rem;
  }
}
</style>
