<template>
  <div class="question" v-if="show">
    <!-- 提问人头像 -->
    <div class="avater">
      <img :src="info.pic" alt="pic">
    </div>
    <!-- 提问人用户名 -->
    <p class="userName">{{info.userName}}</p>
    <!-- 提问人个性签名 -->
    <p class="idiograph">{{info.idiograph}}</p>
    <!-- 提问按钮 -->
    <router-link v-if="!info.isMe" :to="'/chat/'+info.userId" class="button">向他提问</router-link>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      show: false,
      tip: '',
      info: {}
    }
  },
  methods: {
    getCustomers: function () {
      document.title = ''
      this.$http.get(this.apiURL + 'member/message/leaveWord.jhtml?wxbdopenId=' + this.id + '&contentId=' + this.contentId).then((response) => {
        this.info = response.data
        this.show = true
        this.$indicator.close()
      }, () => {
        this.$indicator.close()
        this.tip = '请求失败'
      })
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
  },
  computed: {
    contentId: function () {
      return this.$route.params.id
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.question{
  text-align: center;
  padding: 3rem 0;
  background: #fff;
  height: 100%;
  width: 100%;
  position: absolute;
  box-sizing: border-box;
  .avater{
    display: inline-block;
    width:3.6rem;
    height:3.6rem;
    background:#ffffff;
    border-radius:50%;
    overflow: hidden;
    margin-bottom: 0.5rem;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .userName{
    width: 11rem;
    font-size:0.7rem;
    text-align:center;
    line-height:1.2rem;
    margin: 0 auto;
    margin-bottom: 0.5rem;
  }
  .idiograph{
    .userName;
    margin-bottom:1rem;
  }
  .button{
    display: inline-block;
    color: #333;
    width: 11rem;
    font-size:0.7rem;
    line-height: 2rem;
    border: 1px solid #ccc;
    border-radius: 0.2rem;
  }
}
</style>
