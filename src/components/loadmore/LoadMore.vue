<template>
  <div v-show="show">
    <!-- 数据加载中 -->
    <div class="update" v-if="Boff && load">加载更多
      <div data-loader="circle"></div>
    </div>
    <!-- 没有数据可以加载 -->
    <div class="update" v-if="!Boff">已经到底了~~</div>
  </div>
</template>

<script>
/**
 * 参数
 * load：单次请求开关（）
 * Boff：是否已经加载完成（true：未加载完成   false：已经加载完成）；
 */
export default {
  data () {
    return {
    }
  },
  props: ['load', 'Boff'],
  created () {
    // 绑定window的滚动事件
    let scroll = () => {
      // 如果有数据可以加载时执行
      if (this.Boff) {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeigh
        // 页面滚动到距离底部20px是更改单次请求状态，父页面进行加载数据
        if (scrollHeight - scrollTop - windowHeight < 20 && scrollTop !== 0) {
          this.$emit('update:load', true)
        }
      }
    }
    if (window.addEventListener) {
      window.removeEventListener('scroll', scroll, false)
      window.addEventListener('scroll', scroll, false)
    } else {
      window.detachEvent('scroll', scroll, false)
      window.attachEvent('scroll', scroll, false)
    }
  },
  computed: {
    // 页面未发生滚动时不显示组件
    show: function () {
      return (document.documentElement.scrollTop || document.body.scrollTop) !== 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.update{
	height:2rem;
	line-height:2rem;
	font-size:0.8rem;
	text-align:center;
	color:#999;
  margin-bottom: 0.5rem;
}
[data-loader=circle] {
	width: 0.8rem;
	height: 0.8rem;
	-webkit-animation: circle infinite .75s linear;
	-moz-animation: circle infinite .75s linear;
	-o-animation: circle infinite .75s linear;
	animation: circle infinite .75s linear;
	border: 2px solid #999;
	border-top-color: transparent;
	border-radius: 100%;
	display: inline-block;
	vertical-align:middle;
	margin-left:0.1rem;
}
@-webkit-keyframes circle
{
	0%
	{
		-webkit-transform: rotate(0);
		-ms-transform: rotate(0);
		-o-transform: rotate(0);
		transform: rotate(0);
	}
	100%
	{
		-webkit-transform: rotate(360deg);
		-ms-transform: rotate(360deg);
		-o-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}
@-moz-keyframes circle
{
	0%
	{
		-webkit-transform: rotate(0);
		-ms-transform: rotate(0);
		-o-transform: rotate(0);
		transform: rotate(0);
	}
	100%
	{
		-webkit-transform: rotate(360deg);
		-ms-transform: rotate(360deg);
		-o-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}
@-o-keyframes circle
{
	0%
	{
		-webkit-transform: rotate(0);
		-ms-transform: rotate(0);
		-o-transform: rotate(0);
		transform: rotate(0);
	}
	100%
	{
		-webkit-transform: rotate(360deg);
		-ms-transform: rotate(360deg);
		-o-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}
@keyframes circle
{
	0%
	{
		-webkit-transform: rotate(0);
		-ms-transform: rotate(0);
		-o-transform: rotate(0);
		transform: rotate(0);
	}
	100%
	{
		-webkit-transform: rotate(360deg);
		-ms-transform: rotate(360deg);
		-o-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}
</style>
