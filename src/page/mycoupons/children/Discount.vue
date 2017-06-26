<template>
  <div v-if="show">
    <dt class="title" v-if="valid.length">可用优惠券</dt>
    <Coupon :info="valid"></Coupon>
    <dt class="title" v-if="invalid.length">历史优惠券</dt>
    <Coupon :info="invalid"></Coupon>
    <Nodata :showSwitch="valid.length || invalid.length" :type="'coupon'"></Nodata>
  </div>
</template>

<script>
import Coupon from '@/components/Coupon'
import Nodata from '@/components/Nodata'

const VALID = 1

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      valid: [],
      invalid: [],
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
        this.$http.post(this.apiURL + 'member/viewCoupon.jhtml?wxbdopenId=' + this.id).then((response) => {
          let validArr = []
          let invalidArr = []
          response.data.discount.forEach(function (item) {
            if (item.state === VALID) {
              validArr.push(item)
            } else {
              invalidArr.push(item)
            }
          })
          this.valid = validArr
          this.invalid = invalidArr
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
  height: 1.57rem;
  line-height: 1.57rem;
  font-size: 0.6rem;
  color: #666666;
  padding: 0 0.5rem;
}
</style>
