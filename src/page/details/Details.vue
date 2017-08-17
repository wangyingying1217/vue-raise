<template>
  <div class="bg" v-if="show" :style="{'min-height': height}">
    <div class="detial-wrapper">
      <!-- 视频 -->
      <div class="media" v-if="video">
        <video v-if="video" controls='controls' :src='video' :poster="poster"></video>
      </div>
      <!-- 详情描述 -->
      <div v-for="(item, index) in info" :key="index">
        <h1 v-if="item.titleEdit">{{item.title}}</h1>
        <div v-if="item.contentEdit" v-html="item.content"></div>
        <img v-if="item.picSrc" :src="item.picSrc" @click="preview(index)" alt="pic">
      </div>
    </div>
    <Tip :info.sync="tip"></Tip>
    <Nodata :showSwitch="info" type="detials"></Nodata>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      tip: '',
      show: false,
      video: '',
      poster: '',
      info: [],
      contentId: ''
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '项目详情'
      this.contentId = this.$route.params.contentId
      // 将发起的详情JSON直接拿过来进行遍历
      if (this.contentId && this.id) {
        this.$http.get(this.apiURL + 'projectDetails.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id).then((response) => {
          this.video = response.data.videos
          this.poster = response.data.poster
          this.info = response.data.intro
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          this.tip = '请求失败'
        })
      }
    },
    // 图片大图预览
    preview: function (index) {
      let page = index
      for (let i = 0; i < index; i++) {
        if (this.info[i].type === 0) {
          page--
        }
      }
      this.$router.push('/imagePreview/' + this.contentId + '/intro/' + page)
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
  components: {
    Nodata
  },
  computed: {
    height: function () {
      return document.documentElement.clientHeight + 'px'
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less'>
.bg{
  background: #fff;
  overflow: auto;
}
.detial-wrapper{
	width:16.5rem;
	margin:0.4rem auto 1rem;
  .media{
    width: 100%;
    height: 6rem;
    margin: 0.4rem 0;
  }
  h1{
    font-size:1rem;
    color:#333333;
    font-weight:normal;
    line-height:2.6rem;
    text-align:center;
  }
  p{
    font-size:0.7rem;
    line-height:1.3rem;
    color:#666666;
    text-indent: 2em;
  }
  video{
    width:100%;
    height: 100%;
  }
  img{
    width:100%;
    margin: 0.4rem 0;
  }
}
</style>
