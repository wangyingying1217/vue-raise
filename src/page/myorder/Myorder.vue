<template>
  <div class="my-raise">
    <Tabmenu :tabInfo = "tabInfo"></Tabmenu>
    <router-view :apiURL="apiURL" :id="id"></router-view>
  </div>
</template>

<script>
import Tabmenu from '@/components/Tabmenu'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      tabInfo: [{
        href: '/myorder/raise',
        name: '众筹'
      }, {
        href: '/myorder/product',
        name: '商品'
      }]
    }
  },
  components: {
    Tabmenu
  },
  created() {
    document.title = '订单记录'
  },
  watch: {
    $route: function () {
      document.title = '订单记录'
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.my-raise{
  padding-top: 2rem;
}
</style>
