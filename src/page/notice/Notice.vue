<template>
  <div class="text-style" v-if="show" :style="{'min-height': height}">
    <!-- 公告标题 -->
    <h2 v-html="info.title"></h2>
    <!-- 公告时间 -->
    <p class="time" v-html="info.time"></p>
    <!-- 公告内容 -->
    <div v-html="info.content"></div>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
export default {
  props: ['apiURL'],
  data () {
    return {
      info: {},
      tip: '',
      show: false
    }
  },
  methods: {
    getCustomers: function () {
      document.title = ''
      this.$http.get(this.apiURL + 'article/viewNotice.jhtml?id=' + this.noticeId).then((response) => {
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
    $route: function () {
      this.getCustomers()
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  },
  computed: {
    noticeId: function () {
      return this.$route.params.id
    },
    height: function () {
      return document.documentElement.clientHeight + 'px'
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.time{
  text-align: right;
}
</style>
