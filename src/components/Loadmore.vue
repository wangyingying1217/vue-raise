<template>
  <div v-if="info.state !== 'loaded'">
    <div class="update" v-if="info.state === 'loading'">加载更多
      <div data-loader="circle"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mask: false,
      state: ''
    }
  },
  props: ['info'],
  watch: {
    $route: function () {
      this.state = ''
    }
  },
  created () {
    // 组件创建完后执行，
    if (window.addEventListener) {
      window.addEventListener('scroll', () => {
        if (this.info.state !== 'loaded') {
          var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
          var windowHeight = document.documentElement.clientHeight || document.body.clientHeight
          if (scrollTop + windowHeight === scrollHeight && scrollTop !== 0) {
            this.info.state = 'loading'
          }
        }
      }, false)
    } else {
      window.attachEvent('scroll', () => {
        if (this.info.state !== 'loaded') {
          var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
          var windowHeight = document.documentElement.clientHeight || document.body.clientHeight
          if (scrollTop + windowHeight === scrollHeight && scrollTop !== 0) {
            this.info.state = 'loading'
          }
        }
      }, false)
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
