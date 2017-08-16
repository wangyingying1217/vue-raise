<template>
  <div v-if="show">
    <!-- 聊天信息列表 -->
    <ul class="chat-list" :style="{'min-height': height}">
      <!-- 自己的信息再右边   对方的信息再左边 -->
      <li :class="{'left': !item.isMe,'right': item.isMe}" v-for="(item, index) in info.content" :key="index">
        <img class="avater" v-if="item.isMe" :src="info.senderImage" alt="pic">
        <img class="avater" v-else :src="info.receiverImage" alt="pic">
        <!-- 内容可能有表情,要解码才能显示 -->
        <div class="text">{{decodeURI(item.content)}}</div>
      </li>
    </ul>
    <!-- 底部输入框 -->
    <div class="commentText">
      <input class="text" type="text" v-model="text">
      <input class="sure" type="button" value="发送" @click="send">
    </div>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: {
        content: [{
          contentId: 0
        }]
      },
      page: 1,
      text: '',
      show: false,
      requset: true,
      timer: null,
      tip: ''
    }
  },
  methods: {
    getCustomers: function () {
      // 数据初始化
      if (this.id) {
        // 请求参数 {prevContentId：最后一条信息的id，wxbdopenId：用户微信id，receiverId：信息接收者id}
        this.$http.post(this.apiURL + 'member/message/chat.jhtml', {prevContentId: this.prevChatId, wxbdopenId: this.id, receiverId: this.receiverId}).then((response) => {
          document.title = response.data.title
          this.info = response.data
          this.show = true
          this.$nextTick(function () {
            window.scrollTo(0, document.body.scrollHeight)
          })
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          this.tip = '请求失败'
        })
      }

      // 定时器定时请求接口，获得聊天信息（当一次请求完成后再进行下一次请求）
      this.timer = setInterval(() => {
        if (this.id && this.requset) {
          this.requset = false
          this.$http.post(this.apiURL + 'member/message/chat.jhtml', {prevContentId: this.prevChatId, wxbdopenId: this.id, receiverId: this.receiverId}).then((response) => {
            this.info.content.push(...response.data.content)
            this.$nextTick(function () {
              window.scrollTo(0, document.body.scrollHeight)
            })
            this.requset = true
          })
        }
      }, 500)
    },
    // 发送信息
    send: function () {
      if (this.text.trim()) {
        // 请求参数 {prevContentId：最后一条信息的id，wxbdopenId：用户微信id，receiverId：信息接收者id，content：聊天内容}
        this.$http.post(this.apiURL + 'member/message/sendChat.jhtml', {prevChatId: this.prevChatId, wxbdopenId: this.id, receiverId: this.receiverId, content: encodeURI(this.text)}).then((response) => {
          this.text = ''
        }, () => {
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
    // 组件创建完后获取数据
    document.title = ''
    this.getCustomers()
  },
  computed: {
    receiverId: function () {
      return this.$route.params.id
    },
    prevChatId: function () {
      return this.info.content.length ? this.info.content[this.info.content.length - 1].contentId : 0
    },
    height: function () {
      return document.documentElement.clientHeight + 'px'
    }
  },
  // 离开页面钱清除定时器
  beforeRouteLeave (to, from, next) {
    clearInterval(this.timer)
    next()
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.chat-list{
  width: 100%;
  min-height: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 0.5rem 0.5rem 3rem;
  .left{
    display: flex;
    margin: 0.5rem 0;
    box-sizing: border-box;
    flex-direction: row;
    .text{
      &:after{
        left: -0.25rem;
      }
    }
  }
  .right{
    display: flex;
    margin: 0.5rem 0;
    box-sizing: border-box;
    flex-direction: row-reverse;
    .text{
      &:after{
        right: -0.25rem;
      }
    }
  }
  .avater{
    width: 2rem;
    height:2rem;
    border-radius: 50%;
  }
  .text{
    max-width: 10rem;
    margin: 0 0.6rem;
    background: #b6d8f9;
    line-height: 1.2rem;
    padding: 0.4rem 0.6rem;
    border-radius: 0.3rem;
    position: relative;
    &:after{
      position: absolute;
      top: 0.7rem;
      content: "";
      width: 0.5rem;
      height: 0.5rem;
      display: block;
      transform: rotate(45deg);
      background: #b6d8f9;
    }
  }
}
.commentText{
  width:100%;
  padding:0.4rem 0.6rem;
  position:fixed;
  left:0;
  bottom:0;
  border-top:1px solid #cccccc;
  background:#f5f5f5;
  input{
    height:1.8rem;
    float:left;
    box-sizing:border-box;
    font-size:0.7rem;
    background: #fff;
  }
  .text{
    width:13.8rem;
    border:1px solid #cccccc;
    text-indent:0.4rem;
    border-radius:0.2rem 0 0 0.2rem;
  }
  .sure{
    width:3rem;
    background:#cc0000;
    color:#ffffff;
    border-radius:0 0.2rem 0.2rem 0;
  }
}
</style>
