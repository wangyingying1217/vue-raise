<template>
  <div v-if="show">
    <ul>
      <!-- 物流服务、支持消息、动态通知、项目通知列表 -->
      <li class="message-wrapper" v-for="(item, index) in info" :key="index">
        <p class="time"><span>{{item.acceptTime}}</span></p>
        <router-link class="message-box" :to="item.href" tag="div">
          <!-- 物流服务 -->
          <p class="state" v-if="type==LOGISTICS">您的订单{{item.state}}<span class="tip">（{{item.source}}）</span></p>
          <!-- 其他 -->
          <p class="state" v-else>{{item.title}}</p>
          <div class="message-item">
            <img :src="item.pic" alt="pic">
            <div class="con">
              <!-- 支持消息 -->
              <p class="info" v-if="type==RETURN">【{{item.userName}}】支持了您的项目“{{item.title}}”{{item.money}}元</p>
              <p class="info" v-else>{{item.content}}</p>
              <!-- 物流服务 -->
              <p class="tip" v-if="type==LOGISTICS">运单编号：{{item.logisticCode}}</p>
            </div>
          </div>
        </router-link>
      </li>
    </ul>
    <Tip :info.sync="tip"></Tip>
    <LoadMore :load.sync="loadState" :Boff= "loadBoff"></LoadMore>
    <Nodata :showSwitch="info.length" type="message"></Nodata>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'
export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: [],
      tip: '',
      page: 1,
      show: false,
      loadState: false,
      loadBoff: true,
      RETURN: 'return', // 支持消息常量
      NOTICE: 'notice', // 项目通知常量
      LOGISTICS: 'logistics', // 物流服务常量
      DYNAMIC: 'dynamic' // 动态通知常量
    }
  },
  methods: {
    getCustomers: function () {
      document.title = ''
      if (this.id) {
        this.$http.get(this.apiURL + this.url + '?wxbdopenId=' + this.id + '&page=' + this.page).then((response) => {
          if (this.type === this.LOGISTICS) {
            // 物流信息按照时间倒序排列
            response.data.sort(function (a, b) {
              let timeA = a.acceptTime
              let timeB = b.acceptTime
              if (timeA > timeB) {
                return -1
              } else if (timeA < timeB) {
                return 1
              } else {
                return 0
              }
            })
            // 为每条信息设置跳转地址
            response.data.forEach((item) => {
              item.href = '/logistics/' + item.id
            })
          } else if (this.type === this.RETURN) {
            // 支持消息设置跳转地址
            response.data.forEach((item) => {
              item.href = '/supportRecord/' + item.id
            })
          } else if (this.type === this.DYNAMIC) {
            // 动态通知设置跳转地址
            response.data.forEach((item) => {
              item.href = '/evolve/' + item.id
            })
          } else if (this.type === this.NOTICE) {
            // 项目通知设置跳转地址
            response.data.forEach((item) => {
              item.href = '/myraise/effective'
            })
          }
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
  watch: {
    loadState: function (val, oldVal) {
      // 物流动态没有分页 不需要分页加载
      if (val && this.type !== this.LOGISTICS) {
        this.page ++
        this.$http.get(this.apiURL + this.url + '?wxbdopenId=' + this.id + '&page=' + this.page).then((response) => {
          if (response.data.length) {
            if (this.type === this.RETURN) {
              response.data.forEach((item) => {
                item.href = '/supportRecord/' + item.id
              })
            } else if (this.type === this.DYNAMIC) {
              response.data.forEach((item) => {
                item.href = '/supportRecord/' + item.id
              })
            } else if (this.type === this.NOTICE) {
              response.data.forEach((item) => {
                item.href = '/myraise/effective'
              })
            }
            this.info.push(...response.data)
            this.loadState = false
          } else {
            this.loadBoff = false
          }
        }, () => {
          this.tip = '请求失败'
        })
      } else if (this.type === this.LOGISTICS) {
        this.loadBoff = false
      }
    },
    id: function () {
      this.getCustomers()
    },
    $route: function () {
      this.getCustomers()
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  },
  components: {
    Nodata
  },
  computed: {
    // 页面的类型你（支持消息/项目通知/物流服务/动态通知）
    type: function () {
      return this.$route.params.type
    },
    // 设置请求地址
    url: function () {
      let url = ''
      if (this.type === this.LOGISTICS) {
        document.title = '物流服务'
        url = 'member/message/logistics/list.jhtml'
      } else if (this.type === this.RETURN) {
        document.title = '支持消息'
        url = 'member/message/support/list.jhtml'
      } else if (this.type === this.DYNAMIC) {
        document.title = '动态通知'
        url = 'member/message/dynamic/list.jhtml'
      } else {
        document.title = '项目通知'
        url = 'member/message/item/list.jhtml'
      }
      return url
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.message-wrapper{
  margin: 0.8rem 0;
  .time{
    margin-bottom: 0.6rem;
    font-size: 0.6rem;
    color: #fff;
    text-align: center;
    span{
      display: inline-block;
      background: #bebebe;
      padding: 0.2rem 0.3rem;
      border-radius: 0.1rem;
    }
  }
  .message-box{
    width: 16rem;
    margin: 0 auto;
    padding: 0.1rem 0.5rem 0.6rem;
    background: #fff;
    border-radius: 0.4rem;
    box-sizing: border-box;
  }
  .state{
    line-height: 1.8rem;
    font-size: 0.8rem;
  }
  .tip{
    font-size: 0.6rem;
    color: #999;
  }
  .message-item{
    font-size: 0;
    img{
      width: 3rem;
      height: 3rem;
      margin-right: 0.6rem;
      vertical-align: top;
    }
    .con{
      display: inline-block;
      line-height: 1.1rem;
      width: 11.4rem;
      margin-top: -0.1rem;
    }
    .info{
      height: 2.2rem;
      overflow: hidden;
      font-size: 0.7rem;
    }
  }
}
</style>
