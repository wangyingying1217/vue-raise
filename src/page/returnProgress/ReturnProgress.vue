<template>
  <div v-if="show">
    <TimeEvolve :info="info"></TimeEvolve>
    <Nodata :showSwitch="info.length" :type="'returnProgress'"></Nodata>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'
import TimeEvolve from '@/components/TimeEvolve'

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
      document.title = '回报进展'
      if (this.contentId && this.id) {
        this.$http.get(this.apiURL + 'member/returnEvolve.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id).then((response) => {
          this.info = response.data
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
    TimeEvolve,
    Nodata
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
