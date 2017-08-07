<template>
  <div class="my-collect">
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
        href: '/mycoupons/integral',
        name: '积分'
      },
      {
        href: '/mycoupons/discount',
        name: '优惠券'
      }]
    }
  },
  components: {
    Tabmenu
  },
  created() {
    document.title = '积分优惠券'
  },
  watch: {
    $route: function () {
      document.title = '积分优惠券'
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.my-collect{
  padding-top: 2rem
}
</style>
