<template>
  <div v-if="show">
    <!-- 信封列表 -->
    <ul class="notice">
      <router-link to="/messageList/notice" tag="li" :class="{'act':info.itemInfo.message}">
        <img src="../../image/announcement.png" alt="pic">
        <div class="info">
          <p>
            <span class="tit">项目通知</span>
            <span class="fr">{{info.itemInfo.acceptTime}}</span>
          </p>
          <p v-if="info.itemInfo.content">{{info.itemInfo.content}}</p>
          <p v-else>暂无项目通知</p>
        </div>
      </router-link>
      <router-link to="/messageList/dynamic" tag="li" :class="{'act':info.dynamic.message}">
        <img src="../../image/announcementPro.png" alt="pic">
        <div class="info">
          <p>
            <span class="tit">动态通知</span>
            <span class="fr">{{info.dynamic.acceptTime}}</span>
          </p>
          <p v-if="info.dynamic.content">{{info.dynamic.content}}</p>
          <p v-else>暂无动态通知</p>
        </div>
      </router-link>
      <router-link to="/messageList/logistics" tag="li" :class="{'act':info.logiService.message}">
        <img src="../../image/announcementTrans.png" alt="pic">
        <div class="info">
          <p>
            <span class="tit">物流服务</span>
            <span class="fr">{{info.logiService.acceptTime}}</span>
          </p>
          <p v-if="info.logiService.logisticCode">您的订单：{{info.logiService.logisticCode}} {{info.logiService.state}}</p>
          <p v-else>暂无物流信息</p>
        </div>
      </router-link>
      <router-link to="/letter" tag="li" :class="{'act':info.message.message}">
        <img src="../../image/announcementChat.png" alt="pic">
        <div class="info">
          <p>
            <span class="tit">私信消息</span>
            <span class="fr">{{info.message.acceptTime}}</span>
          </p>
          <p v-if="info.message.content" v-html="info.message.content"></p>
          <p v-else>暂无私信消息</p>
        </div>
      </router-link>
      <router-link to="/messageList/return" tag="li" :class="{'act':info.supportInfo.message}">
        <img src="../../image/announcementMsg.png" alt="pic">
        <div class="info">
          <p>
            <span class="tit">支持消息</span>
            <span class="fr">{{info.supportInfo.acceptTime}}</span>
          </p>
          <p v-if="info.supportInfo.userName">【{{info.supportInfo.userName}}】支持了您的项目“{{info.supportInfo.title}}”{{info.supportInfo.money}}元</p>
          <p v-else>暂无支持消息</p>
        </div>
      </router-link>
    </ul>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      tip: '',
      info: [],
      page: 1,
      show: false,
      SEND: '发布',
      SUPPORT: '支持'
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '通知'
      if (this.id) {
        this.$http.get(this.apiURL + 'member/message/list.jhtml?wxbdopenId=' + this.id).then((response) => {
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
