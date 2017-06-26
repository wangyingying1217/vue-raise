<template>
  <transition name="fade">
    <div class="tipWrap" v-show="mask">
      <div class="tip">{{info.text}}</div>
    </div>
  </transition>
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
    info: {
      handler: function (val, oldVal) {
        this.state = this.info
      },
      deep: true
    },
    state: {
      handler: function (val, oldVal) {
        if (val.text !== '') {
          this.mask = true
          setTimeout(() => {
            this.mask = false
            setTimeout(() => {
              this.state.text = ''
            }, 300)
          }, 1500)
        }
      },
      deep: true
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
	height:2rem;
	font-size:0.7rem;
	line-height:2rem;
	padding:0 1rem;
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
