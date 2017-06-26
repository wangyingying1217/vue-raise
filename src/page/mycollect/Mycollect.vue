<template>
  <div class="my-collect" v-if="show">
    <Tabmenu :tabInfo = "tabInfo"></Tabmenu>
    <router-view :info="info" :type="'delete'" @removeRaise="removeRaise" @removeProduct="removeProduct"></router-view>
    <Confirm :info="confirmInfo" @confirm="confirm" v-show="confirmState"></Confirm>
    <Nodata :showSwitch="info.length" :type="state"></Nodata>
    <LoadMore :info="loadMore"></LoadMore>
  </div>
</template>

<script>
import Confirm from '@/components/Confirm'
import Tabmenu from '@/components/Tabmenu'
import Nodata from '@/components/Nodata'
import LoadMore from '@/components/LoadMore'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      tabInfo: [{
        href: '/mycollect/raise',
        name: '众筹'
      }, {
        href: '/mycollect/product',
        name: '商品'
      }],
      info: [],
      page: 1,
      type: '',
      contentId: '',
      show: false,
      confirmInfo: {
        title: '提示',
        name: '您确定要删除此条回复？'
      },
      confirmState: false,
      loadMore: {
        state: ''
      }
    }
  },
  components: {
    Confirm,
    Tabmenu,
    Nodata,
    LoadMore
  },
  methods: {
    getCustomers: function () {
      document.title = '我的收藏'
      if (this.id) {
        this.page = 1
        this.$http.get(this.url).then((response) => {
          this.info = response.data[this.state]
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    },
    removeRaise: function (id) {
      this.confirmState = true
      this.type = 'removeRaise'
      this.contentId = id
      this.confirmInfo.name = '您确定要取消收藏此条众筹？'
    },
    removeProduct: function (id) {
      this.confirmState = true
      this.type = 'removeProduct'
      this.contentId = id
      this.confirmInfo.name = '您确定要取消收藏此条商品？'
    },
    confirm: function (val) {
      this.confirmState = false
      if (val && this.type === 'removeRaise') {
        this.info.forEach((item, index) => {
          if (item.concernId === this.contentId) {
            this.info.splice(index, 1)
          }
        })
        this.$http.post(this.apiURL + 'member/delete_concern.jhtml?wxbdopenId=' + this.id + '&id=' + this.contentId).then((response) => {})
      } else if (val && this.type === 'removeProduct') {
        this.info.forEach((item, index) => {
          if (item.concernId === this.contentId) {
            this.info.splice(index, 1)
          }
        })
        this.$http.post(this.apiURL + 'member/delete_collect.jhtml?wxbdopenId=' + this.id + '&id=' + this.contentId).then((response) => {})
      }
    }
  },
  created() {
    this.getCustomers()
  },
  watch: {
    loadMore: {
      handler: function (val, oldVal) {
        if (val.state === 'loading') {
          this.page ++
          this.$http.post(this.url).then((response) => {
            if (response.data.length) {
              this.info.push(...response.data[this.state])
              this.loadMore.state = ''
            } else {
              this.loadMore.state = 'loaded'
            }
          }, () => {
            this.$indicator.close()
            alert('获取失败')
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
  computed: {
    state: function () {
      return this.$route.path.split('/')[2]
    },
    url: function () {
      if (this.state === 'raise') {
        return this.apiURL + 'member/conRaise.jhtml?wxbdopenId=' + this.id + '&page=' + this.page
      } else if (this.state === 'product') {
        return this.apiURL + 'member/colProduct.jhtml?wxbdopenId=' + this.id + '&page=' + this.page
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.my-collect{
  padding-top: 2.5rem;
}
</style>
