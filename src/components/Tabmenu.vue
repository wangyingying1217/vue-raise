<template>
  <div class="tab-menu">
    <router-link :to="{path:item.href}" replace v-for="item in tabInfo" :key="item.name" @click.native="scollTop">{{item.name}}</router-link>
  </div>
</template>

<script>
/**
 * 参数
 * tabInfo：Tab切换的显示信息
 */
export default {
  data () {
    return {}
  },
  props: ['tabInfo'],
  methods: {
    scollTop: function () {
      /* eslint-disable no-unused-vars */
      var Timer = 0
      function returnTop() {
        window.scrollBy(0, -100)
        if (document.body.scrollTop > 0) {
          Timer = setTimeout(function () {
            returnTop()
          }, 50)
        }
      }
      returnTop()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.tab-menu{
  display: flex;
  height:2rem;
	position:absolute;
	left:0;
	top:0;
	width:100%;
	z-index:10;
	background:#fff;
  a{
    flex: 1 1 auto;
  	text-align:center;
  	box-sizing:border-box;
    line-height:2rem;
    font-size:0.8rem;
    color: #333;
  	border-bottom:1px solid #cccccc;
    &.act{
      color:#cc0000;
    	border-bottom:0.1rem solid #cc0000;
    }
  }
}
</style>
