<template>
  <div class="">
    <div class="text-style" v-if="show" v-html="info" :style="{'min-height': height}">
    </div>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
export default {
  props: ['apiURL'],
  data () {
    return {
      show: false,
      tip: '',
      info: []
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '公司简介'
      this.$http.get(this.apiURL + 'aboutUs/company_profile.jhtml').then((response) => {
        this.info = response.data.intro
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
