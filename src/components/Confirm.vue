<template>
  <div class="mask">
    <div class="confirm">
      <div class="confirm-title">{{info.title}}
        <span class="confirm-close" @click="cancel"></span>
      </div>
      <div class="confirm-content">{{info.name}}</div>
      <div class="confirm-btnwrap">
        <a class="confirm-btn" @click="confirm">确定</a>
        <a class="confirm-btn" @click="cancel">取消</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mask: true
    }
  },
  props: ['info'],
  methods: {
    cancel: function () {
      this.$emit('confirm', false)
    },
    confirm: function () {
      this.$emit('confirm', true)
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

.mask{
	position:fixed;
	top:0;
	left:0;
	width:100%;
	height:100%;
	z-index:99;
	background-color:rgba(0, 0, 0, 0.3);
}
.confirm{
	position:absolute;
	top:7.6rem;
	left:2rem;
	z-index:10;
	width:14rem;
	border-radius:0.1rem;
	background:#ffffff;
}
.confirm-title{
  height:2rem;
  line-height:2rem;
	padding:0 0.7rem;
	font-size:0.7rem;
	color:#333333;
	background-color:#f8f8f8;
  border-bottom:1px solid #eeeeee;
	border-radius:0.1rem 0.1rem 0 0;
  overflow:hidden;
}
.confirm-close{
	float:right;
	width:1.2em;
	height:2rem;
	background:url("../../static/image/close.png") no-repeat center center;
  background-size: contain;
}
.confirm-content{
	padding:1.3rem 1rem;
	line-height:1rem;
  font-size:0.7rem;
	word-break:break-all;
}
.confirm-btnwrap{
	text-align:center;
	padding:0 0 1rem;
}
.confirm-btn{
	display:inline-block;
	height:1.6rem;
	line-height:1.6rem;
	margin:0 1rem;
	padding:0 0.7rem;
	font-size:0.7rem;
  color:#ffffff;
  background-color:#cc0000;
  border:1px solid #dedede;
	border-radius:0.1rem;
}
</style>
