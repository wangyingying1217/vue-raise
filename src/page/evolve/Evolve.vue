<template>
  <div v-if="show">
    <Develop :info="info" :contentId="contentId"></Develop>
    <Nodata :showSwitch="info.length" :type="'update'"></Nodata>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'
import Develop from '@/components/Develop'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: [],
      show: false
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '项目动态'
      if (this.contentId && this.id) {
        this.$http.get(this.apiURL + 'evolve.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id).then((response) => {
          this.info = response.data.dynamic
          this.show = true
          this.$indicator.close()
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
    Nodata,
    Develop
  },
  computed: {
    contentId: function () {
      return this.$route.params.contentId
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
</style>
