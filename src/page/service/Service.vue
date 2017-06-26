<template>
  <div class="text-style" v-if="show" v-html="info" :style="{'min-height': height}">
  </div>
</template>

<script>
export default {
  props: ['apiURL'],
  data () {
    return {
      info: '',
      show: false
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '服务条款'
      this.$http.get(this.apiURL + 'aboutUs/terms_service.jhtml').then((response) => {
        this.info = response.data.terms
        this.show = true
        this.$indicator.close()
      }, () => {
        this.$indicator.close()
        alert('请求失败')
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
