<template>
  <div class="img-preview" v-if="show">
    <div :style="{'height':height}" @click="goBack">
      <mt-swipe :showIndicators="url.length>1?true:false" :auto="0" :defaultIndex="page" :continuous="false">
        <mt-swipe-item v-for="(item, index) in url" :key="index" :style="{'background': 'url('+item+') no-repeat center center/contain'}"></mt-swipe-item>
      </mt-swipe>
    </div>
  </div>
</template>

<script>
export default{
  data () {
    return {
      show: false,
      url: []
    }
  },
  props: ['apiURL', 'id'],
  methods: {
    getCustomers: function () {
      document.title = ''
      if (this.id) {
        this.$http.post(this.apiURL + 'viewBigPic.jhtml', this.params).then((response) => {
          this.url = response.data
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          alert('图片获取失败')
        })
      }
    },
    goBack: function () {
      this.$router.go(-1)
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
    id: function () {
      this.getCustomers()
    }
  },
  computed: {
    height: function () {
      return document.documentElement.clientHeight + 'px'
    },
    params: function () {
      let data = {}
      data.cfId = this.$route.params.id
      data.picType = this.$route.params.type
      if (this.$route.params.itemId) {
        data.csId = this.$route.params.itemId
      }
      return data
    },
    page: function () {
      return this.$route.params.page
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.img-preview{
	background-color: #000;
  .mint-swipe-indicators{
    bottom: 2rem;
    .mint-swipe-indicator{
      width: 0.5rem;
      height: 0.5rem;
      display: inline-block;
      border-radius: 100%;
      background: #ccc;
      opacity: 0.4;
      margin: 0 0.2rem;
      &.is-active{
        opacity: 1;
      }
    }
  }
}
</style>
