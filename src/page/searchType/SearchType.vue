<template>
  <div class="search-wrapper" v-if="show">
    <!-- 搜索类型列表 -->
    <RaiseList :info="info" :apiURL="apiURL" :id="id"></RaiseList>
    <Nodata :showSwitch="info.length" type="content"></Nodata>
    <LoadMore :load.sync="loadState" :Boff= "loadBoff"></LoadMore>
    <Tip :info.sync="tip"></Tip>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'
import RaiseList from '@/components/RaiseList'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: [],
      show: false,
      page: 1,
      tip: '',
      loadState: false,
      loadBoff: true
    }
  },
  methods: {
    getCustomers: function () {
      document.title = this.value
      if (this.type) {
        this.$http.post(this.apiURL + 'searching.jhtml', {'page': this.page, 'type': this.type, 'value': this.value}).then((response) => {
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
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  },
  watch: {
   // 如果路由有变化，会再次执行该方法
    $route () {
      this.getCustomers()
    },
    loadState: function (val, oldVal) {
      if (val) {
        this.page ++
        this.$http.post(this.apiURL + 'searching.jhtml', {'page': this.page, 'type': this.type, 'value': this.value}).then((response) => {
          if (response.data.length) {
            this.info = this.info.concat(response.data)
            this.loadState = false
          } else {
            this.loadBoff = false
          }
        }, () => {
          this.$indicator.close()
          this.tip = '请求失败'
        })
      }
    }
  },
  components: {
    Nodata,
    RaiseList
  },
  computed: {
    // 搜索类别
    type: function () {
      return this.$route.params.type
    },
    // 搜索内容
    value: function () {
      return this.$route.params.value
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
// .search-wrapper{
//   padding-top: 2.5rem;
// }
</style>
