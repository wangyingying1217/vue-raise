<template>
  <div class="search-wrapper" v-if="show">
    <RaiseList :info="info" :apiURL="apiURL" :id="id"></RaiseList>
    <Nodata :showSwitch="info.length" type="content"></Nodata>
    <LoadMore :info="loadMore"></LoadMore>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'
import LoadMore from '@/components/LoadMore'
import RaiseList from '@/components/RaiseList'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: [],
      show: false,
      page: 1,
      loadMore: {
        state: ''
      }
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
    loadMore: {
      handler: function (val, oldVal) {
        if (val.state === 'loading') {
          this.page ++
          this.$http.post(this.apiURL + 'searching.jhtml', {'page': this.page, 'type': this.type, 'value': this.value}).then((response) => {
            if (response.data.length) {
              this.info = this.info.concat(response.data)
              this.loadMore.state = ''
            } else {
              this.loadMore.state = 'loaded'
            }
          }, () => {
            this.$indicator.close()
            alert('请求失败')
          })
        }
      },
      deep: true
    }
  },
  components: {
    Nodata,
    LoadMore,
    RaiseList
  },
  computed: {
    searchInfo: function () {
      return {
        page: this.page,
        itemType: this.searchType[0].title,
        dataType: this.searchType[1].title,
        raiseType: this.searchType[2].title
      }
    },
    type: function () {
      return this.$route.params.type
    },
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
