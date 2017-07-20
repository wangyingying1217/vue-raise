<template>
  <div v-if="show">
    <ul class="stateList">
      <li class="state" v-for="(item, index) in stateList" :class="{'act':index <= stateIndex,'long':stateList.length == 3}" :key="index">
        <p class="tip" v-if="info.state == item.tip">{{item.tip}}</p>
        <p class="icon"></p>
        <p class="text">{{item.text}}</p>
      </li>
    </ul>
    <ul class="infolist">
      <li class="item">
        <span class="itemTit">订单编号：</span>
        <span class="itemCon">{{info.orderCode}}</span>
      </li>
      <li class="item">
        <span class="itemTit">申请时间：</span>
        <span class="itemCon">{{info.time}}</span>
      </li>
      <li class="item">
        <span class="itemTit">换货说明：</span>
        <span class="itemCon">{{info.memo}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import TimeEvolve from '@/components/TimeEvolve'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: {},
      stateList: [
        {
          tip: '已提交',
          text: '提交申请'
        },
        {
          tip: '审核中',
          text: '系统审核'
        },
        {
          tip: '运输中',
          text: '运输'
        },
        {
          tip: '已完成',
          text: '完成'
        }
      ],
      show: false
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '换货详情'
      if (this.orderCode && this.id) {
        this.$http.get(this.apiURL + '/member/order/exDetails.jhtml?orderCode=' + this.orderCode + '&wxbdopenId=' + this.id).then((response) => {
          this.show = true
          this.$indicator.close()
          this.info = response.data
        }, () => {
          this.$indicator.close()
          alert('请求失败')
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
    TimeEvolve
  },
  computed: {
    orderCode: function () {
      return this.$route.params.orderCode
    },
    stateIndex: function () {
      let stateIndex = 0
      this.stateList.forEach((item, index) => {
        if (this.info.state === item.tip) stateIndex = index
      })
      return stateIndex
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.stateList{
  padding: 1rem 0;
  text-align: center;
  background: #fff;
  .state{
    display: inline-block;
    width: 2.8rem;
    margin: 0 0.6rem;
    .tip{
      position: relative;
      display: inline-block;
      font-size: 0.7em;
      color: #fff;
      background: #cc0000;
      line-height: 0.8rem;
      padding: 0 0.2rem;
      border-radius: 0.4rem;
      &:after{
        position: absolute;
        left: 50%;
        margin-left: -0.15rem;
        bottom: -0.15rem;
        transform: rotate(45deg);
        content: "";
        width: 0.3rem;
        height: 0.3rem;
        background: #cc0000;
      }
    }
    .icon{
      position: relative;
      margin: 0.6rem auto 0.4rem;
      width: 1.2rem;
      height: 1.2rem;
      background: url("../../image/dui.png") no-repeat 0 0;
      background-size: cover;
      &:after{
        position: absolute;
        left: -2.4rem;
        top: 50%;
        content: "";
        width: 2rem;
        height: 3px;
        background: #ccc;
      }
    }
    .text{
      color: #999;
      font-size: 0.7rem;
    }
    &:first-of-type{
      .icon{
        &:after{
          display: none;
        }
      }
    }
    &.act{
      .icon{
        background: url("../../image/duiRed.png") no-repeat 0 0;
        background-size: cover;
        &:after{
          background: #cc0000;
        }
      }
      .text{
        color: #cc0000;
      }
    }
    &.long{
      margin: 0 1.5rem;
      .icon{
        &:after{
          left: -4rem;
          width: 3.3rem;
        }
      }
    }
  }
}
.infolist{
  margin-top: 0.5rem;
  background: #fff;
  border-bottom: 1px solid #ccc;
  .item{
    // height: 2rem;
    line-height: 1.2rem;
    padding: 0.4rem 1rem;
    border-top: 1px solid #ccc;
    font-size: 0.7rem;
    .itemTit{
      display: inline-block;
      vertical-align: top;
      width: 3.6rem;
      color: #999;
    }
    .itemCon{
      display: inline-block;
      width: 12rem;
    }
  }
}
</style>
