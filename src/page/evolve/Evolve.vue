<template>
  <div v-if="show">
    <!-- 项目动态列表 -->
    <ul class="evolve">
      <li class="clearfix" v-for="item in info">
        <!-- 背景图标 -->
        <div class="icon"></div>
        <div class="infobox">
          <!-- 用户名 -->
          <p class="title">
            {{item.userName}}
            <!-- 时间 -->
            <span class="date fr">{{item.dayNum}}</span>
          </p>
          <!-- 动态内容 -->
          <p class="info" v-html="item.context"></p>
          <!-- 动态图片（点击查看大图） -->
          <div class="clearfix">
            <router-link :to="'/imagePreview/'+contentId+'/dynamic/'+index+'/' + item.dicId" tag="div"  class="img" v-for="(src, index) in item.pic" key="index" v-bind:style="'background: url('+src+') no-repeat;background-size: cover;'"></router-link>
          </div>
        </div>
      </li>
    </ul>
    <!-- 组件 -->
    <Tip :info.sync="tip"></Tip>
    <Nodata :showSwitch="info.length" type="update"></Nodata>
  </div>
</template>

<script>
import Nodata from '@/components/Nodata'

export default {
  props: ['apiURL', 'id'],
  data () {
    return {
      info: [],
      tip: [],
      show: false
    }
  },
  methods: {
    getCustomers: function () {
      document.title = '项目动态'
      if (this.contentId && this.id) {
        this.$http.get(this.apiURL + 'evolve.jhtml?contentId=' + this.contentId + '&wxbdopenId=' + this.id).then((response) => {
          this.info = response.data.dynamic
          this.show = true
          this.$indicator.close()
        }, () => {
          this.$indicator.close()
          this.tip = '请求失败'
        })
      }
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
    contentId: function () {
      return this.$route.params.contentId
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang='less' scoped>
.evolve{
	padding:0 0.6rem 0 0.9rem;
  background: #fff;
  li{
  	padding:0.5rem 0 1.5rem;
  	position:relative;
    &:before{
    	content:"";
    	height:100%;
    	width:1px;
    	background:#cccccc;
    	position:absolute;
    	left:0.6rem;
    	top:1rem;
    }
    &:last-of-type:before{
      display:none;
    }
  }
  .icon{
  	float:left;
  	width:1.2rem;
  	height:1.2rem;
  	background:url("../../image/Pointer.png") no-repeat;
  	background-size:contain;
    position: relative;
    z-index: 9
  }
  .infobox{
  	float:right;
  	width:14.6rem;
  }
  .title{
  	font-size:0.7rem;
  	line-height:1.2rem;
  	color:#333333;
  }
  .info,.date{
  	font-size:0.7rem;
  	line-height:1rem;
  	color:#999999;
  }
  .info{
  	margin:0.4rem 0 0;
  }
  .img{
  	width:3.15rem;
  	height:3.15rem;
  	margin-right:0.5rem;
  	margin-top:0.5rem;
  	float:left;
  }
}
</style>
