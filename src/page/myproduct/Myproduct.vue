<template>
  <div>
    <ProductList :info="info" :type="'inline'"></ProductList>
    <Nodata :showSwitch="info.length" :type="'online'"></Nodata>
    <LoadMore :info="loadMore"></LoadMore>
  </div>
</template>

<script>
import ProductList from '@/components/ProductList'
import Nodata from '@/components/Nodata'
import LoadMore from '@/components/LoadMore'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: [],
      page: 1,
      loadMore: {
        state: ''
      }
    }
  },
  components: {
    ProductList,
    Nodata,
    LoadMore
  },
  methods: {
    getCustomers: function () {
      document.title = '在线商品'
      if (this.id) {
        this.$http.get(this.apiURL + 'member/online/list.jhtml?wxbdopenId=' + this.id + '&page=' + this.page).then((response) => {
          this.info = response.data
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    }
  },
  watch: {
    loadMore: {
      handler: function (val, oldVal) {
        if (val.state === 'loading') {
          this.page++
          this.$http.get(this.apiURL + 'member/online/list.jhtml?wxbdopenId=' + this.id + '&page=' + this.page).then((response) => {
            if (response.data.length) {
              this.info.push(...response.data)
              this.loadMore.state = ''
            } else {
              this.loadMore.state = 'loaded'
            }
          }, () => {
            alert('请求失败')
          })
        }
      },
      deep: true
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
    this.getCustomers()
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
</style>
