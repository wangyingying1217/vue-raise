<template>
  <transition name="fade">
    <div class="tipWrap" v-show="mask">
      <div class="tip" v-html="info"></div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      mask: false
    }
  },
  props: ['info'],
  watch: {
    // 提示信息1500ms后消失
    info: function (val, oldVal) {
      if (this.info) {
        this.mask = true
        setTimeout(() => {
          this.mask = false
          setTimeout(() => {
            this.$emit('update:info', '')
          }, 300)
        }, 1500)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

.tipWrap{
	position:fixed;
	top:10rem;
	bottom:0;
	left:0;
	right:0;
	text-align:center;
	z-index:99;
}
.tip{
	display:inline-block;
	font-size:0.7rem;
	line-height:1.6rem;
	padding:0.2rem 1rem;
	background: rgba(0,0,0,0.6);
	border-radius:0.1rem;
	color:#ffffff;
}
//渐入渐出切换效果
.fade-enter-active,.fade-leave-active{
  transition:all .3s ease;
}
.fade-enter, .fade-leave-active{
  opacity:0;
}
</style>
