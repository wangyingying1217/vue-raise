<template>
  <div v-if="show">
    <dt class="title">可用积分：<span class="red">{{point}}</span></dt>
    <Coupon :info="couponList" :type="'integral'"></Coupon>
    <Nodata :showSwitch="couponList.length" :type="'integral'"></Nodata>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'
import Coupon from '@/components/Coupon'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      couponList: [],
      point: '',
      show: false
    }
  },
  components: {
    Coupon,
    Nodata
  },
  methods: {
    getCustomers: function () {
      if (this.id) {
        this.$http.post(this.apiURL + 'member/viewPoint.jhtml?wxbdopenId=' + this.id).then((response) => {
          this.couponList = response.data.integral
          this.point = response.data.point
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('请求失败')
        })
      }
    }
  },
  created() {
    this.getCustomers()
  },
  watch: {
    id: function () {
      this.getCustomers()
    },
    $route: function () {
      this.getCustomers()
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.title {
  height: 2rem;
  line-height: 2rem;
  padding: 0 0.5rem;
  font-size: 0.53rem;
  color: #666666;
  background: #ffffff;
  margin: 0.5rem 0;
  border-top: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
}
</style>
