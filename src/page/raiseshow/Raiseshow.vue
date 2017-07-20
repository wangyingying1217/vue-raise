<template>
  <div class="RaiseShow">
    <Tabmenu :tabInfo = "tabInfo"></Tabmenu>
    <router-view :info="raise[state]"></router-view>
    <router-link :to="{ path: '/search/'+state}" v-if="raise[state].length>9" class="loadMore">查看更多>></router-link>
    <Nodata :showSwitch="raise[state].length" :type="'index'"></Nodata>
    <FooterBar type='raise'></FooterBar>
  </div>
</template>

<script>
import Tabmenu from '@/components/Tabmenu'
import Nodata from '@/components/Nodata'
import FooterBar from '@/components/FooterBar'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      raise: {
        his: [],
        hot: [],
        pre: []
      },
      tabInfo: [{
        href: '/hot',
        name: '热门众筹'
      },
      {
        href: '/his',
        name: '历史众筹'
      },
      {
        href: '/pre',
        name: '预热众筹'
      }]
    }
  },
  components: {
    Tabmenu,
    Nodata,
    FooterBar
  },
  methods: {
    getCustomers: function () {
      document.title = '众筹出版'
      this.$http.get(this.apiURL + 'zccb.jhtml').then((response) => {
        this.raise = response.data
        this.$indicator.close()
      }, () => {
        this.$indicator.close()
        alert('请求失败')
      })
    }
  },
  created() {
    this.getCustomers()
  },
  watch: {
    $route: function () {
      this.getCustomers()
    }
  },
  computed: {
    state: function () {
      return this.$route.path.substring(1)
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$indicator.open()
    next()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.RaiseShow{
  padding: 2.5rem 0 3rem;
}
.loadMore{
  display:block;
  text-align:center;
  line-height:2.4rem;
  font-size:0.78rem;
  background:#ffffff;
  color:#cc0000;
}
</style>
