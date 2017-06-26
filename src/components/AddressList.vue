<template>
  <div class="address-wrapper" v-show="state.name">
    <transition name="slide-fade" mode="out-in">
      <ul class="Region" v-show="state.name=='province'">
        <li v-for="(item,index) in positionData" @click="province(item)">{{item.p}}</li>
      </ul>
    </transition>
    <transition name="slide-fade" mode="out-in">
      <ul class="Region" v-show="state.name=='city'">
        <li v-for="(item,index) in provinceData.c" @click="city(item)">{{item.n}}</li>
      </ul>
    </transition>
    <transition name="slide-fade" mode="out-in">
      <ul class="Region" v-show="state.name=='county'">
        <li v-for="(item,index) in cityData.a" @click="county(item.s)">{{item.s}}</li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['info'],
  data () {
    return {
      state: '',
      positionData: [],
      provinceData: {
        p: '',
        c: []
      },
      cityData: {
        n: '',
        a: []
      },
      countyData: {}
    }
  },
  methods: {
    getCustomers: function () {
      this.$http.get('../../static/js1/city.json').then((response) => {
        this.positionData = response.data.citylist
      })
    },
    province: function (item) {
      this.provinceData = item
      this.state.name = 'city'
    },
    city: function (item) {
      this.cityData = item
      if (item.a) {
        this.state.name = 'county'
      } else {
        this.state.name = ''
        this.$emit('address', this.provinceData.p + '/' + this.cityData.n)
      }
    },
    county: function (value) {
      this.state.name = ''
      this.$emit('address', this.provinceData.p + '/' + this.cityData.n + '/' + value)
    }
  },
  created () {
    // 组件创建完后获取数据，
    this.getCustomers()
  },
  watch: {
    info: {
      handler: function (val, oldVal) {
        this.state = this.info
      },
      deep: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.address-wrapper{
  background: #f5f5f5;
  .Region{
    li{
      font-size:0.7rem;
      line-height:2rem;
      padding:0 1rem;
      box-sizing:border-box;
      border-top:1px solid #cccccc;
      background:#ffffff;
      &:after{
        content:"";
        float:right;
        width:0.4rem;
        height:2rem;
        background:url("../../static/image/orderRight.png") no-repeat right center;
        background-size: 0.4rem;
      }
    }
  }
}
</style>
