<template>
  <div>
    <div class="state-wrapper">
      <ul :style="'width:'+mapRaise.length*4.5+'rem'">
        <router-link :to="'/myorder/raise/'+ mapState[index]" replace v-for="(item, index) in mapRaise" :key="item.key" tag="li">{{item}}</router-link>
      </ul>
    </div>
    <router-view :info="info" :type="'myOrder'" @confirmReceipt="confirmReceipt" @deleteOrder="deleteOrder" @abolishOrder="abolishOrder" @payment="payment" @remind="remind"></router-view>
    <Confirm :info="confirmInfo" @confirm="confirm" v-show="confirmState"></Confirm>
    <Nodata :showSwitch="info.length" type="order"></Nodata>
    <LoadMore :load.sync="loadState" :Boff= "loadBoff"></LoadMore>
  </div>
</template>

<script>
import Confirm from '@/components/Confirm'
import Nodata from '@/components/Nodata'
import Pay from '@/components/Pay'

export default {
  props: ['apiURL', 'id'],
  mixins: [Pay],
  data () {
    return {
      mapRaise: ['全部订单', '待付款', '待发货', '待收货'], // 状态列表数据
      mapState: ['all', 'nopay', 'nodispatch', 'noreceive'], // 状态所对应的地址
      info: [],
      page: 1,
      type: '', // 用于存储操作的类型
      item: '', // 用于存储选择操作的订单
      confirmInfo: {
        title: '提示',
        name: '您确定要删除此条回复？'
      },
      confirmState: false,
      loadState: false,
      loadBoff: true
    }
  },
  components: {
    Confirm,
    Nodata
  },
  methods: {
    getCustomers: function () {
      this.page = 1
      if (this.id) {
        this.$http.get(this.apiURL + 'member/order/list.jhtml?type=raise&wxbdopenId=' + this.id + '&page=' + this.page + '&state=' + this.state).then((response) => {
          this.info = response.data.raise
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    },
    // 确定
    confirm: function (val) {
      this.confirmState = false
      // 确定收货
      if (val && this.type === 'confirmReceipt') {
        this.$http.get(this.apiURL + 'member/order/confirm_receipt.jhtml?orderCode=' + this.item.orderCode + '&wxbdopenId=' + this.id).then((response) => {
          if (this.state === 'all') {
            this.item.state = '众筹结束'
          } else {
            this.info = this.info.filter((item) => {
              return item.orderCode !== this.item.orderCode
            })
          }
        }, () => {
          alert('请求失败')
        })
        // 删除订单
      } else if (val && this.type === 'deleteOrder') {
        this.$http.get(this.apiURL + 'member/order/delete.jhtml?orderCode=' + this.item.orderCode + '&wxbdopenId=' + this.id).then((response) => {
          if (response.data.state) {
            this.info = this.info.filter((item) => {
              return item.orderCode !== this.item.orderCode
            })
          }
        }, () => {
          alert('请求失败')
        })
        // 取消订单
      } else if (val && this.type === 'abolishOrder') {
        this.$http.get(this.apiURL + 'member/order/cancel.jhtml?orderCode=' + this.item.orderCode + '&wxbdopenId=' + this.id).then((response) => {
          if (response.data.state) {
            if (this.state === 'all') {
              this.item.state = '交易关闭'
            } else {
              this.info = this.info.filter((item) => {
                return item.orderCode !== this.item.orderCode
              })
            }
          } else {
            alert(response.data.msg)
          }
        }, () => {
          alert('请求失败')
        })
      }
    },
    // 确定收货
    confirmReceipt: function (item) {
      this.confirmState = true
      this.type = 'confirmReceipt'
      this.item = item
      this.confirmInfo.name = '您确定已经收到货品？'
    },
    // 删除订单
    deleteOrder: function (item) {
      this.confirmState = true
      this.type = 'deleteOrder'
      this.item = item
      this.confirmInfo.name = '您确定删除此订单？'
    },
    // 取消订单
    abolishOrder: function (item) {
      this.confirmState = true
      this.type = 'abolishOrder'
      this.item = item
      this.confirmInfo.name = '您确定取消此订单？'
    },
    // 提醒发货
    remind: function (item) {
      this.$http.get(this.apiURL + 'member/order/shipWarn.jhtml?orderCode=' + item.orderCode + '&wxbdopenId=' + this.id).then((response) => {
        alert(response.data.type)
      }, () => {
        alert('请求失败')
      })
    },
    // 立即付款
    payment: function (item) {
      this.pay({'orderCode': item.orderCode, 'state': localStorage.getItem('state'), 'wxbdopenId': this.id})
    }
  },
  watch: {
    loadState: function (val, oldVal) {
      if (val) {
        this.page ++
        this.$http.get(this.apiURL + 'member/order/list.jhtml?type=raise&wxbdopenId=' + this.id + '&page=' + this.page + '&state=' + this.state).then((response) => {
          if (response.data.raise.length) {
            this.info.push(...response.data.raise)
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
      this.getCustomers()
    }
  },
  computed: {
    // 订单状态
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
  height: 2rem;
  line-height: 2rem;
  font-size: 0.6rem;
  width: 100%;
  overflow-x: auto;
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
}
</style>
