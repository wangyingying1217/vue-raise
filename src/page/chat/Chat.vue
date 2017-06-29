<template>
  <div v-if="show">
    <ul class="chat-list" :style="{'min-height': height}">
      <li :class="{'left': !item.isMe,'right': item.isMe}" v-for="(item, index) in info.content" :key="index">
        <img class="avater" v-if="item.isMe" :src="info.senderImage" alt="pic">
        <img class="avater" v-else :src="info.receiverImage" alt="pic">
        <div class="text">{{decodeURI(item.content)}}</div>
      </li>
      <li class="right" v-for="item in sendMessage" :key="item">
        <img class="avater" :src="info.senderImage" alt="pic">
        <div class="text">{{item}}</div>
      </li>
    </ul>
    <div class="commentText">
      <input class="text" type="text" v-model="text">
      <input class="sure" type="button" value="发送" @click="send">
    </div>
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
      sendMessage: [],
      page: 1,
      text: '',
      show: false,
      timer: null
    }
  },
  methods: {
    getCustomers: function () {
      if (this.id) {
        this.$http.post(this.apiURL + 'member/message/chat.jhtml', {prevContentId: this.prevChatId, wxbdopenId: this.id, receiverId: this.receiverId}).then((response) => {
          document.title = response.data.title
          this.info = response.data
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
      this.timer = setInterval(() => {
        this.sendMessage = []
        if (this.id) {
          this.$http.post(this.apiURL + 'member/message/chat.jhtml', {prevContentId: this.prevChatId, wxbdopenId: this.id, receiverId: this.receiverId}).then((response) => {
            this.info.content.push(...response.data.content)
          })
        }
      }, 500)
    },
    send: function () {
      if (this.text.trim()) {
        this.$http.post(this.apiURL + 'member/message/sendChat.jhtml', {prevChatId: this.prevChatId, wxbdopenId: this.id, receiverId: this.receiverId, content: encodeURI(this.text)}).then((response) => {
          this.text = ''
        }, (err) => {
          alert(JSON.stringify(err))
        })
      }
    }
  },
  watch: {
    info: function () {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight)
      }, 10)
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
    document.title = ''
    this.getCustomers()
  },
  computed: {
    receiverId: function () {
      return this.$route.params.id
      // return 120
    },
    prevChatId: function () {
      return this.info.content.length ? this.info.content[this.info.content.length - 1].contentId : 0
    },
    height: function () {
      return document.documentElement.clientHeight + 'px'
    }
  },
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
