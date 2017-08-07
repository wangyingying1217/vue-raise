<template>
  <div class="text-style" v-if="show" :style="{'min-height': height}">
    <p>联系电话：{{info.phone}}</p>
    <p>电子邮箱：{{info.email}}</p>
    <p>邮政编码：{{info.zipCode}}</p>
    <p>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：{{info.address}}</p>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
export default {
  props: ['apiURL'],
  data () {
    return {
      info: [],
      show: false,
      tip: ''
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '联系我们'
      this.$http.get(this.apiURL + 'aboutUs/contact_us.jhtml').then((response) => {
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
    height: function () {
      return document.documentElement.clientHeight + 'px'
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
</style>
