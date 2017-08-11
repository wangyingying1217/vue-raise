<template>
  <div class="mask">
    <div class="prompt">
      <div class="prompt-title">{{info.title}}
        <span class="prompt-close" @click="cancel"></span>
      </div>
      <div class="prompt-content">
        <p>{{info.name}}</p>
        <textarea class="prompt-textarea" v-model="text"></textarea>
      </div>
      <div class="prompt-btnwrap">
        <a class="prompt-btn" @click="confirm">确定</a>
        <a class="prompt-btn" @click="cancel">取消</a>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 返回值
 * 布尔值：true（确认）/ false（取消）
 */
export default {
  data () {
    return {
      text: ''
    }
  },
  props: ['info'],
  methods: {
    cancel: function () {
      this.$emit('confirm', {'text': this.text, 'state': false})
    },
    confirm: function () {
      this.$emit('confirm', {'text': this.text, 'state': true})
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
.prompt{
	position:absolute;
	top:6rem;
	left:2rem;
	z-index:10;
	width:14rem;
	border-radius:0.1rem;
	background:#ffffff;
}
.prompt-title{
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
.prompt-close{
	float:right;
	width:1.2em;
	height:2rem;
	background:url("../image/close.png") no-repeat center center;
  background-size: contain;
}
.prompt-content{
	padding:0.7rem 1rem;
	line-height:1rem;
  font-size:0.7rem;
	word-break:break-all;
}
.prompt-textarea{
  width: 100%;
  height: 3.3rem;
  font-size:0.7rem;
  line-height:1rem;
  margin-top: 0.5rem;
  padding: 0.2rem;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
.prompt-btnwrap{
	text-align:center;
	padding:0 0 1rem;
}
.prompt-btn{
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
