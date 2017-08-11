<template>
  <div class="address-wrapper" v-show="state">
    <!-- 省列表 -->
    <transition name="slide-fade" mode="out-in">
      <ul class="Region" v-show="state=='province'">
        <li v-for="(item,index) in positionData" @click="province(item)">{{item.p}}</li>
      </ul>
    </transition>
    <!-- 市列表 -->
    <transition name="slide-fade" mode="out-in">
      <ul class="Region" v-show="state=='city'">
        <li v-for="(item,index) in provinceData.c" @click="city(item)">{{item.n}}</li>
      </ul>
    </transition>
    <!-- 县列表 -->
    <transition name="slide-fade" mode="out-in">
      <ul class="Region" v-show="state=='county'">
        <li v-for="(item,index) in cityData.a" @click="county(item.s)">{{item.s}}</li>
      </ul>
    </transition>
  </div>
</template>

<script>
import cityData from '@/service/city.js'
/**
 * 参数
 * load：单次请求开关（）
 * Boff：是否已经加载完成（true：未加载完成   false：已经加载完成）；
 *返回值：
 *省/市/县
 */
export default {
  props: ['state', 'apiURL'],
  data () {
    return {
      positionData: cityData,
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
    province: function (item) {
      this.provinceData = item
      this.$emit('update:state', 'city')
    },
    city: function (item) {
      this.cityData = item
      if (item.a) {
        this.$emit('update:state', 'county')
      } else {
        this.$emit('update:state', '')
        this.$emit('address', this.provinceData.p + '/' + this.cityData.n)
      }
    },
    county: function (value) {
      this.$emit('update:state', '')
      this.$emit('address', this.provinceData.p + '/' + this.cityData.n + '/' + value)
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
        background:url("../image/orderRight.png") no-repeat right center;
        background-size: 0.4rem;
      }
    }
  }
}
</style>
